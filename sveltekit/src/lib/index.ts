// place files you want to import through the `$lib` alias in this folder.

import type { Person } from './pb';

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

	const [year, month, day] = isoString.split('-').map(Number);
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
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const assertInstanceOf = <T>(x: unknown): asserts x is T => {
	if (!x) throw new Error('Assertion failed');
};

export const transformStringWithPerson = (
	str: string,
	person: Person
): string => {
	if (!str || !person) return str;

	// Replacements that are inserted exactly as-is
	const literalReplacements: Record<string, string> = {
		'{name}': person.name || '',
		'{Name}': person.name || ''
	};

	for (const [key, value] of Object.entries(literalReplacements)) {
		str = str.replace(new RegExp(key, 'g'), value);
	}

	// Replacements that need capitalization
	const pronouns = person.pronounTypes ?? {
		subject: 'they',
		object: 'them',
		dependentPossessive: 'their',
		independentPossessive: 'theirs'
	};
	const pronounReplacements: Record<string, string> = {
		pronoun: pronouns.subject || 'they',
		subject: pronouns.subject || 'they',
		object: pronouns.object || 'them',
		independent: pronouns.independentPossessive || 'their',
		dependent: pronouns.dependentPossessive || 'their'
	};

	for (const [key, value] of Object.entries(pronounReplacements)) {
		const lowerKey = `{${key}}`;
		const upperKey = `{${key.charAt(0).toUpperCase() + key.slice(1)}}`;
		const capitalized = value.charAt(0).toUpperCase() + value.slice(1);

		str = str.replace(new RegExp(lowerKey, 'g'), value);
		str = str.replace(new RegExp(upperKey, 'g'), capitalized);
	}

	return str;
};
