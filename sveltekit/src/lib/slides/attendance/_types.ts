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
	oneOptions?: string[];
	twoOptions?: string[];
	resultOptions?: string[];
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
	oneOptions?: string[];
	twoOptions?: string[];
	resultOptions?: string[];
}

export interface StudentProps extends PersonProps {}

export interface TeacherProps extends PersonProps {}
