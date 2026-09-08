// Demographic / household information collected before the MeDisPract
// assessment. Not part of the scoring model — purely respondent metadata.

export type YesNoField = 'yes' | 'no';

export interface DemographicInfo {
  /** ISO date (YYYY-MM-DD) captured automatically when the form is opened. */
  date: string;
  slNo: string;
  state: string;
  district: string;
  village: string;
  town: string;
  city: string;
  householdNo: string;
  respondentName: string;
  age: number | null;
  isHeadOfFamily: YesNoField | null;
}

/** Today's date as YYYY-MM-DD, in the device's local timezone. */
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Renders an ISO date as DD/MM/YYYY for display. */
export function formatDateDisplay(iso: string): string {
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

/**
 * A blank record. Built fresh on each call so the captured date is always
 * "today" rather than whenever the module happened to load.
 */
export function createEmptyDemographics(): DemographicInfo {
  return {
    date: todayISO(),
    slNo: '',
    state: '',
    district: '',
    village: '',
    town: '',
    city: '',
    householdNo: '',
    respondentName: '',
    age: null,
    isHeadOfFamily: null,
  };
}

const MIN_AGE = 1;
const MAX_AGE = 120;

export { MIN_AGE, MAX_AGE };

export function isAgeValid(age: number | null): boolean {
  return age !== null && age >= MIN_AGE && age <= MAX_AGE;
}

/**
 * A household sits in a village OR a town OR a city — at least one of the
 * three must be recorded, but not all three.
 */
export function hasSettlement(d: DemographicInfo): boolean {
  return (
    d.village.trim() !== '' || d.town.trim() !== '' || d.city.trim() !== ''
  );
}

export function isDemographicsComplete(d: DemographicInfo): boolean {
  return (
    d.date.trim() !== '' &&
    d.slNo.trim() !== '' &&
    d.state.trim() !== '' &&
    d.district.trim() !== '' &&
    hasSettlement(d) &&
    d.householdNo.trim() !== '' &&
    d.respondentName.trim() !== '' &&
    isAgeValid(d.age) &&
    d.isHeadOfFamily !== null
  );
}
