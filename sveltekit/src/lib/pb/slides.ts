import type { RecordListOptions } from 'pocketbase';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { pbGetFullList, pbGetList } from './core';
import type { SlidePB } from './schema';

// ==============================
// === Slide Record Functions ===
// ==============================

export const getAllSlideRecords = async (options?: RecordListOptions): Promise<SlidePB[]> => {
	options = {
		requestKey: `get-all-slides`,
		...options
	};
	const result = await pbGetList<SlidePB>(COLLECTION_NAMES.Slides, options);
	return result ? result.items : [];
};

export const getSlideRecordsByClassroom = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<SlidePB[]> => {
	options = {
		sort: 'order',
		requestKey: `slides-by-classroom-${classroomId}`,
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<SlidePB>(COLLECTION_NAMES.Slides, options);
};

export const getSlideRecordsOrdered = async (
	slideIds: string[],
	options?: RecordListOptions
): Promise<SlidePB[]> => {
	if (slideIds.length === 0) return [];
	options = {
		requestKey: `slides-ordered-${slideIds.join(',')}`,
		...options,
		filter: `"${slideIds}" ~ id`
	};
	const slides = await pbGetFullList<SlidePB>(COLLECTION_NAMES.Slides, options);
	return (
		slideIds
			.map((id) => slides.find((slide) => slide.id === id))
			// Filter for typescript strict mode
			// Undefined shouldn't be possible here, but just in case
			.filter((slide) => slide !== undefined)
	);
};

// ====================
// === Slide Object ===
// ====================

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
