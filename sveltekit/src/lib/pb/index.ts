import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import type {
	ClassDaily,
	DailyRecord,
	IconRecord,
	GuestDaily,
	Student,
	StudentDaily,
	Teacher,
	TeacherDaily
} from './types';
import { getCurrentISOString, isISOString } from '$lib';

function createInstance() {
	return new PocketBase(PUBLIC_POCKETBASE_URL);
}

/**
 * Creates a new instance of PocketBase.
 * @returns A new PocketBase instance.
 */
export const pb = createInstance();

export const getPbImageUrl = (collectionId: string, recordId: string, fileId: string) => {
	return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileId}`;
};

/**
 * Gets the collection name for daily records based on the input collection.
 * @param collection - The collection name to check.
 * @returns The collection name for daily records or "" if invalid.
 */
const getDailyCollectionName = (collection: string) => {
	switch (collection) {
		case 'students':
			return 'student_dailies';
		case 'teachers':
			return 'teacher_dailies';
		case 'guests':
			return 'guest_dailies';
		case 'class_dailies':
			return 'class_dailies';
		default:
			console.error(`${collection} is not a "students or "teachers"`);
			return '';
	}
};

/**
 * Gets all students from the PocketBase database.
 * @returns An array of Student objects. Empty array if error or no data.
 * @throws Error if the request fails.
 */
export const getAllStudents = async (): Promise<Student[]> => {
	console.log('Fetching all students...');
	try {
		const studentData = (await pb
			.collection('students')
			.getFullList({ sort: 'name' })) as Student[];
		console.log('Fetched all students');
		return studentData;
	} catch (error) {
		console.error(error);
		return [];
	}
};

/**
 * Gets all teachers from the PocketBase database.
 * @returns An array of Teacher objects. Empty array if error or no data.
 */
