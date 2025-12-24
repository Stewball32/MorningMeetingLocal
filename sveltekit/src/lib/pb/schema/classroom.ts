import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface ClassroomPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Classrooms;
	name: string;
	people: string[]; // Array of Person.id where the person is active
	guests: string[]; // Array of Person.id where the person is inactive
	location?: string; // address
	config?: Record<string, any>; // default slide configuration
	hidden: boolean; // Whether this classroom is hidden in the UI
}
