import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase, { type RecordSubscription } from 'pocketbase'
import type { DailyRecord, Student, StudentDaily, Teacher, TeacherDaily } from './types'
import { getCurrentISOString, isISOString } from '$lib'


function createInstance() {
	return new PocketBase(PUBLIC_POCKETBASE_URL)
}

/**
 * Creates a new instance of PocketBase.
 * @returns A new PocketBase instance.
 */
export const pb = createInstance()

/**
 * Gets the collection name for daily records based on the input collection.
 * @param collection - The collection name to check.
 * @returns The collection name for daily records or "" if invalid.
 */
const getDailyCollectionName = (collection: string) => {
	switch (collection) {
		case "students":
			return "student_dailies"
		case "teachers":
			return "teacher_dailies"
		default:
			console.error(`${collection} is not a "students or "teachers"`)
			return ""
	}
}

/**
 * Gets all students from the PocketBase database.
 * @returns An array of Student objects. Empty array if error or no data.
 * @throws Error if the request fails.
 */
export const getAllStudents = async (): Promise<Student[]> => {
	console.log('Fetching all students...')
	try {
		const studentData = (await pb.collection('students').getFullList(
			{ sort: 'name' })) as Student[]
		console.log('Fetched all students')
		return studentData
	}
	catch (error) {
		console.error(error)
		return []
	}
}

/**
 * Gets all teachers from the PocketBase database.
 * @returns An array of Teacher objects. Empty array if error or no data.
 */
export const getAllTeachers = async (): Promise<Teacher[]> => {
	try {
		const teacherData = await pb.collection('teachers').getFullList({
			sort: 'name'
		}) as Teacher[];

		return teacherData;
	} catch (error) {
		console.error(error);
		return [];
	}
};

/**
 * Gets a map of student IDs to DailyRecords for today.
 * @date - YYYY-MM-DD format. Defaults to today's date.
 * @returns A Map of student IDs to DailyRecords. Empty map if error or no data.
 */
export const getStudentDailyMap = async (isoString?: string): Promise<Map<string, StudentDaily>> => {
	const studentDailyMap = new Map<string, StudentDaily>()
	const todaysDate = isoString ?? getCurrentISOString()
	if (!isISOString(todaysDate)) return studentDailyMap

	try {
		const studentDailies = await pb.collection('student_dailies').getFullList({
			filter: `date = "${todaysDate}"`,
			sort: '-created',
		}) as StudentDaily[]
		studentDailies.forEach((daily) => { studentDailyMap.set(daily.student, daily) })
		return studentDailyMap
	}
	catch (error) {
		console.error(error)
		return studentDailyMap
	}
}

/**
 * Gets a map of teacher IDs to DailyRecords for today.
 * @date - YYYY-MM-DD format. Defaults to today's date.
 * @returns A Map of teacher IDs to DailyRecords. Empty map if error or no data.
 */
export const getTeacherDailyMap = async (isoString?: string): Promise<Map<string, TeacherDaily>> => {
	const teacherDailyMap = new Map<string, TeacherDaily>()
	const dateString = isoString ?? getCurrentISOString()
	if (!isISOString(dateString)) return teacherDailyMap

	try {
		const teacherDailies = await pb.collection('teacher_dailies').getFullList({
			filter: `date = "${dateString}"`,
			sort: '-created',
		}) as TeacherDaily[]
		teacherDailies.forEach((daily) => { teacherDailyMap.set(daily.teacher, daily) })
		return teacherDailyMap
	}
	catch (error) {
		console.error(error)
		return teacherDailyMap
	}
}


/**
 * Creates a daily log for a student or teacher.
 * @param person - Student or Teacher object.
 * @param daily - Daily log data.
 * @returns The created DailyRecord or null if an error occurs.
 */
const createDaily = async (person: Student | Teacher, daily: Partial<DailyRecord>) => {
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
	}
	const collectionName = getDailyCollectionName(person.collectionName)
	if (!collectionName) return null
	try {
		const record = await pb.collection(collectionName).create(dailyData)
		return record
	} catch (error) {
		console.error(error)
		return null
	}
}

/**
 * Updates a person's daily log with the given data.
 * Creates a new log if one does not exist.
 * @param person - Student or Teacher object.
 * @param daily - The data to update the daily log with.
 * @returns The updated DailyRecord or null if an error occurs.
 */
export const updateDaily = async (person: Student | Teacher, daily: Partial<DailyRecord>) => {
	const isoString = daily?.date || getCurrentISOString()
	if (!isISOString(isoString)) return null
	daily = { ...daily, date: isoString }

	if (!["students", "teachers"].includes(person.collectionName)) {
		console.error("Invalid collection name")
		return null
	}

	let dailyMap: Map<string, DailyRecord>
	if (person.collectionName === 'students') {
		dailyMap = await getStudentDailyMap()
	}
	else {
		dailyMap = await getTeacherDailyMap()
	}
	const existingDaily = dailyMap.get(person.id)
	if (!existingDaily) {
		console.log(`No existing daily record found for ${person.name} on . Creating a new one.`)
		// Create a new daily record if one does not exist
		return await createDaily(person, daily)
	}
	// Update the existing daily record
	const newDaily = { ...existingDaily, ...daily }
	const collectionName = getDailyCollectionName(person.collectionName)
	if (!collectionName) return null
	try {
		const record = await pb.collection(collectionName).update(existingDaily.id, newDaily)
		return record
	} catch (error) {
		console.error(error)
		return null
	}
}

/**
 * Deletes a daily log for a student or teacher.
 * @param person - Student or Teacher object.
 * @param isoString - The date of the daily log to delete. Defaults to today's date.
 * @returns The deleted DailyRecord or null if an error occurs.
 * */
export const deleteDaily = async (person: Student | Teacher, isoString: string) => {
	isoString = isoString ?? getCurrentISOString()
	if (!isISOString(isoString)) return null

	if (!["students", "teachers"].includes(person.collectionName)) {
		console.error("Invalid collection name")
		return null
	}

	let dailyMap: Map<string, DailyRecord>
	if (person.collectionName === 'students') {
		dailyMap = await getStudentDailyMap(isoString)
	}
	else {
		dailyMap = await getTeacherDailyMap(isoString)
	}
	const existingDaily = dailyMap.get(person.id)
	if (!existingDaily) {
		console.log(`No existing daily record found for ${person.name} on ${isoString}.`)
		return null
	}
	const collectionName = getDailyCollectionName(person.collectionName)
	if (!collectionName) return null
	try {
		const record = await pb.collection(collectionName).delete(existingDaily.id)
		return record
	} catch (error) {
		console.error(error)
		return null
	}
}

// findDaily
/**
 * Finds a daily log for a student or teacher by date.
 * * @param person - Student or Teacher object.
 * * @param isoString - The date of the daily log to find. Defaults to today's date.
 * * @returns The DailyRecord if found, or null if not found or an error occurs.
 */
export const findDaily = async (person: Student | Teacher, isoString?: string) => {
	isoString = isoString ?? getCurrentISOString()
	if (!isISOString(isoString)) return null

	if (!["students", "teachers"].includes(person.collectionName)) {
		console.error("Invalid collection name")
		return null
	}

	let dailyMap: Map<string, DailyRecord>
	if (person.collectionName === 'students') {
		dailyMap = await getStudentDailyMap(isoString)
	}
	else {
		dailyMap = await getTeacherDailyMap(isoString)
	}
	const existingDaily = dailyMap.get(person.id)
	if (!existingDaily) {
		console.log(`No existing daily record found for ${person.name} on ${isoString}.`)
		return null
	}
	return existingDaily
} 