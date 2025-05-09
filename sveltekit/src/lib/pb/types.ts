import type { RecordModel } from 'pocketbase'
import type { ClassProps as ClassAttendanceProps, TeacherProps as TeacherAttendanceProps, StudentProps as StudentAttendanceProps } from '$lib/slides/attendance/_types';

export interface ClassDaily extends RecordModel {
	date: string; // YYYY-MM-DD
	slide: number;
	attendance: ClassAttendanceProps;
}

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

export interface Student extends Person { }
export interface StudentDaily extends DailyRecord {
	student: string;
	attendance: StudentAttendanceProps
}


export interface Teacher extends Person {
	title?: string;
}
export interface TeacherDaily extends DailyRecord {
	teacher: string;
	attendance: TeacherAttendanceProps
}

export interface GuestAvatar extends RecordModel {
	name: string;
	emoji: string; // emoji
	image: string; // image url
}

export interface GuestDaily extends DailyRecord {
	name: string;
	avatar: string; // GuestAvatar.id
	pronoun?: "he" | "she";
}