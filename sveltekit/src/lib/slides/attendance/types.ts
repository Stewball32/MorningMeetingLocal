export interface SlideConfig {
	welcomeTitle?: string;
	welcomeSubtitle?: string;
	welcomeParagraph?: string;
	roster?: ('teachers' | 'students' | 'guests')[];
	question?: string;
	hereOption?: string;
	absentOption?: string;
	isHereString?: string;
	isAbsentString?: string;
}

export interface ClassActivityData {
	currentPersonId: string; // ID of the current person
	hereIds: string[]; // IDs of persons who are present
	absentIds: string[]; // IDs of persons who are absent
}

export interface PersonActivityData {
	hereVotes: string[]; // Answers to questions or activities
	absentVotes: string[]; // Answers to questions or activities
}
