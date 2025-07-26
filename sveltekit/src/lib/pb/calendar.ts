import { getPbImageUrl, pb } from '$lib/pb/records';
import type { CalendarOccasionPB } from '$lib/pb/types';
import Holidays, { type HolidaysTypes } from 'date-holidays';

export interface Holiday extends HolidaysTypes.Holiday, CalendarOccasionPB {
	dateObj: Date;
}

export const getHolidayMap = async (year: number, month: number) => {
	const newHMap = new Map<number, Holiday[]>();
	let holiday = new Holidays();
	const pbRecords = await pb.collection('calendar_observances').getFullList<CalendarOccasionPB>({
		filter: 'hidden != true'
	});

	for (const record of pbRecords) {
		if (record.hidden || !record.dates || record.dates.length === 0) continue;
		for (const date of record.dates) {
			holiday.setHoliday(date, {
				pb: record.id,
				name: record.name,
				type: record.type ?? 'observance',
				description: record.description ?? '',
				school: record.school ?? 'full',
				image: record.image ? getPbImageUrl(record.collectionId, record.id, record.image) : ''
			});
		}
	}

	let holidayArray = holiday
		.getHolidays(year)
		.filter((h) => !h.substitute && new Date(h.date).getMonth() === month)
		.map(
			(h) =>
				({
					...h,
					dateObj: new Date(h.date)
				}) as Holiday
		);

	for (const h of holidayArray) {
		const day = h.dateObj.getDate();
		if (!newHMap.has(day)) newHMap.set(day, []);
		newHMap.get(day)!.push(h);
	}

	return newHMap;
};
