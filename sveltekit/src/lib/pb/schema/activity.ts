import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface ActivityBasePB extends RecordModel {
	presentation: string; // ClassPresentation.id
	slide: string; // Slide.id
	data?: Record<string, any>; // Record<string, any> stringified object
}

export interface ActivityPersonPB extends ActivityBasePB {
	collectionName: typeof COLLECTION_NAMES.PeopleActivity;
	person: string; // PersonGuest.id
}

export interface ActivityPresentation extends ActivityBasePB {
	collectionName: typeof COLLECTION_NAMES.PresentationActivity;
}
