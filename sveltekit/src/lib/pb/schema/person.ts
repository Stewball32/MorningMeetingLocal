import type { RecordModel } from 'pocketbase';
import { COLLECTION_NAMES } from '../constants';

export interface PersonPB extends RecordModel {
	collectionName: typeof COLLECTION_NAMES.People;
	avatar?: string; // Avatar filename
	name: string;
	role: 'teacher' | 'student'; // Role of the person (only for guests)
	title?: string; // Title of the person (only for teachers)
	pronoun?: 'he' | 'she'; // assume they if not set
	emotions?: string[]; // EmotionPB.id[]
	config?: PersonConfig; // Additional configuration for the person
	data?: PersonData; // Additional data for the person
}

export interface PersonConfig extends Record<string, any> {
	poll: {
		num?: PersonQuestionNumber;
		str?: PersonQuestionString;
	};
	quiz: {
		num?: PersonQuestionNumber;
		str?: PersonQuestionString;
	};
	rating: PersonRating;
}

export interface PersonRating {
	type: 'smileys' | 'thumbs' | 'yesno' | 'scale';
	options?: number;
}

export interface PersonQuestionNumber {
	type: 'multi' | 'numpad';
	options?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export interface PersonQuestionString {
	type: 'multi' | 'abc' | 'qwerty';
	options?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export interface PersonData extends Record<string, any> {
	lastDay: string;
}
