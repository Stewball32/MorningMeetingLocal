export interface MathPageProps {
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

export interface ClassProps {
	// ClassDaily {attendance: ClassProps}
	page: number;
	currentPerson?: string; // student or teacher ID
	studentMath?: MathPageProps;
	peopleMath?: MathPageProps;
	hasGuests?: boolean;
	welcomeGuests?: boolean;
}

type HereGuess = 'present' | 'absent' | '';
export interface PersonProps {
	hereGuesses?: {
		[key: string]: HereGuess[];
	};
}

export interface StudentProps extends PersonProps {}

export interface TeacherProps extends PersonProps {}
