import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase, {
	ClientResponseError,
	type ListResult,
	type RecordListOptions,
	type RecordModel,
	type RecordOptions,
	type RecordSubscription,
	type UnsubscribeFunc
} from 'pocketbase';
import type {
	ClassroomPB,
	StudentPB,
	TeacherPB,
	GuestPB,
	DeckSlidePB,
	ClassIconPB,
	DeckPB,
	ClassPresentationPB,
	PersonBasePB,
	ActivityBasePB,
	ActivityClassroomPB,
	ActivityGuestPB
} from './schema';
import { getCurrentISOString, isISOString } from '$lib';

const COLLECTION_NAMES = {
	Classrooms: 'classrooms',
	Decks: 'decks',
	Slides: 'deck_slides',
	Presentations: 'class_presentations',
	Icons: 'class_icons',
	// People Collections
	Guests: 'guests',
	Students: 'students',
	Teachers: 'teachers',
	// Activities Collections
	ClassActivities: 'classroom_activity',
	StudentActivities: 'student_activity',
	TeacherActivities: 'teacher_activity',
	GuestActivities: 'guest_activity'
} as const;

function createInstance() {
	return new PocketBase(PUBLIC_POCKETBASE_URL);
}

/**
 * Creates a new instance of PocketBase.
 * @returns A new PocketBase instance.
 */
export const pb = createInstance();

/** * Handles PocketBase errors, specifically 404 errors.
 * Throws the error if it's not a ClientResponseError or if the status is not 404.
 */
export const handlePocketBaseError = (error: unknown): void => {
	if (!(error instanceof ClientResponseError)) throw error;
	if (error.status !== 404) throw error;
	return;
};

/**
 * Returns the URL for an image file in PocketBase.
 * @param collectionId - The ID of the collection the record belongs to.
 * @param recordId - The ID of the record containing the file.
 * @param fileId - The ID of the file to retrieve.
 * @returns The URL for the image file.
 */
