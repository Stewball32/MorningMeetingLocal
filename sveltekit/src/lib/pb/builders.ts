import type { ClassroomPB, DeckPB, PersonPB, SlidePB } from './schema';
import {
	Classroom,
	createClassroomRecord,
	getAllClassroomRecords,
	getClassroomRecordById,
	getClassroomRecordByName
} from './classrooms';
import {
	createPersonRecord,
	getAllPeopleRecords,
	getGuestRecordsByClassroom,
	getPeopleRecordsByClassroom,
	getRosterRecordsByClassroom,
	Person
} from './people';
import { Deck, getAllDeckRecords, getDeckRecordById, getDeckRecordByName } from './decks';
import { getAllSlideRecords, getSlideRecordsOrdered, Slide } from './slides';
import { getAllImageRecords, ImageAsset } from './images';
import { getAllEmotionRecords, Emotion } from './emotions';

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

	static async getAllImageAssets(): Promise<ImageAsset[]> {
		return (await getAllImageRecords()).map((record) => new ImageAsset(record));
	}

	static async getAllEmotions(): Promise<Emotion[]> {
		return (await getAllEmotionRecords()).map((record) => new Emotion(record));
	}

	static async createPerson(data: Partial<PersonPB>): Promise<Person> {
		return new Person(await createPersonRecord(data));
	}

	static async createClassroom(data: Partial<ClassroomPB>): Promise<Classroom> {
		return new Classroom(await createClassroomRecord(data));
	}
}

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
		return (await getPeopleRecordsByClassroom(classroomId)).map((record) => new Person(record));
	}

	static async getActivePeopleInClassroom(classroomId: string): Promise<Person[]> {
		return (await getRosterRecordsByClassroom(classroomId)).map((record) => new Person(record));
	}

	static async getGuestsInClassroom(classroomId: string): Promise<Person[]> {
		return (await getGuestRecordsByClassroom(classroomId)).map((record) => new Person(record));
	}

	// static async getClassIcons(_classroomId: string): Promise<ImageAsset[]> {
	// 	return (await getImageRecordsByTags(['guest', 'calendar'])).map(
	// 		(record) => new ImageAsset(record)
	// 	);
	// }
}
