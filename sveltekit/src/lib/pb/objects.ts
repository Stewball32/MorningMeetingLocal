import { getCurrentISOString } from '$lib';
import {
	getAllClassIcons,
	getGuestRecordsByClassroom,
	getSlideRecordsByClassroom,
	getStudentRecordsByClassroom,
	getTeacherRecordsByClassroom,
	getSlideRecordsOrdered,
	getIconRecord,
	resolveClassPresentationRecord,
	getPbImageUrl,
	getClassroomRecordByName,
	getClassroomRecordById,
	getDeckRecordByName,
	getDeckRecordById,
	resolveIndividualPresentationActivityRecords,
	updateClassPresentationRecord,
	pbUpdateRecord,
	pbSubscribeToRecord
} from '$lib/pb/records';
import type {
	ClassroomPB,
	ClassIconPB,
	PersonBasePB,
	GuestPB,
	RosteredPB,
	DeckSlidePB,
	DeckPB,
	TeacherPB,
	StudentPB,
	ClassPresentationPB,
	ActivityBasePB,
	allActivityCollections,
	ActivityStudentPB,
	ActivityGuestPB,
	ActivityTeacherPB,
	ActivityClassroomPB
} from '$lib/pb/types';
import {
	getClassSlideComponents,
	getStudentInteractComponents,
	getStudentViewComponents,
	type StudentInteractComponentProps,
	type SlideComponentProps,
	type StudentViewComponentProps
} from '$lib/slides';
import type { RecordModel, RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import type { Component } from 'svelte';

export class SchoolBuilder {
	static async getClassroom(nameOrId: string): Promise<Classroom> {
		let record: ClassroomPB | null = null;
		record = (await getClassroomRecordByName(nameOrId)) ?? (await getClassroomRecordById(nameOrId));
		if (!record) throw new Error(`Classroom not found: ${nameOrId}`);
		return new Classroom(record);
	}

	static async getDeck(nameOrId: string): Promise<Deck> {
		let record: DeckPB | null = null;
		record = (await getDeckRecordByName(nameOrId)) ?? (await getDeckRecordById(nameOrId));
		if (!record) throw new Error(`Deck not found: ${nameOrId}`);
		return new Deck(record);
	}

	static async getDeckSlides(deck: DeckPB | Deck): Promise<DeckSlidePB[]> {
		return await getSlideRecordsOrdered(deck.slidesIds);
	}

	static async getClassStudents(classroomId: string): Promise<Student[]> {
		const studentRecords = await getStudentRecordsByClassroom(classroomId);
		return studentRecords.map((record) => new Student(record));
	}

	static async getClassTeachers(classroomId: string): Promise<Teacher[]> {
		const teacherRecords = await getTeacherRecordsByClassroom(classroomId);
		return teacherRecords.map((record) => new Teacher(record));
	}

	static async getClassGuests(classroomId: string): Promise<Guest[]> {
		const guestRecords = await getGuestRecordsByClassroom(classroomId);
		const guestIcons: (ClassIconPB | null)[] = [];
		for (const record of guestRecords) {
			guestIcons.push(await getIconRecord(record.icon, `${record.id}-icon`));
		}
		return guestRecords.map(
			(record, index) => new Guest(record, guestIcons[index] ? new Icon(guestIcons[index]) : null)
		);
	}

	static async getClassIcons(classroomId: string): Promise<Icon[]> {
		const iconRecords = await getAllClassIcons(classroomId);
		return iconRecords.map((record) => new Icon(record));
	}
}

abstract class BaseObject<T extends RecordModel> {
	private _unsubscribe?: UnsubscribeFunc;

	constructor(public record: T) {}

	get id() {
		return this.record.id;
	}
	get created() {
		return this.record.created;
	}
	get updated() {
		return this.record.updated;
	}
	get collectionId() {
		return this.record.collectionId;
	}
	get collectionName() {
		return this.record.collectionName;
	}

	loadNewRecord(record: T): void {
		this.record = record;
	}

	async updateRecord(partial: Partial<T>): Promise<boolean> {
		const recordData = {
			...partial,
			id: this.id
		} as Partial<T>;
		const updatedRecord = await pbUpdateRecord<T>(this.collectionId, this.id, recordData);
		return !!updatedRecord;
	}

	async subscribe(callback: (data: RecordSubscription<T>) => void): Promise<boolean> {
		if (this._unsubscribe) {
			console.warn(`Already subscribed to record ${this.id}. Unsubscribing first.`);
			await this.unsubscribe();
		}
		this._unsubscribe = await pbSubscribeToRecord<T>(this.collectionId, this.id, callback);
		return !!this._unsubscribe;
	}

	async unsubscribe(): Promise<void> {
		if (!this._unsubscribe) return;
		this._unsubscribe();
		this._unsubscribe = undefined;
	}
}

class Icon extends BaseObject<ClassIconPB> {
	constructor(public record: ClassIconPB) {
		super(record);
	}

	get name() {
		return this.record.name;
	}
	get emoji() {
		return this.record.emoji || '';
	}
	get url() {
		return getPbImageUrl(this.record.collectionId, this.record.id, this.record.image);
	}
	get forAvatar() {
		return this.record.for_avatar || false;
	}
	get forCalendar() {
		return this.record.for_calendar || false;
	}
}

export class Deck extends BaseObject<DeckPB> {
	private _slideRecords: DeckSlidePB[] | null = null;
	private _slides: Slide[] | null = null;
	constructor(public record: DeckPB) {
		super(record);
	}
	get name() {
		return this.record.name;
	}

	get slidesIds() {
		return this.record.slides;
	}

	async getPresentation(classId: string, isoString: string): Promise<ClassPresentationPB> {
		return await resolveClassPresentationRecord(classId, this.id, isoString);
	}

	async resolveIndividualActivityRecords(
		presentationId: string,
		personOrClassroom: ClassroomPB | StudentPB | TeacherPB | GuestPB
	): Promise<ClassroomActivity[]> {
		const activityRecords = await resolveIndividualPresentationActivityRecords(
			presentationId,
			this.slidesIds,
			personOrClassroom
		);
		return activityRecords.map((record) => new ClassroomActivity(record as ActivityClassroomPB));
	}

	async getSlides(): Promise<Slide[]> {
		if (this._slides) return this._slides;
		if (!this._slideRecords) await getSlideRecordsOrdered(this.slidesIds);
		if (!this._slideRecords || this._slideRecords.length === 0) {
			console.warn(`No slides found for deck: ${this.name}`);
			return [];
		}
		this._slides = this._slideRecords.map((record) => new Slide(record));
		return this._slides;
	}

	async getSlideRecords(): Promise<DeckSlidePB[]> {
		if (this._slideRecords) return this._slideRecords;
		this._slideRecords = await getSlideRecordsOrdered(this.slidesIds);
		return this._slideRecords;
	}

	async getClassSlideComponents(): Promise<Component<SlideComponentProps>[]> {
		const slideRecords = await this.getSlideRecords();
		return getClassSlideComponents(slideRecords);
	}
	async getStudentViewComponents(): Promise<Component<StudentViewComponentProps>[]> {
		const slideRecords = await this.getSlideRecords();
		return getStudentViewComponents(slideRecords);
	}

	async getStudentInteractComponents(): Promise<Component<StudentInteractComponentProps>[]> {
		const slideRecords = await this.getSlideRecords();
		return getStudentInteractComponents(slideRecords);
	}
}

export class Classroom extends BaseObject<ClassroomPB> {
	constructor(public record: ClassroomPB) {
		super(record);
	}
	get id() {
		return this.record.id;
	}
	get name() {
		return this.record.name;
	}

	get config() {
		return this.record.config || {};
	}

	async getPresentation(deckId: string, isoString: string): Promise<Presentation> {
		const presentationPB = await resolveClassPresentationRecord(this.id, deckId, isoString);
		return new Presentation(presentationPB);
	}
}

export class Presentation extends BaseObject<ClassPresentationPB> {
	constructor(public record: ClassPresentationPB) {
		super(record);
	}
	get id() {
		return this.record.id;
	}
	get classroomId() {
		return this.record.classroom;
	}
	get deckId() {
		return this.record.deck;
	}
	get dateISO() {
		return this.record.date;
	}
	get slideIndex() {
		return this.record.slide ?? 0;
	}
	get data() {
		return this.record.data ?? {};
	}

	async moveSlide(totalSlides: number, slideAdjustment: number): Promise<void> {
		const newSlideIndex = Math.max(Math.min(totalSlides - 1, this.slideIndex + slideAdjustment), 0);
		const partial: Partial<ClassPresentationPB> = {
			id: this.id,
			slide: newSlideIndex
		};
		await this.updateRecord(partial);
	}
}

export class Slide extends BaseObject<DeckSlidePB> {
	constructor(public record: DeckSlidePB) {
		super(record);
	}
	get id() {
		return this.record.id;
	}
	get name() {
		return this.record.name;
	}
	get component() {
		return this.record.component;
	}
	get hidden() {
		return this.record.hidden || false;
	}
	get config() {
		return this.record.config || {};
	}
	get data() {
		return this.record.data || {};
	}

	updateConfig(partial: Partial<DeckSlidePB['config']>): Promise<boolean> {
		const recordConfig = {
			...this.config,
			...partial
		};
		return this.updateRecord({ config: recordConfig });
	}

	async updateData(partial: Partial<DeckSlidePB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as DeckSlidePB;
		return this.updateRecord({ data: recordData });
	}
}

abstract class Person extends BaseObject<PersonBasePB> {
	protected extraVideoParams: string = '?rel=0&enablejsapi=1&autoplay=0';

	constructor(public record: PersonBasePB) {
		super(record);
	}
	get id() {
		return this.record.id;
	}
	get name() {
		return this.record.name;
	}
	get classroomId() {
		return this.record.classroom;
	}
	get pronoun() {
		return this.record.pronoun || 'they';
	}
	get pronounSubject() {
		const subjects = {
			he: 'he',
			she: 'she',
			they: 'they'
		};
		return subjects[this.pronoun];
	}
	get pronounObject() {
		const objects = {
			he: 'him',
			she: 'her',
			they: 'them'
		};
		return objects[this.pronoun] || 'them';
	}
	get pronounDependentPossessive() {
		const possessives = {
			he: 'his',
			she: 'her',
			they: 'their'
		};
		return possessives[this.pronoun] || 'their';
	}
	get pronounIndependentPossessive() {
		const possessives = {
			he: 'his',
			she: 'hers',
			they: 'theirs'
		};
		return possessives[this.pronoun] || 'theirs';
	}
	get pronounReflexive() {
		const reflexives = {
			he: 'himself',
			she: 'herself',
			they: 'themselves'
		};
		return reflexives[this.pronoun] || 'themselves';
	}

	get config() {
		return {};
	}
	abstract get avatarUrl(): string;

	abstract get videoId(): string;
	abstract get videoStart(): number;
	abstract get videoEnd(): number;

	// abstract get videoEmbedUrl(): string;
	// abstract get videoUrl(): string;

	abstract resolvePresentationActivityRecords(
		presentationId: string,
		slidesIds: string[]
	): Promise<BaseActivityObject<ActivityBasePB>[]>;
}

export class Guest extends Person {
	constructor(
		public record: GuestPB,
		public icon: Icon | null = null
	) {
		super(record);
	}

	get avatarUrl() {
		return this.icon?.url || '';
	}
	// Guests don't have a unique video ID, so we use a default
	private get videoParams() {
		const videoId = '0gzKRGcmnFs'; // Beauty and the Beast - Be Our Guest
		const start = `&start=${206}`;
		const end = `&end=${222}`;
		let params = videoId + this.extraVideoParams + start + end;
		return params;
	}
	get videoId() {
		return '0gzKRGcmnFs'; // Beauty and the Beast - Be Our Guest
	}
	get videoStart() {
		return 206; // Start at 3:26
	}
	get videoEnd() {
		return 222; // End at 3:42
	}
	// get videoEmbedUrl() {
	// 	return `https://www.youtube.com/embed/${this.videoParams}`;
	// }
	// get videoUrl() {
	// 	return `https://www.youtube.com/watch?v=${this.videoParams}`;
	// }

	async resolvePresentationActivityRecords(
		presentationId: string,
		slidesIds: string[]
	): Promise<GuestActivity[]> {
		const activityRecords = await resolveIndividualPresentationActivityRecords(
			presentationId,
			slidesIds,
			this.record
		);
		return activityRecords.map((record) => new GuestActivity(record as ActivityGuestPB));
	}
}

abstract class PersonRostered extends Person {
	constructor(public record: RosteredPB) {
		super(record);
	}
	get avatarUrl() {
		if (!this.record.avatar) return '';
		return getPbImageUrl(this.record.collectionId, this.record.id, this.record.avatar);
	}

	get videoId() {
		return this.record.video_id || '';
	}
	get videoStart() {
		return this.record.video_start || 0;
	}
	get videoEnd() {
		return this.record.video_end || 0;
	}

	// private get videoParams() {
	// 	if (!this.videoId) return '';
	// 	let params = this.extraVideoParams;
	// 	if (this.record.video_start) {
	// 		params += `&start=${this.record.video_start}`;
	// 	}
	// 	if (this.record.video_end) {
	// 		params += `&end=${this.record.video_end}`;
	// 	}
	// 	return params;
	// }
	// get videoEmbedUrl() {
	// 	const params = this.videoParams;
	// 	if (!params) return '';
	// 	const url = `https://www.youtube.com/embed/${this.videoId}?${params}`;
	// 	console.log(`Video Embed URL: ${url}`);
	// 	return `https://www.youtube.com/embed/${this.videoId}?${params}?`;
	// }
	// get videoUrl() {
	// 	const params = this.videoParams;
	// 	if (!params) return '';
	// 	return `https://www.youtube.com/watch?v=${this.videoId}&${params}`;
	// }
}

export class Student extends PersonRostered {
	constructor(public record: StudentPB) {
		super(record);
	}

	override get config() {
		return this.record.config || {};
	}

	async resolvePresentationActivityRecords(
		presentationId: string,
		slidesIds: string[]
	): Promise<StudentActivity[]> {
		const activityRecords = await resolveIndividualPresentationActivityRecords(
			presentationId,
			slidesIds,
			this.record
		);
		const activities = activityRecords.map(
			(record) => new StudentActivity(record as ActivityStudentPB)
		);
		return activities;
	}
}

export class Teacher extends PersonRostered {
	constructor(public record: TeacherPB) {
		super(record);
	}

	async resolvePresentationActivityRecords(
		presentationId: string,
		slidesIds: string[]
	): Promise<TeacherActivity[]> {
		const activityRecords = await resolveIndividualPresentationActivityRecords(
			presentationId,
			slidesIds,
			this.record
		);
		return activityRecords.map((record) => new TeacherActivity(record as ActivityTeacherPB));
	}
}

export abstract class BaseActivityObject<T extends ActivityBasePB> extends BaseObject<T> {
	constructor(public record: T) {
		super(record);
	}
	get presentationId() {
		return this.record.presentation;
	}
	get slideId() {
		return this.record.slide;
	}
	get data() {
		return this.record.data || {};
	}
	abstract get personId(): string;

	async updateData(partial: Partial<T>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		};
		return this.updateRecord({ data: recordData } as Partial<T>);
	}
}