export const getPbImageUrl = (collectionId: string, recordId: string, fileId: string) => {
	return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileId}`;
};

// ================================
// === Generic PocketBase Utils ===
// ================================

/** * Wrapper for pocketbase.collection().getOne(). returns null instead of 404.
 * @param collection - The name of the collection to query.
 * @param id - The ID of the record to retrieve.
 * @param options - Optional parameters for the request.
 * @return The record if found, or null if not found or an error occurs.
 * @template T - The type of the record to retrieve.
 * @throws Will throw an error if the request fails for reasons other than a 404.
 */
const pbGetOne = async <T>(
	collection: string,
	id: string,
	options?: RecordOptions
): Promise<T | null> => {
	try {
		return (await pb.collection(collection).getOne(id, options)) as T;
	} catch (error) {
		handlePocketBaseError(error);
		return null;
	}
};

/** * Wrapper for pocketbase.collection().getFirstListItem(). returns null instead of 404.
 * @param collection - The name of the collection to query.
 * @param filter - The filter string to apply to the query.
 * @param options - Optional parameters for the request.
 * @return The first record matching the filter, or null if not found or an error occurs.
 * @template T - The type of the record to retrieve.
 */
const pbGetFirst = async <T>(
	collection: string,
	filter: string,
	options?: RecordListOptions
): Promise<T | null> => {
	try {
		return (await pb.collection(collection).getFirstListItem(filter, options)) as T;
	} catch (error) {
		handlePocketBaseError(error);
		return null;
	}
};

/** * Wrapper for pocketbase.collection().getFullList(). returns an empty array instead of throwing an error.
 * @param collection - The name of the collection to query.
 * @param options - Optional parameters for the request.
 * @return An array of records from the collection, or an empty array if an error occurs.
 * @template T - The type of the records to retrieve.
 */
const pbGetFullList = async <T>(collection: string, options?: RecordListOptions): Promise<T[]> => {
	try {
		return (await pb.collection(collection).getFullList(options)) as T[];
	} catch (error) {
		handlePocketBaseError(error);
		return [];
	}
};

/** * Wrapper for pocketbase.collection().getList(). returns null if an error occurs.
 * @param collection - The name of the collection to query.
 * @param options - Optional parameters for the request.
 * @param page - The page number to retrieve (default is 1).
 * @param perPage - The number of records per page (default is 50).
 * @return A ListResult containing the records, or null if an error occurs.
 * @template T - The type of the records to retrieve.
 */
const pbGetList = async <T>(
	collection: string,
	options?: RecordListOptions,
	page: number = 1,
	perPage: number = 50
): Promise<ListResult<T> | null> => {
	try {
		return (await pb.collection(collection).getList(page, perPage, options)) as ListResult<T>;
	} catch (error) {
		handlePocketBaseError(error);
		return null;
	}
};

/** * Wrapper for pocketbase.collection().create(). returns the created record.
 * @param collection - The name of the collection to create a record in.
 * @param data - The data to create the record with.
 * @param options - Optional parameters for the request.
 * @return The created record.
 * @throws Will throw an error if the request fails.
 */
const pbCreateRecord = async <T>(
	collection: string,
	data: Partial<T>,
	options?: RecordOptions
): Promise<T> => {
	try {
		return (await pb.collection(collection).create(data, options)) as T;
	} catch (error) {
		throw new Error(`Error creating record in ${collection}: ${error}`);
	}
};

/** * Wrapper for pocketbase.collection().update(). returns the updated record.
 * @param collection - The name of the collection to update a record in.
 * @param filter - The filter string to find the record to update.
 * @param data - The data to update the record with.
 * @param options - Optional parameters for the request.
 * @return The updated record.
 * @throws Will throw an error if the request fails.
 */
export const pbUpdateRecord = async <T>(
	collection: string,
	id: string,
	data: Partial<T>,
	options?: RecordOptions
): Promise<T> => {
	try {
		return (await pb.collection(collection).update(id, data, options)) as T;
	} catch (error) {
		throw new Error(`Error updating record in ${collection}: ${error}`);
	}
};

/** * Wrapper for pocketbase.collection().subscribe(). returns an unsubscribe function.
 * @param collection - The name of the collection to subscribe to.
 * @param id - The ID of the record to subscribe to.
 * @param callback - The callback function to handle updates.
 * @param options - Optional parameters for the subscription.
 * @return An unsubscribe function to stop receiving updates.
 * @template T - The type of the record to subscribe to.
 * @throws Will throw an error if the subscription fails.
 * */
export const pbSubscribeToRecord = async <T extends RecordModel>(
	collection: string,
	id: string,
	callback: (data: RecordSubscription<T>) => void,
	options?: RecordOptions
): Promise<UnsubscribeFunc> => {
	return await pb.collection(collection).subscribe(id, callback, options);
};

// ==================================
// === Classroom Record Functions ===
// ==================================

export const getClassroomRecordById = async (
	id: string,
	options?: RecordListOptions
): Promise<ClassroomPB | null> => {
	options = {
		requestKey: `get-classroom-${id}`,
		...options
	};
	return await pbGetOne<ClassroomPB>(COLLECTION_NAMES.Classrooms, id, options);
};

export const getClassroomRecordByName = async (
	name: string,
	options?: RecordListOptions
): Promise<ClassroomPB | null> => {
	const filter: string = `name="${name}"`;
	options = {
		requestKey: `class-by-name-${name}`
	};
	return await pbGetFirst<ClassroomPB>(COLLECTION_NAMES.Classrooms, filter, options);
};

// =============================
// === Deck Record Functions ===
// =============================

export const getDeckRecordByName = async (
	name: string,
	options?: RecordListOptions
): Promise<DeckPB | null> => {
	const filter: string = `name="${name}"`;
	options = {
		requestKey: `deck-by-name-${name}`,
		...options
	};
	return await pbGetFirst<DeckPB>(COLLECTION_NAMES.Decks, filter, options);
};

export const getDeckRecordById = async (
	id: string,
	options?: RecordOptions
): Promise<DeckPB | null> => {
	options = {
		requestKey: `deck-by-id-${id}`,
		...options
	};
	return await pbGetOne<DeckPB>(COLLECTION_NAMES.Decks, id, options);
};

// ===========================================
// === Class Presentation Record Functions ===
// ===========================================

export const resolveClassPresentationRecord = async (
	classroomId: string,
	deckId: string,
	isoString: string,
	options?: RecordOptions
): Promise<ClassPresentationPB> =>
	(await getClassPresentationRecord(classroomId, deckId, isoString, options)) ??
	(await createClassPresentationRecord(classroomId, deckId, isoString, options));

const getClassPresentationRecord = async (
	classroomId: string,
	deckId: string,
	isoString: string,
	options?: RecordOptions
): Promise<ClassPresentationPB | null> => {
	const filter: string = `classroom="${classroomId}" && deck="${deckId}" && date="${isoString}"`;
	options = {
		requestKey: `get-presentation-${classroomId}-${deckId}-${isoString}`,
		...options
	};
	return await pbGetFirst<ClassPresentationPB>(COLLECTION_NAMES.Presentations, filter, options);
};

const createClassPresentationRecord = async (
	classroomId: string,
	deckId: string,
	isoString: string,
	options?: RecordOptions
): Promise<ClassPresentationPB> => {
	const partial: Partial<ClassPresentationPB> = {
		date: isoString,
		classroom: classroomId,
		deck: deckId
	};
	options = {
		requestKey: `create-presentation-${classroomId}-${deckId}-${isoString}`,
		...options
	};
	return await pbCreateRecord<ClassPresentationPB>(
		COLLECTION_NAMES.Presentations,
		partial,
		options
	);
};

export const updateClassPresentationRecord = async (
	data: Partial<ClassPresentationPB>,
	options?: RecordOptions
): Promise<ClassPresentationPB> => {
	options = {
		requestKey: `update-presentation-${data.id}`,
		...options
	};
	if (!data.id) throw new Error('Cannot update class presentation record without an ID');
	return await pbUpdateRecord<ClassPresentationPB>(
		COLLECTION_NAMES.Presentations,
		data.id,
		data,
		options
	);
};

// export const subscribeToClassPresentationRecord = async (
// 	presentationId: string,
// 	callback: (data: RecordSubscription<ClassPresentationPB>) => void,
// 	options?: RecordOptions
// ): Promise<() => void> => {
// 	options = {
// 		requestKey: `subscribe-presentation-${presentationId}`,
// 		...options
// 	};
// 	return await pbSubscribeToRecord<ClassPresentationPB>(
// 		COLLECTION_NAMES.Presentations,
// 		presentationId,
// 		callback,
// 		options
// 	);
// };

// ==============================
// === Slide Record Functions ===
// ==============================

export const getSlideRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<DeckSlidePB[]> => {
	options = {
		sort: 'order',
		requestKey: `slides-by-classroom-${classroomId}`,
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<DeckSlidePB>(COLLECTION_NAMES.Slides, options);
};

export const getSlideRecordsOrdered = async (
	slideIds: string[],
	options?: RecordListOptions
): Promise<DeckSlidePB[]> => {
	if (slideIds.length === 0) return [];
	options = {
		requestKey: `slides-ordered-${slideIds.join(',')}`,
		...options,
		filter: `"${slideIds}" ~ id`
	};
	const slides = await pbGetFullList<DeckSlidePB>(COLLECTION_NAMES.Slides, options);
	return (
		slideIds
			.map((id) => slides.find((slide) => slide.id === id))
			// Filter for typescript strict mode
			// Undefined shouldn't be possible here, but just in case
			.filter((slide) => slide !== undefined)
	);
};

// ===============================
// === People Record Functions ===
// ===============================

const getPeopleRecordsByClassroom = async <T extends PersonBasePB>(
	collectionName: string,
	classroomId: string,
	options?: RecordListOptions
): Promise<T[]> => {
	options = {
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<T>(collectionName, options);
};

export const getGuestRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<GuestPB[]> => {
	options = {
		requestKey: `guests-by-classroom-${classroomId}`,
		sort: 'name',
		...options
	};
	return await getPeopleRecordsByClassroom<GuestPB>(COLLECTION_NAMES.Guests, classroomId, options);
};

export const getStudentRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<StudentPB[]> => {
	options = {
		requestKey: `students-by-classroom-${classroomId}`,
		sort: 'name',
		...options
	};
	return await getPeopleRecordsByClassroom<StudentPB>(
		COLLECTION_NAMES.Students,
		classroomId,
		options
	);
};

export const getTeacherRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<TeacherPB[]> => {
	options = {
		requestKey: `teachers-by-classroom-${classroomId}`,
		sort: 'name',
		...options
	};
	return await getPeopleRecordsByClassroom<TeacherPB>(
		COLLECTION_NAMES.Teachers,
		classroomId,
		options
	);
};

// =================================
// === Activity Record Functions ===
// =================================

const activityCollectionNames = {
	classrooms: COLLECTION_NAMES.ClassActivities,
	students: COLLECTION_NAMES.StudentActivities,
	teachers: COLLECTION_NAMES.TeacherActivities,
	guests: COLLECTION_NAMES.GuestActivities
} as const;
const getActivityCollectionName = (collectionName: keyof typeof activityCollectionNames) => {
	return activityCollectionNames[collectionName];
};
const personNames = {
	students: 'student',
	teachers: 'teacher',
	guests: 'guest',
	classrooms: 'classroom'
};
const getPersonName = (collectionName: keyof typeof personNames) => {
	return personNames[collectionName];
};

export const resolveIndividualPresentationActivityRecords = async <T extends ActivityBasePB>(
	presentationId: string,
	slideIds: string[],
	personOrClassroom: ClassroomPB | StudentPB | TeacherPB | GuestPB,
	options?: RecordListOptions
): Promise<T[]> => {
	let activityRecords = await getExistingPresentationActivityRecords<T>(
		presentationId,
		slideIds,
		personOrClassroom,
		options
	);
	const promises: (T | Promise<T>)[] = activityRecords.map((r, i) =>
		r ? r : createActivityRecord<T>(presentationId, slideIds[i], personOrClassroom, options)
	);
	return await Promise.all(promises);
};

const getExistingPresentationActivityRecords = async <T extends ActivityBasePB>(
	presentationId: string,
	slideIds: string[],
	personOrClassroom: ClassroomPB | StudentPB | TeacherPB | GuestPB,
	options?: RecordListOptions
): Promise<(T | null)[]> => {
	const collectionName = getActivityCollectionName(personOrClassroom.collectionName);
	const personName = getPersonName(personOrClassroom.collectionName);
	const slideIdsString = slideIds.map((id) => `slide ?= "${id}"`).join(' || ');
	options = {
		requestKey: `existing-${personOrClassroom.id}-${presentationId}`,
		...options,
		filter: `"${presentationId}" = presentation && (${slideIdsString})`
	};
	if (personName !== 'classroom') {
		options.filter += ` && ${personName} = "${personOrClassroom.id}"`;
	}
	const existingRecords = await pbGetFullList<T>(collectionName, options);
	const slideRecords = slideIds.map((slideId) => {
		return existingRecords.find((record) => record.slide === slideId) || null;
	});
	return slideRecords;
};

export const createActivityRecord = async <T extends ActivityBasePB>(
	presentationId: string,
	slideId: string,
	personOrClassroom: ClassroomPB | StudentPB | TeacherPB | GuestPB,
	data?: Record<string, any>,
	options?: RecordOptions
): Promise<T> => {
	const collectionName = activityCollectionNames[personOrClassroom.collectionName];
	const personName = getPersonName(personOrClassroom.collectionName);
	if (!collectionName || !personName) {
		throw new Error(
			`Invalid collection name: ${personOrClassroom.collectionName} or person name: ${personName}`
		);
	}
	const newRecord = {
		presentation: presentationId,
		slide: slideId,
		data: data
	} as Partial<T>;
	(newRecord as any)[personNames[personOrClassroom.collectionName]] = personOrClassroom.id;
	options = {
		requestKey: `create-${collectionName}-${presentationId}-${slideId}-${personOrClassroom.id}`,
		...options
	};
	return await pbCreateRecord<T>(collectionName, newRecord, options);
};

export const subscribeToActivityRecord = async <T extends ActivityBasePB>(
	collectionName: string,
	activityId: string,
	callback: (data: RecordSubscription<T>) => void,
	options?: RecordOptions
): Promise<UnsubscribeFunc> => {
	options = {
		requestKey: `subscribe-${activityId}`,
		...options
	};
	return await pbSubscribeToRecord<T>(collectionName, activityId, callback, options);
};

// ===================================
// === Class Icon Record Functions ===
// ===================================

export const getAllClassIcons = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<ClassIconPB[]> => {
	options = {
		sort: 'name',
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<ClassIconPB>(COLLECTION_NAMES.Icons, options);
};

export const getGuestClassIconRecordMap = async (
	classroomId: string
): Promise<Map<string, ClassIconPB>> => {
	const guestAvatarMap = new Map<string, ClassIconPB>();
	try {
		const guestAvatars = (await pb.collection('icons').getFullList({
			filter: `for_guests = true && classroom = "${classroomId}"`,
			sort: 'name'
		})) as ClassIconPB[];
		guestAvatars.forEach((avatar) => {
			guestAvatarMap.set(avatar.id, avatar);
		});
		return guestAvatarMap;
	} catch (error) {
		console.error(error);
		return guestAvatarMap;
	}
};

export const getIconRecord = async (
	id: string,
	requestKey?: string
): Promise<ClassIconPB | null> => {
	try {
		const iconRecord = (await pb
			.collection('icons')
			.getOne(id, { requestKey: requestKey })) as ClassIconPB;
		return iconRecord;
	} catch (error) {
		console.error(`Error fetching icon record with ID ${id}:`, error);
		return null;
	}
};