export const getAllTeachers = async (): Promise<Teacher[]> => {
	try {
		const teacherData = (await pb.collection('teachers').getFullList({
			sort: 'name'
		})) as Teacher[];

		return teacherData;
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const getGuestAvatar = async (id: string): Promise<IconRecord | null> => {
	try {
		const guestAvatar = (await pb.collection('icons').getOne(id)) as IconRecord;
		return guestAvatar;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getGuestAvatarMap = async (): Promise<Map<string, IconRecord>> => {
	const guestAvatarMap = new Map<string, IconRecord>();
	try {
		const guestAvatars = (await pb.collection('icons').getFullList({
			filter: 'for_guests = true',
			sort: 'name'
		})) as IconRecord[];
		guestAvatars.forEach((avatar) => {
			guestAvatarMap.set(avatar.id, avatar);
		});
		return guestAvatarMap;
	} catch (error) {
		console.error(error);
		return guestAvatarMap;
	}
};

export const getClassDaily = async (isoString?: string): Promise<ClassDaily> => {
	const dateString = isoString ?? getCurrentISOString();
	if (!isISOString(dateString)) throw new Error(`Invalid date string: ${dateString}`);
	let classDaily: ClassDaily;
	try {
		if (isISOString(dateString)) {
			classDaily = await pb.collection('class_dailies').getFirstListItem(`date = "${dateString}" `);
		} else {
			// create a new class daily record if the date is not valid
			classDaily = await pb.collection('class_dailies').create({ date: dateString });
		}
		return classDaily;
	} catch (error) {
		console.debug(error);
		console.warn(`No class daily found! creating new daily...`);
		classDaily = await pb.collection('class_dailies').create({ date: dateString });
		if (!classDaily) throw new Error(`Error creating class daily: ${error}`);
		return classDaily;
	}
};

/**
 * Gets a map of student IDs to DailyRecords for today.
 * @date - YYYY-MM-DD format. Defaults to today's date.
 * @returns A Map of student IDs to DailyRecords. Empty map if error or no data.
 */
export const getStudentDailyMap = async (
	isoString?: string
): Promise<Map<string, StudentDaily>> => {
	const studentDailyMap = new Map<string, StudentDaily>();
	const dateString = isoString ?? getCurrentISOString();
	if (!isISOString(dateString)) return studentDailyMap;

	try {
		const studentDailies = (await pb.collection('student_dailies').getFullList({
			filter: `date = "${dateString}"`,
			sort: '-created'
		})) as StudentDaily[];
		studentDailies.forEach((daily) => {
			studentDailyMap.set(daily.student, daily);
		});
		return studentDailyMap;
	} catch (error) {
		console.error(error);
		return studentDailyMap;
	}
};

/**
 * Gets a map of teacher IDs to DailyRecords for today.
 * @date - YYYY-MM-DD format. Defaults to today's date.
 * @returns A Map of teacher IDs to DailyRecords. Empty map if error or no data.
 */
export const getTeacherDailyMap = async (
	isoString?: string
): Promise<Map<string, TeacherDaily>> => {
	const teacherDailyMap = new Map<string, TeacherDaily>();
	const dateString = isoString ?? getCurrentISOString();
	if (!isISOString(dateString)) return teacherDailyMap;

	try {
		const teacherDailies = (await pb.collection('teacher_dailies').getFullList({
			filter: `date = "${dateString}"`,
			sort: '-created'
		})) as TeacherDaily[];
		teacherDailies.forEach((daily) => {
			teacherDailyMap.set(daily.teacher, daily);
		});
		return teacherDailyMap;
	} catch (error) {
		console.error(error);
		return teacherDailyMap;
	}
};

/**
 * Gets a list of guest dailies for the specified date range.
 * @param before - The end date of the range (inclusive). Defaults to today.
 * @param after - The start date of the range (inclusive). Defaults to today.
 * @returns An array of GuestDaily records. Empty array if error or no data.
 */
export const getGuestDailiesRange = async ({
	before,
	after
}: { before?: string; after?: string } = {}): Promise<GuestDaily[]> => {
	const guestDailies: GuestDaily[] = [];
	const startDateString = after?.toString();
	const endDateString = before ?? getCurrentISOString();
	console.log('endDateString', endDateString);
	if (!isISOString(endDateString) && (!startDateString || !isISOString(startDateString)))
		return guestDailies;

	try {
		const filter = startDateString
			? `date >= "${startDateString}" && date <= "${endDateString}"`
			: `date = "${endDateString}"`;
		const guestDailiesData = (await pb.collection('guest_dailies').getFullList({
			filter
		})) as GuestDaily[];
		console.log(guestDailiesData);
		guestDailies.push(...guestDailiesData);
	} catch (error) {
		console.error(error);
		return guestDailies;
	}

	return guestDailies;
};

export const getGuestDailiesDate = async (isoString?: string): Promise<GuestDaily[]> => {
	const dateString = isoString ?? getCurrentISOString();
	if (!isISOString(dateString)) return [];
	try {
		const guestDailies = (await pb.collection('guest_dailies').getFullList({
			filter: `date = "${dateString}"`,
			sort: '-created'
		})) as GuestDaily[];
		return guestDailies;
	} catch (error) {
		console.error(error);
		return [];
	}
};

/**
 * Creates a new class daily record.
 * @param daily - The data for the new class daily record.
 * @returns The created ClassDaily record or null if an error occurs.
 */
const createClassDaily = async (daily: Partial<ClassDaily>) => {
	const dateString = daily?.date || getCurrentISOString();
	if (!isISOString(dateString)) throw new Error(`Invalid date string: ${dateString}`);
	daily = { ...daily, date: dateString };

	try {
		const record = await pb.collection('class_dailies').create(daily);
		return record;
	} catch (error) {
		throw Error(`Error creating class daily: ${error}`);
	}
};

/**
 * Updates a class daily record with the given data.
 * @param daily - The data to update the class daily record with.
 * @returns The updated ClassDaily record or null if an error occurs.
 */
export const updateClassDaily = async (daily: Partial<ClassDaily>) => {
	const dateString = daily?.date || getCurrentISOString();
	if (!isISOString(dateString)) throw new Error(`Invalid date string: ${dateString}`);
	daily = { ...daily, date: dateString };

	try {
		const existingDaily = await pb
			.collection('class_dailies')
			.getFirstListItem(`date = "${dateString}"`);
		if (!existingDaily) {
			console.log(`No existing class daily record found for ${dateString}. Creating a new one.`);
			return await createClassDaily(daily);
		}
		const record = await pb.collection('class_dailies').update(existingDaily.id, daily);
		return record;
	} catch (error) {
		throw Error(`Error updating class daily: ${error}`);
	}
};

/**
 * Creates a daily log for a student or teacher.
 * @param person - Student or Teacher object.
 * @param daily - Daily log data.
 * @returns The created DailyRecord or null if an error occurs.
 */
const createPersonDaily = async (person: Student | Teacher, daily: Partial<DailyRecord>) => {
	// I don't need to recheck if this is only called from func updateDaily.
	// uncomment if exporting this function.
	//
	// const isoString = daily?.date || getCurrentISOString()
	// if (!isISOString(isoString)) return null
	// daily = { ...daily, date: isoString }
	//
	// if (!["students", "teachers"].includes(person.collectionName)) {
	// 	console.error("Invalid collection name")
	// 	return null
	// }

	const dailyData: Partial<DailyRecord> = {
		...daily,
		...(person.collectionName === 'students' && { student: person.id }),
		...(person.collectionName === 'teachers' && { teacher: person.id })
	};
	const collectionName = getDailyCollectionName(person.collectionName);
	if (!collectionName) throw new Error(`Invalid collection name: ${person.collectionName}`);
	try {
		const record = await pb.collection(collectionName).create(dailyData);
		return record;
	} catch (error) {
		throw new Error(`Error creating ${collectionName} record: ${error}`);
	}
};

/**
 * Updates a person's daily log with the given data.
 * Creates a new log if one does not exist.
 * @param person - Student or Teacher object.
 * @param daily - The data to update the daily log with.
 * @returns The updated DailyRecord or null if an error occurs.
 */
export const updatePersonDaily = async (person: Student | Teacher, daily: Partial<DailyRecord>) => {
	const isoString = daily?.date || getCurrentISOString();
	if (!isISOString(isoString)) throw new Error(`Invalid date string: ${isoString}`);
	daily = { ...daily, date: isoString };

	if (!['students', 'teachers'].includes(person.collectionName)) {
		console.error('Invalid collection name');
		return null;
	}

	let dailyMap: Map<string, DailyRecord>;
	if (person.collectionName === 'students') {
		dailyMap = await getStudentDailyMap();
	} else {
		dailyMap = await getTeacherDailyMap();
	}
	const existingDaily = dailyMap.get(person.id);
	if (!existingDaily) {
		console.log(`No existing daily record found for ${person.name} on . Creating a new one.`);
		// Create a new daily record if one does not exist
		return await createPersonDaily(person, daily);
	}
	// Update the existing daily record
	const newDaily = { ...existingDaily, ...daily };
	const collectionName = getDailyCollectionName(person.collectionName);
	if (!collectionName) return null;
	try {
		const record = await pb.collection(collectionName).update(existingDaily.id, newDaily);
		return record;
	} catch (error) {
		console.error(error);
		return null;
	}
};

/**
 * Deletes a daily log for a student or teacher.
 * @param person - Student or Teacher object.
 * @param isoString - The date of the daily log to delete. Defaults to today's date.
 * @returns The deleted DailyRecord or null if an error occurs.
 * */
export const deletePersonDaily = async (person: Student | Teacher, isoString: string) => {
	isoString = isoString ?? getCurrentISOString();
	if (!isISOString(isoString)) throw new Error(`Invalid date string: ${isoString}`);

	if (!['students', 'teachers'].includes(person.collectionName)) {
		console.error('Invalid collection name');
		return null;
	}

	let dailyMap: Map<string, DailyRecord>;
	if (person.collectionName === 'students') {
		dailyMap = await getStudentDailyMap(isoString);
	} else {
		dailyMap = await getTeacherDailyMap(isoString);
	}
	const existingDaily = dailyMap.get(person.id);
	if (!existingDaily) {
		console.log(`No existing daily record found for ${person.name} on ${isoString}.`);
		return null;
	}
	const collectionName = getDailyCollectionName(person.collectionName);
	if (!collectionName) return null;
	try {
		const record = await pb.collection(collectionName).delete(existingDaily.id);
		return record;
	} catch (error) {
		console.error(error);
		return null;
	}
};

// findDaily
/**
 * Finds a daily log for a student or teacher by date.
 * * @param person - Student or Teacher object.
 * * @param isoString - The date of the daily log to find. Defaults to today's date.
 * * @returns The DailyRecord if found, or null if not found or an error occurs.
 */
export const findPersonDaily = async (person: Student | Teacher, isoString?: string) => {
	isoString = isoString ?? getCurrentISOString();
	if (!isISOString(isoString)) throw new Error(`Invalid date string: ${isoString}`);

	if (!['students', 'teachers'].includes(person.collectionName)) {
		console.error('Invalid collection name');
		return null;
	}

	let dailyMap: Map<string, DailyRecord>;
	if (person.collectionName === 'students') {
		dailyMap = await getStudentDailyMap(isoString);
	} else {
		dailyMap = await getTeacherDailyMap(isoString);
	}
	const existingDaily = dailyMap.get(person.id);
	if (!existingDaily) {
		console.log(`No existing daily record found for ${person.name} on ${isoString}.`);
		return null;
	}
	return existingDaily;
};

// createGuestDaily
/**
 * Creates a new guest daily record.
 * @param daily - The data for the new guest daily record.
 * @returns The created GuestDaily record or null if an error occurs.
 */
export const createGuestDaily = async (daily: Partial<GuestDaily>) => {
	const dateString = daily?.date || getCurrentISOString();
	if (!isISOString(dateString)) throw new Error(`Invalid date string: ${dateString}`);
	daily = { ...daily, date: dateString };

	try {
		const record = (await pb.collection('guest_dailies').create(daily)) as GuestDaily;
		return record;
	} catch (error) {
		throw Error(`Error creating guest daily: ${error}`);
	}
};

export const updateGuestDaily = async (daily: Partial<GuestDaily>) => {
	const dateString = daily?.date || getCurrentISOString();
	if (!isISOString(dateString)) throw new Error(`Invalid date string: ${dateString}`);
	daily = { ...daily, date: dateString };

	try {
		const existingDaily = await pb
			.collection('guest_dailies')
			.getFirstListItem(`date = "${dateString}"`);
		if (!existingDaily) {
			console.log(`No existing guest daily record found for ${dateString}. Creating a new one.`);
			return await createGuestDaily(daily);
		}
		const record = (await pb
			.collection('guest_dailies')
			.update(existingDaily.id, daily)) as GuestDaily;
		return record;
	} catch (error) {
		throw Error(`Error updating guest daily: ${error}`);
	}
};

export const deleteGuestDaily = async (daily: GuestDaily) => {
	try {
		const record = await pb.collection('guest_dailies').delete(daily.id);
		return record;
	} catch (error) {
		throw Error(`Error deleting guest daily: ${error}`);
	}
};
