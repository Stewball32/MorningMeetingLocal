import type { RecordListOptions, RecordOptions } from 'pocketbase';
import type { Component } from 'svelte';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { pbGetFirst, pbGetList, pbGetOne } from './core';
import type { DeckPB, SlidePB } from './schema';
import {
	getClassSlideComponents,
	getStudentInteractComponents,
	getStudentViewComponents,
	type SlideComponentProps,
	type StudentInteractComponentProps,
	type StudentViewComponentProps
} from '$lib/slides';
import { getSlideRecordsOrdered, Slide } from './slides';

// =============================
// === Deck Record Functions ===
// =============================

export const getAllDeckRecords = async (options?: RecordListOptions): Promise<DeckPB[]> => {
	options = {
		requestKey: `get-all-decks`,
		...options
	};
	const result = await pbGetList<DeckPB>(COLLECTION_NAMES.Decks, options);
	return result ? result.items : [];
};

export const getDeckRecordByName = async (
	name: string,
	options?: RecordListOptions
): Promise<DeckPB | null> => {
	const filter: string = `name="${name}"`;
	options = {
		requestKey: `deck-by-name-${name}`,
		...options
	};
	return await pbGetFirst<DeckPB>(COLLECTION_NAMES.Decks, filter, options);
};

export const getDeckRecordById = async (
	id: string,
	options?: RecordOptions
): Promise<DeckPB | null> => {
	options = {
		requestKey: `deck-by-id-${id}`,
		...options
	};
	return await pbGetOne<DeckPB>(COLLECTION_NAMES.Decks, id, options);
};

// ===================
// === Deck Object ===
// ===================

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
