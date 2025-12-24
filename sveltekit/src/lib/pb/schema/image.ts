import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface ImagePB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Images;
	name: string;
	label?: string; // Display name if different
	image: string; // Image Filename
	tags: ('guest' | 'calendar' | 'emotion')[];
	config?: Record<string, any>;
}