export class ClassroomActivity extends BaseActivityObject<ActivityClassroomPB> {
	constructor(public record: ActivityClassroomPB) {
		super(record);
	}
	async updateData(partial: Partial<ActivityClassroomPB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as ActivityClassroomPB;
		return this.updateRecord({ data: recordData });
	}
	get personId() {
		return '';
	}
}

export class GuestActivity extends BaseActivityObject<ActivityGuestPB> {
	constructor(public record: ActivityGuestPB) {
		super(record);
	}
	async updateData(partial: Partial<ActivityGuestPB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as ActivityGuestPB;
		return this.updateRecord({ data: recordData });
	}
	get guestId() {
		return this.record.guest;
	}
	get personId() {
		return this.guestId;
	}
}

export class TeacherActivity extends BaseActivityObject<ActivityTeacherPB> {
	constructor(public record: ActivityTeacherPB) {
		super(record);
	}
	async updateData(partial: Partial<ActivityTeacherPB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as ActivityTeacherPB;
		return this.updateRecord({ data: recordData });
	}
	get teacherId() {
		return this.record.teacher;
	}
	get personId() {
		return this.teacherId;
	}
}

export class StudentActivity extends BaseActivityObject<ActivityStudentPB> {
	constructor(public record: ActivityStudentPB) {
		super(record);
	}
	async updateData(partial: Partial<ActivityStudentPB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as ActivityStudentPB;
		return this.updateRecord({ data: recordData });
	}
	get studentId() {
		return this.record.student;
	}
	get personId() {
		return this.studentId;
	}
}
