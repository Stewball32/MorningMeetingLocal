import { BaseActivityObject, PresentationActivity, Slide, StudentActivity } from '$lib/pb';
import type { ActivityBasePB } from '$lib/pb/schema/index';
import type {
	SlideComponentProps,
	StudentInteractComponentProps,
	StudentViewComponentProps
} from '$lib/slides';

//
//
// Slide specific configuration and data types
export type SlideConfigType = Record<string, any> & {
	// Record for Slide.config
	title?: string; // Title of the slide
	subtitle?: string; // Subtitle of the slide
	paragraph?: string; // Main content of the slide
	roster?: string[]; // List of names or identifiers for persons
	pQuestion?: string; // Question to ask about attendance
	pHereString?: string; // Option for marking presence
	pAbsentString?: string; // Option for marking absence
	pIsHereString?: string; // String for marking presence
	pIsAbsentString?: string; // String for marking absence
};

export type SlideDataType = Record<string, any> & {};

export type ClassActivityDataType = Record<string, any> & {
	currentPersonId?: string; // ID of the current person
	hereIds?: string[]; // IDs of persons who are present
	absentIds?: string[]; // IDs of persons who are absent
};

export type PersonActivityDataType = Record<string, any> & {
	hereVotes: string[]; // Answers to questions or activities
	absentVotes: string[]; // Answers to questions or activities
};

export type StudentActivityDataType = PersonActivityDataType & {
	// Record for StudentActivity.data
};

//
//
// Wrappers for +slide, +student-view, and +student-interact components
export class SlideWrapper extends Slide {
	constructor(data: any) {
		super(data);
	}
	override get config() {
		const config = this.record.config || {};
		return config as SlideConfigType;
	}
	override get data() {
		const data = this.record.data || {};
		return data as SlideDataType;
	}
}

export class ClassroomActivityWrapper extends PresentationActivity {
	constructor(data: any) {
		super(data);
	}
	override get data() {
		const data = this.record.data || {};
		return data as ClassActivityDataType;
	}
}

abstract class PersonActivityWrapper extends BaseActivityObject<ActivityBasePB> {
	constructor(data: any) {
		super(data);
	}
	override get data() {
		const data = this.record.data || {};
		return data as PersonActivityDataType;
	}
}

export class StudentActivityWrapper extends StudentActivity {
	constructor(data: any) {
		super(data);
	}
	override get data() {
		const data = this.record.data || {};
		return data as StudentActivityDataType;
	}
}

export interface SlideComponentPropsWrapper extends SlideComponentProps {
	slide: SlideWrapper;
	classroomActivity: ClassroomActivityWrapper;
	personActivityMap?: Map<string, PersonActivityWrapper>;
}

export interface StudentInteractComponentPropsWrapper extends StudentInteractComponentProps {
	slide: SlideWrapper;
	classroomActivity: ClassroomActivityWrapper;
	studentActivity?: StudentActivityWrapper;
}

export interface StudentViewComponentPropsWrapper extends StudentViewComponentProps {
	slide: SlideWrapper;
	classroomActivity: ClassroomActivityWrapper;
	studentActivity?: StudentActivityWrapper;
}
