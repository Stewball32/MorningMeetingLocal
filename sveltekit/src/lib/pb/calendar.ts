import { getPbImageUrl, pb } from '$lib/pb';
import type { CalendarObservances } from '$lib/pb/types';
import Holidays from 'date-holidays';

export interface Holiday {
	name: string;
	description?: string;
	date: Date;
	local?: string;
	image?: string;
	school_day: boolean;
	type?: string;
}

export const getHolidayMap = async (year: number, month: number) => {
	const newHMap = new Map<number, Holiday[]>();
	console.log(`Fetching holidays for ${year}-${month + 1}`);

	const ignoredHolidays = ['Malcolm X Day', 'Harvey Milk Day'];

	// 1. Get federal holidays
	let holidays =
		new Holidays('US')
			.getHolidays(year)
			.filter((h) => !h.substitute && new Date(h.date).getMonth() === month)
			.filter((h) => !ignoredHolidays.includes(h.name))
			.map((h) => ({
				...h,
				description: '',
				date: new Date(h.date),
				local: 'federal',
				image: '',
				school_day: h.type != 'public'
			})) ?? [];

	// 2. Get state holidays
	const stateHolidays = new Holidays('US', 'CA')
		.getHolidays(year)
		.filter(
			(h) =>
				!h.substitute &&
				new Date(h.date).getMonth() === month &&
				!holidays.some((f) => f.name === h.name && f.date.toISOString() === h.date)
		)
		.filter((h) => !ignoredHolidays.includes(h.name))
		.map((h) => ({
			...h,
			description: '',
			date: new Date(h.date),
			local: 'state',
			image: '',
			school_day: h.type != 'public'
		}));

	//3. Merge federal and state holidays
	holidays = [...holidays, ...stateHolidays];

	// 4. Get local holidays from PocketBase
	const pbRecords = await pb.collection('calendar_observances').getFullList<CalendarObservances>({
		filter: 'is_active = true'
	});

	console.log('pbRecords', pbRecords);

	// 5. Merge PocketBase records with matching federal and state holidays
	const customHolidays = new Holidays();
	for (const record of pbRecords) {
		if (!record.dates || record.dates.length === 0) {
			// Try to match with federal by name
			const holidayIndex = holidays.findIndex((f) => f.name === record.name);
			if (holidayIndex !== -1) {
				// Merge federal holiday with PocketBase record
				holidays[holidayIndex] = {
					...holidays[holidayIndex],
					description: record.description ?? '',
					school_day: record.school_day ?? holidays[holidayIndex].school_day,
					image: record.image
						? getPbImageUrl(record.collectionId, record.id, record.image)
						: holidays[holidayIndex].image
				};
			}
		} else {
			// Explicit dates from PocketBase
			for (const date of record.dates) {
				customHolidays.setHoliday(date, {
					name: record.name,
					description: record.description ?? '',
					image: record.image ? getPbImageUrl(record.collectionId, record.id, record.image) : '',
					school_day: record.school_day ?? true,
					local: 'local',
					type: 'school'
				});
			}
		}
	}

	const localHolidays =
		customHolidays
			.getHolidays(year)
			.filter((h) => !h.substitute && new Date(h.date).getMonth() === month)
			.map((h) => ({
				...h,
				description: '',
				date: new Date(h.date),
				local: 'local',
				image: '',
				school_day: h.type != 'public'
			})) ?? [];

	for (const record of pbRecords) {
		if (!record.dates || record.dates.length === 0) continue; // Skip if no dates provided
		// Check if this record has explicit dates
		const holidayIndex = localHolidays.findIndex((f) => f.name === record.name);
		if (holidayIndex !== -1) {
			// Merge local holiday with PocketBase record
			localHolidays[holidayIndex] = {
				...localHolidays[holidayIndex],
				description: record.description ?? '',
				school_day: record.school_day ?? localHolidays[holidayIndex].school_day,
				image: record.image ? getPbImageUrl(record.collectionId, record.id, record.image) : '',
				local: 'local',
				type: 'school'
			};
		}
	}

	// 7. Combine and group by day
	holidays = [...holidays, ...localHolidays];

	for (const h of holidays) {
		const day = h.date.getDate();
		if (!newHMap.has(day)) newHMap.set(day, []);
		newHMap.get(day)!.push(h);
	}

	return newHMap;
};
