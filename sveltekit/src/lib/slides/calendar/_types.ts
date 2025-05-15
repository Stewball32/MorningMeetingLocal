export interface ClassProps {
	// ClassDaily {attendance: ClassProps}
	page: number;
	currentCheck?: 'weekday' | 'day' | 'month' | 'year';
	showYesterday?: boolean;
	yearGuesses?: string[];
	monthGuesses?: string[];
	dayGuesses?: string[];
	dayOptDist?: number; // between 0 - 1
	weekdayGuesses?: string[];
	calendarGuesses?: string[];
}

export interface PersonProps {
	yearGuess?: string;
	monthGuess?: string;
	monthdayGuess?: string;
	weekdayGuess?: string;
	calendarGuess?: string;
}

export interface StudentProps extends PersonProps {}

export interface TeacherProps extends PersonProps {}
