export interface ClassProps {
	page: number;
	currentPerson?: string; // student or teacher ID
	studentMath?: MathClassProps;
	peopleMath?: MathClassProps;
	hasGuests?: boolean;
	welcomeGuests?: boolean;
}

export interface MathClassProps {
	showHintOne?: boolean;
	showHintTwo?: boolean;
	showHintResult?: boolean;
	oneOptDist?: number; // between 0 - 1
	twoOptDist?: number; // between 0 - 1
	resultOptDist?: number; // between 0 - 1
	oneGuesses?: number[];
	twoGuesses?: number[];
	resultGuesses?: number[];
}

type HereGuess = 'present' | 'absent' | '';
export interface PersonProps {
	hereGuess?: {
		[key: string]: HereGuess;
	};
}

export interface MathPersonProps {
	oneGuess?: number;
	twoGuess?: number;
	resultGuess?: number;
}

export interface StudentProps extends PersonProps {}

export interface TeacherProps extends PersonProps {}
