import { Slide, ClassroomActivity, StudentActivity, BaseActivityObject } from '$lib/pb/objects';
import type { ActivityBasePB } from '$lib/pb/types';
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
};

export type SlideDataType = Record<string, any> & {
	// Record for Slide.data
};

export type ClassActivityDataType = Record<string, any> & {
	// Record for ClassActivity.data
};

export type PersonActivityDataType = Record<string, any> & {
	// Record for PersonActivity.data
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

export class ClassroomActivityWrapper extends ClassroomActivity {
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

export interface SlideComponentPropsWrapper extends SlideComponentProps {
	slide: SlideWrapper;
	classroomActivity: ClassroomActivityWrapper;
	personActivityMap?: Map<string, PersonActivityWrapper>;
}

export interface StudentInteractComponentPropsWrapper extends StudentInteractComponentProps {
	slide: SlideWrapper;
	classroomActivity: ClassroomActivityWrapper;
	studentActivity?: StudentActivity;
}

export interface StudentViewComponentPropsWrapper extends StudentViewComponentProps {
	slide: SlideWrapper;
	classroomActivity: ClassroomActivityWrapper;
	studentActivity?: StudentActivity;
}
