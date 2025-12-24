import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface PresentationPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Presentations;
	deck: string; // Deck.id
	classroom: string; // Classroom.id
	slide?: number; // Index of the slide in the deck
	data?: Record<string, any>; // Record<string, any> stringified object
}
