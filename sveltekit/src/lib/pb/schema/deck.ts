import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface DeckPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Decks;
	name: string; // Name of the deck
	slides: string[]; // Array of Slide.id
}
