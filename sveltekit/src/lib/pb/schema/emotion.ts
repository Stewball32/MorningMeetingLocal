import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface EmotionPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Emotions;
	name: string;
	image: string; // ImagePB.id
	priority: number;
	tags: (
		| 'positive'
		| 'neutral'
		| 'negative'
		| 'mild'
		| 'moderate'
		| 'severe'
		| 'health'
		| 'simple'
		| 'complex'
	)[];
}

export interface EmotionOverridePB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.EmotionOverrides;
	person: string; // PersonPB.id
	emotion: string; // Emotion.id
	image?: string; // ImagePB.id
	priority?: number; // ImagePB.id
}
