import type { RecordListOptions, RecordOptions } from 'pocketbase';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { pbCreateRecord, pbGetFullList, pbGetOne, pbUpdateRecord } from './core';
import type { PresentationPB } from './schema';

// ===========================================
// === Class Presentation Record Functions ===
// ===========================================

export const getPresentationRecords = async (
	classroomId: string,
	options?: RecordListOptions
): Promise<PresentationPB[]> => {
	options = {
		sort: '-updated',
		requestKey: `get-presentations-${classroomId}`,
		...options,
		filter: `classroom = "${classroomId}"`
	};
	return await pbGetFullList<PresentationPB>(COLLECTION_NAMES.Presentations, options);
};

export const getPresentationRecordById = async (
	id: string,
	options?: RecordOptions
): Promise<PresentationPB | null> => {
	options = {
		requestKey: `get-presentation-${id}`,
		...options
	};
	return await pbGetOne<PresentationPB>(COLLECTION_NAMES.Presentations, id, options);
};

const createPresentationRecord = async (
	classroomId: string,
	deckId: string,
	options?: RecordOptions
): Promise<PresentationPB> => {
	const partial: Partial<PresentationPB> = {
		classroom: classroomId,
		deck: deckId
	};
	options = {
		requestKey: `create-presentation-${classroomId}-${deckId}`,
		...options
	};
	return await pbCreateRecord<PresentationPB>(COLLECTION_NAMES.Presentations, partial, options);
};

export const updatePresentationRecord = async (
	data: Partial<PresentationPB>,
	options?: RecordOptions
): Promise<PresentationPB> => {
	options = {
		requestKey: `update-presentation-${data.id}`,
		...options
	};
	if (!data.id) throw new Error('Cannot update class presentation record without an ID');
	return await pbUpdateRecord<PresentationPB>(
		COLLECTION_NAMES.Presentations,
		data.id,
		data,
		options
	);
};

// ===========================
// === Presentation Object ===
// ===========================

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
