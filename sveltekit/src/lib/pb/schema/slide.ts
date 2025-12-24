import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface SlidePB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Slides;
	name: string; // Name of the slide, e.g. "Student Attendance", "Calendar"
	component: string; // Component name for the slide, e.g. "Attendance", "Calendar"
	hidden: boolean; // Whether this slide is hidden in the UI
	config?: Record<string, any>; // Record<string, any> stringified object
	data?: Record<string, any>; // Record<string, any> stringified object
}
