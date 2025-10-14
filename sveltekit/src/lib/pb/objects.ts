import { getCurrentISOString } from '$lib';
import {
	getAllIcons,
	getSlideRecordsByClassroom,
	getSlideRecordsOrdered,
	getIconRecord,
	getPbImageUrl,
	getClassroomRecordByName,
	getClassroomRecordById,
	getDeckRecordByName,
	getDeckRecordById,
	updatePresentationRecord,
	pbUpdateRecord,
	pbSubscribeToRecord,
	getAllClassroomRecords,
	getAllDeckRecords,
	getAllSlideRecords,
	getPeopleRecordsByClassroom,
	getRosterRecordsByClassroom,
	getGuestRecordsByClassroom,
	getAllPeopleRecords
} from '$lib/pb/records';
import type {
	ClassroomPB,
	IconPB,
	PersonPB,
	SlidePB,
	DeckPB,
	PresentationPB,
	ActivityBasePB,
	ActivityPresentation,
	ActivityPersonPB,
	PersonConfig
} from '$lib/pb/schema';
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

export class ClassroomBuilder {
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

	static async getSlidesInDeck(deck: DeckPB | Deck): Promise<SlidePB[]> {
		return await getSlideRecordsOrdered(deck.slidesIds);
	}

	static async getAllPeopleInClassroom(classroomId: string): Promise<Person[]> {
		return (await getPeopleRecordsByClassroom<PersonPB>(classroomId)).map(
			(record) => new Person(record)
		);
	}

	static async getActivePeopleInClassroom(classroomId: string): Promise<Person[]> {
		return (await getRosterRecordsByClassroom(classroomId)).map((record) => new Person(record));
	}

	static async getGuestsInClassroom(classroomId: string): Promise<Person[]> {
		return (await getGuestRecordsByClassroom(classroomId)).map((record) => new Person(record));
	}

	static async getClassIcons(classroomId: string): Promise<Icon[]> {
		return (await getAllIcons(classroomId)).map((record) => new Icon(record));
	}
}

export class SchoolBuilder {
	static async getAllClassrooms(): Promise<Classroom[]> {
		return (await getAllClassroomRecords()).map((record) => new Classroom(record));
	}

	static async getAllDecks(): Promise<Deck[]> {
		return (await getAllDeckRecords()).map((record) => new Deck(record));
	}

	static async getAllSlides(): Promise<Slide[]> {
		return (await getAllSlideRecords()).map((record) => new Slide(record));
	}

	static async getAllPeople(): Promise<Person[]> {
		return (await getAllPeopleRecords()).map((record) => new Person(record));
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

class Icon extends BaseObject<IconPB> {
	constructor(public record: IconPB) {
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
	private _slideRecords: SlidePB[] | null = null;
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

	async getSlideRecords(): Promise<SlidePB[]> {
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
	get name() {
		return this.record.name;
	}

	get config() {
		return this.record.config || {};
	}
}

export class Presentation extends BaseObject<PresentationPB> {
	constructor(public record: PresentationPB) {
		super(record);
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
		const partial: Partial<PresentationPB> = {
			id: this.id,
			slide: newSlideIndex
		};
		await this.updateRecord(partial);
	}
}

export class Slide extends BaseObject<SlidePB> {
	constructor(public record: SlidePB) {
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

	updateConfig(partial: Partial<SlidePB['config']>): Promise<boolean> {
		const recordConfig = {
			...this.config,
			...partial
		};
		return this.updateRecord({ config: recordConfig });
	}

	async updateData(partial: Partial<SlidePB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as SlidePB;
		return this.updateRecord({ data: recordData });
	}
}

export class Person extends BaseObject<PersonPB> {
	constructor(public record: PersonPB) {
		super(record);
	}

	get avatarUrl() {
		if (!this.record.avatar) return '';
		return getPbImageUrl(this.record.collectionId, this.record.id, this.record.avatar);
	}

	get name() {
		return this.record.name;
	}

	get role() {
		return this.record.role;
	}

	get title() {
		return this.record.title || '';
	}

	get classroomIds() {
		return this.record.classrooms || [];
	}

	get guestroomIds() {
		return this.record.guestrooms || [];
	}

	get pronoun() {
		return this.record.pronoun || 'they';
	}

	get config() {
		return this.record.config || ({} as PersonConfig);
	}

	get data() {
		return this.record.data || {};
	}

	private allPronouns = {
		he: {
			subject: 'he',
			object: 'him',
			dependentPossessive: 'his',
			independentPossessive: 'his',
			reflexive: 'himself'
		},
		she: {
			subject: 'she',
			object: 'her',
			dependentPossessive: 'her',
			independentPossessive: 'hers',
			reflexive: 'herself'
		},
		they: {
			subject: 'they',
			object: 'them',
			dependentPossessive: 'their',
			independentPossessive: 'theirs',
			reflexive: 'themselves'
		}
	};

	get pronounTypes() {
		return this.allPronouns[this.pronoun] || this.allPronouns['they'];
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

	async updateData(partial: Partial<T>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		};
		return this.updateRecord({ data: recordData } as Partial<T>);
	}
}

export class PresentationActivity extends BaseActivityObject<ActivityPresentation> {
	constructor(public record: ActivityPresentation) {
		super(record);
	}
}

export class StudentActivity extends BaseActivityObject<ActivityPersonPB> {
	constructor(public record: ActivityPersonPB) {
		super(record);
	}
	get personId() {
		return this.record.person;
	}
	async updateData(partial: Partial<ActivityPersonPB>): Promise<boolean> {
		const recordData = {
			...this.data,
			...partial
		} as ActivityPersonPB;
		return this.updateRecord({ data: recordData });
	}
}
