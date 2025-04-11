import type { RecordModel } from 'pocketbase'

interface Person extends RecordModel {
	name: string;
	pronoun?: "he" | "she";
	video_id?: string;
	video_start?: number;
	video_end?: number;
	avatar?: string;
}

export interface DailyRecord extends RecordModel {
	date: string;
	here: "present" | "absent" | "";
	// feelings: string[];
	// weather: string[];
}

export interface Student extends Person {}
export interface StudentDaily extends DailyRecord {
	student: string;
}


export interface Teacher extends Person {
	title?: string;
}
export interface TeacherDaily extends DailyRecord {
	teacher: string;
}