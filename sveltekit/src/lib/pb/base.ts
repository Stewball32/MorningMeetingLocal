import type { RecordModel, RecordSubscription, UnsubscribeFunc } from 'pocketbase';
import { pbDeleteRecord, pbSubscribeToRecord, pbUpdateRecord } from './core';

export abstract class BaseObject<T extends RecordModel> {
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
		this.loadNewRecord(updatedRecord);
		return !!updatedRecord;
	}

	async deleteRecord(): Promise<boolean> {
		return await pbDeleteRecord(this.collectionId, this.id);
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
