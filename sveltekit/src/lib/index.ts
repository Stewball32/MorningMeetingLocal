// place files you want to import through the `$lib` alias in this folder.

import type { Student, Teacher } from "./pb/types";


export const makeSearchParams = (obj: Record<string, string | number | (string | number)[] | null | undefined>): URLSearchParams => {
	const entries: [string, string][] = [];

	for (const [key, value] of Object.entries(obj)) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			for (const v of value) {
				entries.push([key, String(v)]);
			}
		} else {
			entries.push([key, String(value)]);
		}
	}

	return new URLSearchParams(entries);
}


/**
 * Checks if a ISO string is in the format YYYY-MM-DD.
 * @param isoString - The ISO string to validate.
 * @returns 
 */
export const isISOString = (isoString: string): boolean => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
		console.error(`Invalid ISO format: ${isoString} (expected YYYY-MM-DD)`);
		return false;
	}

	const [year, month, day] = isoString.split("-").map(Number);
	const testDate = new Date(`${isoString}T00:00:00Z`);

	const isValid =
		testDate.getUTCFullYear() === year &&
		testDate.getUTCMonth() + 1 === month &&
		testDate.getUTCDate() === day;

	if (!isValid) {
		console.warn(`Invalid ISO date: ${isoString}`);
	}

	return isValid;
};


/**
 * @returns The current date in YYYY-MM-DD format.
 */
export const getCurrentISOString = () => {
	const date = new Date()
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}


/**
 * Returns a full set of pronouns based on the input. Undefined input defaults to "they".
 * 
 * @param input - A string or Student/Teacher object.
 * @returns  - a pronoun object.
 */
export const getAllPronouns = (input?: string | Student | Teacher) => {
	const pronoun = typeof input === "string" ? input : input?.pronoun || "they";
	switch (pronoun) {
		case "he":
			return {
				subject: "He",
				object: "Him",
				possessive: "His",
				reflexive: "Himself",
				present: "is",
				past: "was"
			};
		case "she":
			return {
				subject: "She",
				object: "Her",
				possessive: "Her",
				reflexive: "Herself",
				present: "is",
				past: "was"
			};
		default:
			return {
				subject: "They",
				object: "Them",
				possessive: "Their",
				reflexive: "Themselves",
				present: "are",
				past: "were"
			};
	}	
}

/**
 * Returns the subject pronoun (e.g. "him", "her", "them") based on input.
 * 
 * @param input - A string or Student/Teacher object.
 * @returns The subject pronoun.
 */
export const getPronounSubject = (input?: string | Student | Teacher) => {
	const pronouns = getAllPronouns(input);
	return pronouns.subject;
}

/**
 * Returns the object pronoun (e.g. "his", "her", "them") based on input.
 * 
 * @param input - A string or Student/Teacher object.
 * @returns The object pronoun.
 */
export const getPronounObject = (input?: string | Student | Teacher) => {
	const pronouns = getAllPronouns(input);
	return pronouns.object;
}

/**
 * Returns the possessive pronoun (e.g. "his", "her", "their") based on input.
 * 
 * @param input - A string or Student/Teacher object.
 * @returns The possessive pronoun.
 */
export const getPronounPossessive = (input?: string | Student | Teacher) => {
	const pronouns = getAllPronouns(input);
	return pronouns.possessive;
}

/**
 * Returns the reflexive pronoun (e.g. "himself", "herself", "themselves") based on input.
 * 
 * @param input - A string or Student/Teacher object.
 * @returns The reflexive pronoun.
 */
export const getPronounReflexive = (input?: string | Student | Teacher) => {
	const pronouns = getAllPronouns(input);
	return pronouns.reflexive;
}

/**
 * Returns the present tense form of the verb "to be" based on input.
 * 
 * @param input - A string or Student/Teacher object.
 * @returns The present tense form of "to be".
 */
export const getPronounPresent = (input?: string | Student | Teacher) => {
	const pronouns = getAllPronouns(input);
	return pronouns.present;
}

/**
 * Returns the past tense form of the verb "to be" based on input.
 * 
 * @param input - A string or Student/Teacher object.
 * @returns The past tense form of "to be".
 */
export const getPronounPast = (input?: string | Student | Teacher) => {
	const pronouns = getAllPronouns(input);
	return pronouns.past;
}

// Easier formatting for slideStyle (below)
const slideStyleArray = [
	"relative",
	"aspect-[15/9]",
	"max-w-full",
	"rounded-r-[1rem]",
	"overflow-hidden",
	// Mobile
	"w-[294px]",
	"ml-6",
	"mr-1",
	"mt-[1.5px]",
	"rounded-r-[10px]",
	// Small
	"sm:w-[590px]",
	"sm:ml-12",
	"sm:mr-1",
	"mt-[1.5px]",
	"sm:rounded-r-[1.4rem]",
	// Medium
	"md:w-[710px]",
	"md:ml-14",
	"md:mr-1",
	"md:mt-[1.5px]",
	"md:rounded-r-[1.6rem]",
	// Large
	"lg:w-[944px]",
	"lg:ml-19",
	"lg:mr-0",
	"lg:mt-[1.7px]",
	"lg:rounded-r-[2rem]",
	// Extra Large
	"xl:w-[1178px]",
	"xl:ml-24",
	"xl:mr-2",
	"xl:mt-1",
	"xl:rounded-r-[2.4rem]",
	// 2 Extra Large
	"2xl:w-[1400px]",
	"2xl:ml-28",
	"2xl:mr-2",
	"2xl:mt-1",
	"2xl:rounded-r-[3rem]",
	
]

/**
 * Styling meant for each slide that needs to be 
 * displayed on the "lined paper" background.
 */
export const slideStyle = " " + slideStyleArray.join(" ") + " "

