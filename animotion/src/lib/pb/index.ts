import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'
import type { RecordModel } from 'pocketbase'

export function createInstance() {
	return new PocketBase(PUBLIC_POCKETBASE_URL)
}

export const pb = createInstance()


interface Person extends RecordModel {
	name: string;
	pronoun?: "he" | "she";
	video_id?: string;
	video_start?: number;
	video_end?: number;
	avatar?: string;
}

interface DailyLog {
	date: string;
	present: boolean;
	feelings: string[];
	weather: string[];
}

export interface Student extends Person, DailyLog {}

export interface Teacher extends Person, DailyLog {
	title?: string;
}