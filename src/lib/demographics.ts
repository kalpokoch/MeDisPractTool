// Demographic / household information collected before the MeDisPract
// assessment. Not part of the scoring model — purely respondent metadata.

export type YesNoField = 'yes' | 'no';

export interface DemographicInfo {
  village: string;
  block: string;
  district: string;
  state: string;
  householdNo: string;
  respondentName: string;
  isHeadOfFamily: YesNoField | null;
  age: number | null;
}

export const EMPTY_DEMOGRAPHICS: DemographicInfo = {
  village: '',
  block: '',
  district: '',
  state: '',
  householdNo: '',
  respondentName: '',
  isHeadOfFamily: null,
  age: null,
};

const MIN_AGE = 1;
const MAX_AGE = 120;

export { MIN_AGE, MAX_AGE };

export function isDemographicsComplete(d: DemographicInfo): boolean {
  return (
    d.village.trim() !== '' &&
    d.block.trim() !== '' &&
    d.district.trim() !== '' &&
    d.state.trim() !== '' &&
    d.householdNo.trim() !== '' &&
    d.respondentName.trim() !== '' &&
    d.isHeadOfFamily !== null &&
    d.age !== null &&
    d.age >= MIN_AGE &&
    d.age <= MAX_AGE
  );
}
