import type { Component } from 'svelte';
import type { ActivityBasePB, ActivityClassroomPB, DeckSlidePB } from '$lib/pb/schema';
import type {
	BaseActivityObject,
	Classroom,
	ClassroomActivity,
	Deck,
	Guest,
	Presentation,
	Slide,
	Student,
	StudentActivity,
	Teacher
} from '$lib/pb/objects';

export interface SlideComponentProps {
	classroom: Classroom;
	deck: Deck;
	presentation: Presentation;
	slide: Slide;
	students: Student[];
	teachers: Teacher[];
	guests: Guest[];
	classroomActivity: ClassroomActivity;
	personActivityMap?: Map<string, BaseActivityObject<ActivityBasePB>>;
}

export interface StudentViewComponentProps {
	classroom: Classroom;
	deck: Deck;
	presentation: Presentation;
	slide: Slide;
	students: Student[];
	teachers: Teacher[];
	guests: Guest[];
	classroomActivity: ClassroomActivity;
	studentActivity?: StudentActivity;
}

export interface StudentInteractComponentProps extends StudentViewComponentProps {}

// 1) Glob-eager all your +slide.svelte files
const classSlideModules = import.meta.glob<{ default: Component<SlideComponentProps> }>(
	'./*/+slide.svelte',
	{
		eager: true
	}
);
const studentViewModules = import.meta.glob<{ default: Component<StudentViewComponentProps> }>(
	'./*/+student-view.svelte',
	{
		eager: true
	}
);

const studentControlModules = import.meta.glob<{
	default: Component<StudentInteractComponentProps>;
}>('./*/+student-interact.svelte', {
	eager: true
});

// 2) Build the map once at module load
const ClassSlideComponents = Object.fromEntries(
	Object.entries(classSlideModules).map(([filePath, mod]) => {
		const [, key] = /^\.\/([^/]+)\/\+slide\.svelte$/.exec(filePath)!;
		return [key, mod.default];
	})
) as Record<string, Component<SlideComponentProps>>;

const StudentViewComponents = Object.fromEntries(
	Object.entries(studentViewModules).map(([filePath, mod]) => {
		const [, key] = /^\.\/([^/]+)\/\+student-view\.svelte$/.exec(filePath)!;
		return [key, mod.default];
	})
) as Record<string, Component<StudentViewComponentProps>>;

const StudentInteractComponents = Object.fromEntries(
	Object.entries(studentControlModules).map(([filePath, mod]) => {
		const [, key] = /^\.\/([^/]+)\/\+student-interact\.svelte$/.exec(filePath)!;
		return [key, mod.default];
	})
) as Record<string, Component<StudentInteractComponentProps>>;

export function getClassSlideComponents(slides: DeckSlidePB[]): Component<SlideComponentProps>[] {
	return slides.map((slide) => {
		const comp = ClassSlideComponents[slide.component];
		if (!comp) {
			throw new Error(`"Class Slide" missing: "${slide.component}"`);
		}
		return comp;
	});
}

export function getStudentViewComponents(
	slides: DeckSlidePB[]
): Component<StudentViewComponentProps>[] {
	return slides.map((slide) => {
		const comp = StudentViewComponents[slide.component];
		if (!comp) {
			throw new Error(`"Student View" missing: "${slide.component}"`);
		}
		return comp;
	});
}

export function getStudentInteractComponents(
	slides: DeckSlidePB[]
): Component<StudentInteractComponentProps>[] {
	return slides.map((slide) => {
		const comp = StudentInteractComponents[slide.component];
		if (!comp) {
			throw new Error(`"Student Interact" missing: "${slide.component}"`);
		}
		return comp;
	});
}
