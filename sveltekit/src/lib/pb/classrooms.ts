import type { RecordListOptions } from 'pocketbase';
import { BaseObject } from './base';
import { COLLECTION_NAMES } from './constants';
import { pbCreate, pbGetFirst, pbGetList, pbGetOne } from './core';
import type { ClassroomPB } from './schema';

// ==================================
// === Classroom Record Functions ===
// ==================================

export const getAllClassroomRecords = async (
	options?: RecordListOptions
): Promise<ClassroomPB[]> => {
	options = {
		requestKey: `get-all-classrooms`,
		...options
	};
	const result = await pbGetList<ClassroomPB>(COLLECTION_NAMES.Classrooms, options);
	return result ? result.items : [];
};

export const getClassroomRecordById = async (
	id: string,
	options?: RecordListOptions
): Promise<ClassroomPB | null> => {
	options = {
		requestKey: `get-classroom-${id}`,
		...options
	};
	return await pbGetOne<ClassroomPB>(COLLECTION_NAMES.Classrooms, id, options);
};

export const getClassroomRecordByName = async (
	name: string,
	options?: RecordListOptions
): Promise<ClassroomPB | null> => {
	const filter: string = `name="${name}"`;
	options = {
		requestKey: `class-by-name-${name}`
	};
	return await pbGetFirst<ClassroomPB>(COLLECTION_NAMES.Classrooms, filter, options);
};

export const createClassroomRecord = async (
	data: Partial<ClassroomPB>,
	options?: RecordListOptions
): Promise<ClassroomPB> => {
	const payload: Partial<ClassroomPB> = {
		people: [],
		guests: [],
		...data
	};
	const newRecord = await pbCreate<ClassroomPB>(COLLECTION_NAMES.Classrooms, payload, options);
	if (!newRecord) throw Error('Failed to create Record');
	return newRecord;
};

// ========================
// === Classroom Object ===
// ========================

export class Classroom extends BaseObject<ClassroomPB> {
	constructor(public record: ClassroomPB) {
		super(record);
	}
	get name() {
		return this.record.name;
	}
	get peopleIds() {
		return this.record.people || [];
	}
	get guestIds() {
		return this.record.guests || [];
	}

	get config() {
		return this.record.config || {};
	}

	async setMembers(peopleIds: string[], guestIds: string[]): Promise<boolean> {
		return this.updateRecord({ people: peopleIds, guests: guestIds } as Partial<ClassroomPB>);
	}
}
