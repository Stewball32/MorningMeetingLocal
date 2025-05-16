export interface ClassProps {
	// ClassDaily {attendance: ClassProps}
	page: number;
	currentCheck?: 'weekday' | 'day' | 'month' | 'year';
	showYesterday?: boolean;
	weekdayGuesses?: Weekday[];
	monthGuesses?: Month[];
	dayGuesses?: number[];
	yearGuesses?: number[];
	dayOptDist?: number; // between 0 - 1
	calendarGuesses?: number[];
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

export type Check = 'weekday' | 'day' | 'month' | 'year';
export type Weekday =
	| 'Sunday'
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday';
export type Month =
	| 'January'
	| 'February'
	| 'March'
	| 'April'
	| 'May'
	| 'June'
	| 'July'
	| 'August'
	| 'September'
	| 'October'
	| 'November'
	| 'December';
