import type { RecordModel } from 'pocketbase';

export interface allActivityCollections {
	classrooms: ActivityClassroomPB;
	guests: ActivityGuestPB;
	students: ActivityStudentPB;
	teachers: ActivityTeacherPB;
}

export interface ClassIconPB extends RecordModel {
	collectionName: 'class_icons'; // Collection name
	emoji: string; // emoji
	name: string;
	image: string; // image url
	classroom: string; // Classroom.id
	for_avatar: boolean; // for avatar
	for_calendar: boolean; // for calendar
}

export interface ClassPresentationPB extends RecordModel {
	collectionName: 'class_presentations'; // Collection name
	date: string; // YYYY-MM-DD
	deck: string; // Deck.id
	classroom: string; // Classroom.id
	slide?: number; // Index of the slide in the deck
	data?: Record<string, any>; // Record<string, any> stringified object
}

export interface ActivityBasePB extends RecordModel {
	presentation: string; // ClassPresentation.id
	slide: string; // Slide.id
	data?: Record<string, any>; // Record<string, any> stringified object
}
export interface ActivityClassroomPB extends ActivityBasePB {
	collectionName: 'classroom_activity'; // Collection name
}

export interface ClassroomPB extends RecordModel {
	collectionName: 'classrooms'; // Collection name
	name: string;
	location?: string; // address
	config?: Record<string, any>; // default slide configuration
	hidden: boolean; // Whether this classroom is hidden in the UI
}

export interface DeckSlidePB extends RecordModel {
	collectionName: 'deck_slides'; // Collection name
	name: string; // Name of the slide, e.g. "Student Attendance", "Calendar"
	component: string; // Component name for the slide, e.g. "Attendance", "Calendar"
	hidden: boolean; // Whether this slide is hidden in the UI
	config?: Record<string, any>; // Record<string, any> stringified object
	data?: Record<string, any>; // Record<string, any> stringified object
}

export interface DeckPB extends RecordModel {
	collectionName: 'decks'; // Collection name
	name: string; // Name of the deck
	slides: string[]; // Array of Slide.id
}

export interface PersonBasePB extends RecordModel {
	name: string;
	classroom: string; // Classroom.id
	hidden: boolean; // Whether this person is hidden in the UI
	pronoun?: 'he' | 'she'; // Pronoun for the person
}

export interface ActivityGuestPB extends ActivityBasePB {
	collectionName: 'guest_activity'; // Collection name
	guest: string; // PersonGuest.id
}

export interface GuestPB extends PersonBasePB {
	collectionName: 'guests'; // Collection name
	avatar?: string; // IconRecord.id
	role?: 'teacher' | 'student'; // Role of the person
}

export interface RosteredPB extends PersonBasePB {
	avatar?: string; // url
	video_id?: string; // Video ID for the person
	video_start?: number; // Start time of the video in seconds
	video_end?: number; // End time of the video in seconds
	birthday?: string; // Birthday in MM-DD format
}

export interface ActivityStudentPB extends ActivityBasePB {
	collectionName: 'student_activity'; // Collection name
	student: string; // PersonStudent.id
}

export interface StudentPB extends RosteredPB {
	collectionName: 'students'; // Collection name
	default?: Record<string, any>; // Default student configuration
}

export interface ActivityTeacherPB extends ActivityBasePB {
	collectionName: 'teacher_activity'; // Collection name
	teacher: string; // PersonTeacher.id
}

export interface TeacherPB extends RosteredPB {
	collectionName: 'teachers'; // Collection name
	title?: string; // Title of the teacher
}

export interface CalendarOccasionPB extends RecordModel {
	collectionName: 'calendar_occasions'; // Collection name
	name: string; // Name of the occasion
	classroom: string; // Classroom.id
	type: 'public' | 'bank' | 'school' | 'optional' | 'observance'; // Type of the occasion
	description: string; // Description of the occasion
	hidden: boolean; // Whether this occasion is hidden in the UI
	dates: string[]; // Array of dates in YYYY-MM-DD format
	school: 'full' | 'min' | 'none'; // Whether this occasion is a school day
	image: string; // Image URL for the occasion
}

// export interface ClassDaily extends RecordModel {
// 	date: string; // YYYY-MM-DD
// 	slide: number;
// 	attendance: ClassAttendanceProps;
// 	calendar: ClassCalendarProps;
// }

// interface Person extends RecordModel {
// 	name: string;
// 	pronoun?: 'he' | 'she';
// 	video_id?: string;
// 	video_start?: number;
// 	video_end?: number;
// 	avatar?: string;
// }

// export interface DailyRecord extends RecordModel {
// 	date: string;
// 	here: 'present' | 'absent' | '';
// 	// feelings: string[];
// 	// weather: string[];
// }

// export interface Student extends Person {}
// export interface StudentDaily extends DailyRecord {
// 	student: string;
// 	attendance: StudentAttendanceProps;
// }

// export interface Teacher extends Person {
// 	title?: string;
// }
// export interface TeacherDaily extends DailyRecord {
// 	teacher: string;
// 	attendance: TeacherAttendanceProps;
// }

// export interface GuestDaily extends DailyRecord {
// 	name: string;
// 	avatar: string; // GuestAvatar.id
// 	pronoun?: 'he' | 'she';
// }

// export interface CalendarObservance extends RecordModel {
// 	name: string;
// 	type: 'public' | 'bank' | 'school' | 'optional' | 'observance';
// 	description: string;
// 	hidden: boolean;
// 	dates: string[]; // Array of dates: https://github.com/commenthol/date-holidays/blob/master/docs/specification.md#structure-of-holidaysyaml
// 	school: 'full' | 'min' | 'none'; // Whether this observance is a school day
// 	image: string; // Image URL
// }
