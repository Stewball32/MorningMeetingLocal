import type { RecordListOptions, RecordOptions } from 'pocketbase';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { pbCreateRecord, pbGetByIds, pbGetFullList, pbGetOne } from './core';
import { getImageRecord, ImageAsset } from './images';
import type { EmotionOverridePB, EmotionPB } from './schema';

// ================================
// === Emotion Record Functions ===
// ================================

export const getAllEmotionRecords = async (options?: RecordListOptions): Promise<EmotionPB[]> => {
	options = {
		sort: 'priority',
		...options
	};
	return await pbGetFullList<EmotionPB>(COLLECTION_NAMES.Emotions, options);
};

export const getEmotionRecordById = async (
	id: string,
	options?: RecordOptions
): Promise<EmotionPB | null> => {
	options = {
		requestKey: `emotion-by-id-${id}`,
		...options
	};
	return await pbGetOne<EmotionPB>(COLLECTION_NAMES.Emotions, id, options);
};

export const getEmotionRecordsByIds = async (
	ids: string[],
	options?: RecordListOptions
): Promise<EmotionPB[]> => {
	return await pbGetByIds<EmotionPB>(COLLECTION_NAMES.Emotions, ids, {
		sort: 'priority',
		...options
	});
};

export const createEmotionRecord = async (data: Partial<EmotionPB>): Promise<EmotionPB> => {
	const newRecord = await pbCreateRecord<EmotionPB>(COLLECTION_NAMES.Emotions, data);
	if (!newRecord) throw new Error('Failed to create Emotion record');
	return newRecord;
};

// ========================================
// === Emotion Override Record Functions ===
// ========================================

export const getEmotionOverrideRecordsByPerson = async (
	personId: string,
	options?: RecordListOptions
): Promise<EmotionOverridePB[]> => {
	const filter = `person = "${personId}"`;
	options = {
		sort: 'priority',
		requestKey: `emotion-overrides-${personId}`,
		...options,
		filter
	};
	return await pbGetFullList<EmotionOverridePB>(COLLECTION_NAMES.EmotionOverrides, options);
};

// ======================
// === Emotion Object ===
// ======================

export class Emotion extends BaseObject<EmotionPB> {
	private _imageAsset: ImageAsset | null = null;

	constructor(
		public record: EmotionPB,
		public override?: EmotionOverridePB
	) {
		super(record);
	}

	get name() {
		return this.record.name;
	}

	get imageId() {
		return this.override?.image || this.record.image;
	}

	get priority() {
		return this.override?.priority || this.record.priority;
	}

	async getImageAsset(): Promise<ImageAsset | null> {
		if (this._imageAsset) return this._imageAsset;
		if (!this.imageId) return null;
		const imageRecord = await getImageRecord(this.imageId, `emotion-image-${this.imageId}`);
		if (!imageRecord) return null;
		this._imageAsset = new ImageAsset(imageRecord);
		return this._imageAsset;
	}

	async getImagePath(): Promise<string> {
		const imageAsset = await this.getImageAsset();
		return imageAsset?.imagePath ?? '';
	}
}
