import type { Component } from 'svelte';
import type { ActivityBasePB, SlidePB } from '$lib/pb/schema/index';
import type {
	BaseActivityObject,
	Classroom,
	PresentationActivity,
	Deck,
	Person,
	Presentation,
	Slide,
	StudentActivity
} from '$lib/pb';

export interface SlideComponentProps {
	classroom: Classroom;
	deck: Deck;
	presentation: Presentation;
	slide: Slide;
	students: Person[];
	teachers: Person[];
	guests: Person[];
	classroomActivity: PresentationActivity;
	personActivityMap?: Map<string, BaseActivityObject<ActivityBasePB>>;
}

export interface StudentViewComponentProps {
	classroom: Classroom;
	deck: Deck;
	presentation: Presentation;
	slide: Slide;
	students: Person[];
	teachers: Person[];
	guests: Person[];
	classroomActivity: PresentationActivity;
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

export function getClassSlideComponents(slides: SlidePB[]): Component<SlideComponentProps>[] {
	return slides.map((slide) => {
		const comp = ClassSlideComponents[slide.component];
		if (!comp) {
			throw new Error(`"Class Slide" missing: "${slide.component}"`);
		}
		return comp;
	});
}

export function getStudentViewComponents(
	slides: SlidePB[]
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
	slides: SlidePB[]
): Component<StudentInteractComponentProps>[] {
	return slides.map((slide) => {
		const comp = StudentInteractComponents[slide.component];
		if (!comp) {
			throw new Error(`"Student Interact" missing: "${slide.component}"`);
		}
		return comp;
	});
}
