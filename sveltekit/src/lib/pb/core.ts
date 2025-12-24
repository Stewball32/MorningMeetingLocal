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

const createInstance = () => new PocketBase(PUBLIC_POCKETBASE_URL);

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
export const pbGetOne = async <T>(
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
export const pbGetFirst = async <T>(
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

/** * Wrapper for pocketbase.collection().create(). returns null instead of 404.
 * @param collection - The name of the collection to create a record in.
 * @param data - The data to create the record with.
 * @param options - Optional parameters for the request.
 * @return The created record if successful, or null if a 404 occurs.
 * @template T - The type of the record to create.
 * @throws Will throw an error if the request fails for reasons other than a 404.
 */
export const pbCreate = async <T>(
	collection: string,
	data: Partial<T>,
	options?: RecordOptions
): Promise<T | null> => {
	try {
		return (await pb.collection(collection).create(data, options)) as T;
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
export const pbGetFullList = async <T>(
	collection: string,
	options?: RecordListOptions
): Promise<T[]> => {
	try {
		const records = (await pb.collection(collection).getFullList(options)) as T[];
		console.log(records, options, collection);
		return records;
	} catch (error) {
		handlePocketBaseError(error);
		return [];
	}
};

/**
 * Fetch records in a collection by an array of IDs.
 */
export const pbGetByIds = async <T>(
	collection: string,
	ids: string[],
	options?: RecordListOptions
): Promise<T[]> => {
	if (!ids.length) return [];
	const filter = ids.map((id) => `id="${id}"`).join(' || ');
	options = {
		...options,
		filter
	};
	return await pbGetFullList<T>(collection, options);
};

/** * Wrapper for pocketbase.collection().getList(). returns null if an error occurs.
 * @param collection - The name of the collection to query.
 * @param options - Optional parameters for the request.
 * @param page - The page number to retrieve (default is 1).
 * @param perPage - The number of records per page (default is 50).
 * @return A ListResult containing the records, or null if an error occurs.
 * @template T - The type of the records to retrieve.
 */
export const pbGetList = async <T>(
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
export const pbCreateRecord = async <T>(
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

/** * Wrapper for pocketbase.collection().delete(). deletes the specified record.
 * @param collection - The name of the collection
 * @param id - The ID of the record to delete.
 * @param options - Optional parameters for the request.
 * @throws Will throw an error if the request fails.
 */
export const pbDeleteRecord = async (
	collection: string,
	id: string,
	options?: RecordOptions
): Promise<boolean> => {
	try {
		return await pb.collection(collection).delete(id, options);
	} catch (error) {
		throw new Error(`Error deleting record in ${collection}: ${error}`);
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
