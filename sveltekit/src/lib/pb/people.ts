import type { RecordListOptions } from 'pocketbase';
import { BaseObject } from './base';
import { getPbImageUrl, pbCreate, pbGetByIds, pbGetFullList, pbUpdateRecord } from './core';
import { getClassroomRecordById } from './classrooms';
import { Emotion, getEmotionOverrideRecordsByPerson, getEmotionRecordsByIds } from './emotions';
import type { EmotionOverridePB, EmotionPB, PersonConfig, PersonPB } from './schema';
import { COLLECTION_NAMES } from './constants';

// ===============================
// === People Record Functions ===
// ===============================

export const getAllPeopleRecords = async (options?: RecordListOptions): Promise<PersonPB[]> => {
	options = {
		sort: 'name',
		...options
	};
	const result = await pbGetFullList<PersonPB>(COLLECTION_NAMES.People, options);
	return result ?? [];
};

export const getPeopleRecordsByIds = async (
	ids: string[],
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	return await pbGetByIds<PersonPB>(COLLECTION_NAMES.People, ids, {
		sort: 'name',
		...options
	});
};

export const getPeopleRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	const classroom = await getClassroomRecordById(classroomId, options);
	const personIds = [...new Set([...(classroom?.people ?? []), ...(classroom?.guests ?? [])])];
	return await pbGetByIds<PersonPB>(COLLECTION_NAMES.People, personIds, {
		sort: 'name',
		...options
	});
};

export const getRosterRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	const classroom = await getClassroomRecordById(classroomId, options);
	const personIds = classroom?.people ?? [];
	return await pbGetByIds<PersonPB>(COLLECTION_NAMES.People, personIds, {
		sort: 'name',
		...options
	});
};

export const getGuestRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PersonPB[]> => {
	const classroom = await getClassroomRecordById(classroomId, options);
	const personIds = classroom?.guests ?? [];
	return await pbGetByIds<PersonPB>(COLLECTION_NAMES.People, personIds, {
		sort: 'name',
		...options
	});
};

export const createPersonRecord = async (
	data: Partial<PersonPB>,
	options?: RecordListOptions
): Promise<PersonPB> => {
	const newRecord = await pbCreate<PersonPB>(COLLECTION_NAMES.People, data, options);
	if (!newRecord) throw Error('Failed to create Record');
	return newRecord;
};

// =====================
// === Person Object ===
// =====================

export class Person extends BaseObject<PersonPB> {
	private _emotionRecords: EmotionPB[] | null = null;
	private _emotionOverrides: EmotionOverridePB[] | null = null;
	private _emotions: Emotion[] | null = null;
	private _emotionsPromise: Promise<Emotion[]> | null = null;

	constructor(public record: PersonPB) {
		super(record);
	}

	async updateAvatar(avatar: File) {
		const newRecord = await pbUpdateRecord<PersonPB>(this.collectionId, this.id, {
			avatar: avatar
		} as unknown as Partial<PersonPB>);
		this.loadNewRecord(newRecord);
	}

	get avatarPath() {
		if (!this.record.avatar) return '';
		return getPbImageUrl(this.collectionId, this.record.id, this.record.avatar);
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

	get pronoun() {
		return this.record.pronoun || 'they';
	}

	get config() {
		return this.record.config || ({} as PersonConfig);
	}

	get data() {
		return this.record.data || {};
	}

	get emotionIds(): string[] {
		if (this.record.emotions !== undefined) return this.record.emotions;
		const configEmotions = (this.record.config as PersonConfig & { emotions?: string[] } | undefined)
			?.emotions;
		return configEmotions ?? [];
	}

	get emotions(): Emotion[] {
		return this._emotions ?? [];
	}

	private resetEmotionCache(): void {
		this._emotionRecords = null;
		this._emotionOverrides = null;
		this._emotions = null;
		this._emotionsPromise = null;
	}

	loadNewRecord(record: PersonPB): void {
		super.loadNewRecord(record);
		this.resetEmotionCache();
	}

	private async getEmotionRecords(): Promise<EmotionPB[]> {
		if (this._emotionRecords) return this._emotionRecords;
		if (!this.emotionIds.length) {
			this._emotionRecords = [];
			return [];
		}
		this._emotionRecords = await getEmotionRecordsByIds(this.emotionIds, {
			requestKey: `person-emotions-${this.id}`
		});
		return this._emotionRecords;
	}

	private async getEmotionOverrides(): Promise<EmotionOverridePB[]> {
		if (this._emotionOverrides) return this._emotionOverrides;
		if (!this.emotionIds.length) {
			this._emotionOverrides = [];
			return [];
		}
		this._emotionOverrides = await getEmotionOverrideRecordsByPerson(this.id);
		return this._emotionOverrides;
	}

	private async buildEmotions(): Promise<Emotion[]> {
		const [emotionRecords, emotionOverrides] = await Promise.all([
			this.getEmotionRecords(),
			this.getEmotionOverrides()
		]);
		const overridesByEmotion = new Map(
			emotionOverrides.map((override) => [override.emotion, override])
		);
		return emotionRecords
			.map((record) => new Emotion(record, overridesByEmotion.get(record.id)))
			.sort((a, b) => a.priority - b.priority);
	}

	async getEmotions(): Promise<Emotion[]> {
		if (this._emotions) return this._emotions;
		if (!this._emotionsPromise) this._emotionsPromise = this.buildEmotions();
		this._emotions = await this._emotionsPromise;
		return this._emotions;
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
