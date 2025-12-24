import type { RecordListOptions } from 'pocketbase';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { getPbImageUrl, pb, pbGetFullList } from './core';
import type { ImagePB } from './schema';

// ================================
// === Image Record Functions ===
// ================================

const mergeFilters = (filters: (string | undefined)[]): string | undefined => {
	const sanitized = filters.filter((filter): filter is string => !!filter);
	if (!sanitized.length) return undefined;
	return sanitized.map((filter) => `(${filter})`).join(' && ');
};

const buildTagFilter = (tags?: ImagePB['tags'] | ImagePB['tags'][]): string | undefined => {
	if (!tags) return undefined;
	const tagList = Array.isArray(tags) ? tags : [tags];
	if (!tagList.length) return undefined;
	const tagFilters = tagList.map((tag) => `(tags ?= "${tag}" || tags = "${tag}")`);
	return tagFilters.join(' || ');
};

export const getAllImageRecords = async (options?: RecordListOptions): Promise<ImagePB[]> => {
	options = {
		sort: 'name',
		...options
	};
	return await pbGetFullList<ImagePB>(COLLECTION_NAMES.Images, options);
};

export const getImageRecordsByTags = async (
	tags: ImagePB['tags'] | ImagePB['tags'][],
	options?: RecordListOptions
): Promise<ImagePB[]> => {
	const filter = mergeFilters([options?.filter, buildTagFilter(tags)]);
	options = {
		sort: 'name',
		...options,
		filter
	};
	return await pbGetFullList<ImagePB>(COLLECTION_NAMES.Images, options);
};

export const getImageRecord = async (id: string, requestKey?: string): Promise<ImagePB | null> => {
	try {
		const imageRecord = (await pb
			.collection(COLLECTION_NAMES.Images)
			.getOne(id, { requestKey })) as ImagePB;
		return imageRecord;
	} catch (error) {
		console.error(`Error fetching image record with ID ${id}:`, error);
		return null;
	}
};

// =========================
// === ImageAsset Object ===
// =========================

export class ImageAsset extends BaseObject<ImagePB> {
	constructor(public record: ImagePB) {
		super(record);
	}

	get name() {
		return this.record.name;
	}

	get label() {
		return this.record.label ?? this.record.name;
	}

	get imagePath() {
		if (!this.record.image) return '';
		return getPbImageUrl(this.record.collectionId, this.record.id, this.record.image);
	}

	get tags() {
		return this.record.tags;
	}

	get config() {
		return this.record.config || {};
	}
}
