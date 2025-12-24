import type {
	RecordListOptions,
	RecordOptions,
	RecordSubscription,
	UnsubscribeFunc
} from 'pocketbase';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { pbCreateRecord, pbGetFirst, pbGetFullList, pbSubscribeToRecord } from './core';
import type { ActivityBasePB, ActivityPersonPB, ActivityPresentation } from './schema';

// =================================
// === Activity Record Functions ===
// =================================

export const getExistingPersonActivityRecords = async (
	personId: string,
	presentationId: string,
	options?: RecordListOptions
): Promise<ActivityPersonPB[]> => {
	const filter = `"${presentationId}" = presentation && person = "${personId}"`;
	options = {
		requestKey: `existing-person-activity-${personId}-${presentationId}`,
		...options,
		filter: filter
	};
	return await pbGetFullList<ActivityPersonPB>(COLLECTION_NAMES.PeopleActivity, options);
};

export const resolvePersonActivityRecord = async (
	personId: string,
	presentationId: string,
	slideId: string,
	options?: RecordListOptions
): Promise<void> => {
	const filter = `"${presentationId}" = presentation && slide = "${slideId}" && person = "${personId}"`;
	options = {
		requestKey: `existing-person-activity-${personId}-${presentationId}-${slideId}`,
		...options,
		filter: filter
	};
	let record = await pbGetFirst<ActivityPersonPB>(COLLECTION_NAMES.PeopleActivity, filter, options);
	if (!record) {
		const newRecord = {
			presentation: presentationId,
			slide: slideId,
			person: personId
		} as Partial<ActivityPersonPB>;
		options = {
			requestKey: `create-person-activity-${personId}-${presentationId}-${slideId}`,
			...options
		};
		await pbCreateRecord<ActivityPersonPB>(COLLECTION_NAMES.PeopleActivity, newRecord, options);
	}
};

export const getExistingPresentationActivityRecords = async (
	presentationId: string,
	options?: RecordListOptions
): Promise<ActivityPresentation[]> => {
	const filter = `presentation = "${presentationId}"`;
	options = {
		requestKey: `existing-presentation-activities-${presentationId}`,
		...options,
		filter: filter
	};
	return await pbGetFullList<ActivityPresentation>(COLLECTION_NAMES.PresentationActivity, options);
};

export const resolvePresentationActivityRecord = async (
	presentationId: string,
	slideId: string,
	options?: RecordListOptions
): Promise<void> => {
	const filter = `"${presentationId}" = presentation && slide = "${slideId}" `;
	options = {
		requestKey: `existing-presentation-activity-${presentationId}-${slideId}`,
		...options
	};
	let record = await pbGetFirst<ActivityPresentation>(
		COLLECTION_NAMES.PresentationActivity,
		filter,
		options
	);
	if (!record) {
		const newRecord = {
			presentation: presentationId,
			slide: slideId
		} as Partial<ActivityPresentation>;
		options = {
			requestKey: `create-presentation-activity-${presentationId}-${slideId}`,
			...options
		};
		await pbCreateRecord<ActivityPresentation>(
			COLLECTION_NAMES.PresentationActivity,
			newRecord,
			options
		);
	}
};

export const subscribeToActivityRecord = async <T extends ActivityBasePB>(
	collectionName: string,
	activityId: string,
	callback: (data: RecordSubscription<T>) => void,
	options?: RecordOptions
): Promise<UnsubscribeFunc> => {
	options = {
		requestKey: `subscribe-${activityId}`,
		...options
	};
	return await pbSubscribeToRecord<T>(collectionName, activityId, callback, options);
};

// =============================
// === Activity Object Types ===
// =============================

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
