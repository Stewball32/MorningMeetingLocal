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
	SlidePB,
	IconPB,
	DeckPB,
	PresentationPB,
	ActivityBasePB,
	ActivityPresentation,
	PersonPB,
	ActivityPersonPB
} from './schema';
import { COLLECTION_NAMES } from './schema';
import { getCurrentISOString, isISOString } from '$lib';

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
		const records = (await pb.collection(collection).getFullList(options)) as T[];
		console.log(records, options, collection);
		return records;
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

export const getAllClassroomRecords = async (
	options?: RecordListOptions
): Promise<ClassroomPB[]> => {
	options = {
		requestKey: `get-all-classrooms`,
		...options
	};
	const result = await pbGetList<ClassroomPB>(COLLECTION_NAMES.Classrooms, options);
	return result ? result.items : [];
};

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

export const getAllDeckRecords = async (options?: RecordListOptions): Promise<DeckPB[]> => {
	options = {
		requestKey: `get-all-decks`,
		...options
	};
	const result = await pbGetList<DeckPB>(COLLECTION_NAMES.Decks, options);
	return result ? result.items : [];
};

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

export const getPresentationRecords = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PresentationPB[]> => {
	options = {
		sort: '-updated',
		requestKey: `get-presentations-${classroomId}`,
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<PresentationPB>(COLLECTION_NAMES.Presentations, options);
};

export const getPresentationRecordById = async (
	id: string,
	options?: RecordOptions
): Promise<PresentationPB | null> => {
	options = {
		requestKey: `get-presentation-${id}`,
		...options
	};
	return await pbGetOne<PresentationPB>(COLLECTION_NAMES.Presentations, id, options);
};

const createPresentationRecord = async (
	classroomId: string,
	deckId: string,
	options?: RecordOptions
): Promise<PresentationPB> => {
	const partial: Partial<PresentationPB> = {
		classroom: classroomId,
		deck: deckId
	};
	options = {
		requestKey: `create-presentation-${classroomId}-${deckId}`,
		...options
	};
	return await pbCreateRecord<PresentationPB>(COLLECTION_NAMES.Presentations, partial, options);
};

export const updatePresentationRecord = async (
	data: Partial<PresentationPB>,
	options?: RecordOptions
): Promise<PresentationPB> => {
	options = {
		requestKey: `update-presentation-${data.id}`,
		...options
	};
	if (!data.id) throw new Error('Cannot update class presentation record without an ID');
	return await pbUpdateRecord<PresentationPB>(
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

export const getAllSlideRecords = async (options?: RecordListOptions): Promise<SlidePB[]> => {
	options = {
		requestKey: `get-all-slides`,
		...options
	};
	const result = await pbGetList<SlidePB>(COLLECTION_NAMES.Slides, options);
	return result ? result.items : [];
};

export const getSlideRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<SlidePB[]> => {
	options = {
		sort: 'order',
		requestKey: `slides-by-classroom-${classroomId}`,
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<SlidePB>(COLLECTION_NAMES.Slides, options);
};

export const getSlideRecordsOrdered = async (
	slideIds: string[],
	options?: RecordListOptions
): Promise<SlidePB[]> => {
	if (slideIds.length === 0) return [];
	options = {
		requestKey: `slides-ordered-${slideIds.join(',')}`,
		...options,
		filter: `"${slideIds}" ~ id`
	};
	const slides = await pbGetFullList<SlidePB>(COLLECTION_NAMES.Slides, options);
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

export const getAllPeopleRecords = async (options?: RecordListOptions): Promise<PersonPB[]> => {
	options = {
		sort: 'name',
		...options
	};
	const result = await pbGetFullList<PersonPB>(COLLECTION_NAMES.People, options);
	return result ?? [];
};

export const getPeopleRecordsByClassroom = async <PersonPB>(
	classroomId: string,
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	options = {
		sort: 'name',
		...options,
		filter: `classrooms_active ~ "${classroomId}" || classrooms_guest ~ "${classroomId}"`
	};
	return await pbGetFullList<PersonPB>(COLLECTION_NAMES.People, options);
};

export const getRosterRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	options = {
		sort: 'name',
		...options,
		filter: `classrooms_active ~ "${classroomId}"`
	};
	return await pbGetFullList<PersonPB>(COLLECTION_NAMES.People, options);
};

export const getGuestRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	options = {
		sort: 'name',
		...options,
		filter: `classrooms_guest ~ "${classroomId}"`
	};
	return await pbGetFullList<PersonPB>(COLLECTION_NAMES.People, options);
};

// =================================
// === Activity Record Functions ===
// =================================

export const getExistingPersonActivityRecords = async (
	personId: string,
	presentationId: string,
	options?: RecordListOptions
): Promise<ActivityPersonPB[]> => {
	const filter = `"${presentationId}" = presentation && person = "${personId}"`;
	options = {
		requestKey: `existing-person-activity-${personId}-${presentationId}`,
		...options,
		filter: filter
	};
	return await pbGetFullList<ActivityPersonPB>(COLLECTION_NAMES.PeopleActivity, options);
};

export const resolvePersonActivityRecord = async (
	personId: string,
	presentationId: string,
	slideId: string,
	options?: RecordListOptions
): Promise<void> => {
	const filter = `"${presentationId}" = presentation && slide = "${slideId}" && person = "${personId}"`;
	options = {
		requestKey: `existing-person-activity-${personId}-${presentationId}-${slideId}`,
		...options,
		filter: filter
	};
	let record = await pbGetFirst<ActivityPersonPB>(COLLECTION_NAMES.PeopleActivity, filter, options);
	if (!record) {
		const newRecord = {
			presentation: presentationId,
			slide: slideId,
			person: personId
		} as Partial<ActivityPersonPB>;
		options = {
			requestKey: `create-person-activity-${personId}-${presentationId}-${slideId}`,
			...options
		};
		await pbCreateRecord<ActivityPersonPB>(COLLECTION_NAMES.PeopleActivity, newRecord, options);
	}
};

export const getExistingPresentationActivityRecords = async (
	presentationId: string,
	options?: RecordListOptions
): Promise<ActivityPresentation[]> => {
	const filter = `presentation = "${presentationId}"`;
	options = {
		requestKey: `existing-presentation-activities-${presentationId}`,
		...options,
		filter: filter
	};
	return await pbGetFullList<ActivityPresentation>(COLLECTION_NAMES.PresentationActivity, options);
};

export const resolvePresentationActivityRecord = async (
	presentationId: string,
	slideId: string,
	options?: RecordListOptions
): Promise<void> => {
	const filter = `"${presentationId}" = presentation && slide = "${slideId}" `;
	options = {
		requestKey: `existing-presentation-activity-${presentationId}-${slideId}`,
		...options
	};
	let record = await pbGetFirst<ActivityPresentation>(
		COLLECTION_NAMES.PresentationActivity,
		filter,
		options
	);
	if (!record) {
		const newRecord = {
			presentation: presentationId,
			slide: slideId
		} as Partial<ActivityPresentation>;
		options = {
			requestKey: `create-presentation-activity-${presentationId}-${slideId}`,
			...options
		};
		await pbCreateRecord<ActivityPresentation>(
			COLLECTION_NAMES.PresentationActivity,
			newRecord,
			options
		);
	}
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

export const getAllIcons = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<IconPB[]> => {
	options = {
		sort: 'name',
		...options
	};
	return await pbGetFullList<IconPB>(COLLECTION_NAMES.Icons, options);
};

export const getIconRecord = async (id: string, requestKey?: string): Promise<IconPB | null> => {
	try {
		const iconRecord = (await pb
			.collection('icons')
			.getOne(id, { requestKey: requestKey })) as IconPB;
		return iconRecord;
	} catch (error) {
		console.error(`Error fetching icon record with ID ${id}:`, error);
		return null;
	}
};
