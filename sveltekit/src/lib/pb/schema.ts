import type { RecordModel } from 'pocketbase';

export const COLLECTION_NAMES = {
	Classrooms: 'classrooms',
	Decks: 'decks',
	Slides: 'slides',
	Presentations: 'presentations',
	Icons: 'icons',
	// People Collections
	People: 'people',
	// Activities Collections
	PresentationActivity: 'presentation_activity',
	PeopleActivity: 'people_activity'
} as const;

export interface ActivityBasePB extends RecordModel {
	presentation: string; // ClassPresentation.id
	slide: string; // Slide.id
	data?: Record<string, any>; // Record<string, any> stringified object
}

export interface ClassroomPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Classrooms;
	name: string;
	location?: string; // address
	config?: Record<string, any>; // default slide configuration
	hidden: boolean; // Whether this classroom is hidden in the UI
}

export interface DeckPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Decks;
	name: string; // Name of the deck
	slides: string[]; // Array of Slide.id
}

export interface IconPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Icons;
	emoji: string; // emoji
	name: string;
	image: string; // image url
	classroom: string; // Classroom.id
	config?: Record<string, any>; // Record<string, any> stringified object
}

export interface PersonPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.People;
	avatar?: string; // Avatar URL
	name: string;
	role: 'teacher' | 'student'; // Role of the person (only for guests)
	classrooms_active: string[]; // Array of Classroom.id where the person is active
	classrooms_guest: string[]; // Array of Classroom.id where the person is inactive
	title?: string; // Title of the person (only for teachers)
	pronoun?: 'he' | 'she'; // assume they if not set
	config?: Record<string, any>; // Additional configuration for the person
	data?: Record<string, any>; // Additional data for the person
}

export interface ActivityPersonPB extends ActivityBasePB {
	collectionName: typeof COLLECTION_NAMES.PeopleActivity;
	person: string; // PersonGuest.id
}

export interface PresentationPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Presentations;
	deck: string; // Deck.id
	classroom: string; // Classroom.id
	slide?: number; // Index of the slide in the deck
	data?: Record<string, any>; // Record<string, any> stringified object
}

export interface ActivityPresentation extends ActivityBasePB {
	collectionName: typeof COLLECTION_NAMES.PresentationActivity;
}

export interface SlidePB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.Slides;
	name: string; // Name of the slide, e.g. "Student Attendance", "Calendar"
	component: string; // Component name for the slide, e.g. "Attendance", "Calendar"
	hidden: boolean; // Whether this slide is hidden in the UI
	config?: Record<string, any>; // Record<string, any> stringified object
	data?: Record<string, any>; // Record<string, any> stringified object
}

// export interface CalendarOccasionPB extends RecordModel {
// 	collectionName: 'calendar_occasions';
// 	name: string; // Name of the occasion
// 	classroom: string; // Classroom.id
// 	type: 'public' | 'bank' | 'school' | 'optional' | 'observance'; // Type of the occasion
// 	description: string; // Description of the occasion
// 	hidden: boolean; // Whether this occasion is hidden in the UI
// 	dates: string[]; // Array of dates in YYYY-MM-DD format
// 	school: 'full' | 'min' | 'none'; // Whether this occasion is a school day
// 	image: string; // Image URL for the occasion
// }

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
