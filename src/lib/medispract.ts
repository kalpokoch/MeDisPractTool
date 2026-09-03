// MeDisPract Index — scoring model derived from
// "MeDisPract Tool- SCORING.docx" (Dr. Sandip Mukhopadhyay, ICMR-NIRBI).
//
// Domains:
//  - Practice / behaviour  (Q1-7, raw 0-32, weighted 2x in the index)
//  - Knowledge             (Q8-11, raw 0-4)
//  - Readiness / attitude  (Q12-14, raw 0-3)
//
// Each domain's raw score is linearly rescaled to 0-100, then combined as a
// weighted average (practice counted twice) into the final 0-100 index, and
// categorized by quartile.

export type ScaleAnswer = 0 | 1 | 2 | 3 | 4; // Never..Always
export type YesNo = 'yes' | 'no';

export const DISPOSAL_METHODS = [
  { id: 'throw_anywhere', label: 'Throw-out anywhere', safe: false },
  { id: 'flush', label: 'Flush down into toilet or sink', safe: false },
  { id: 'home_trash', label: 'Home trash can', safe: false },
  { id: 'landfill', label: 'Landfill', safe: false },
  { id: 'return_pharmacy', label: 'Return to Pharmacy', safe: true },
  { id: 'incineration', label: 'Incineration', safe: true },
] as const;

export type DisposalMethodId = (typeof DISPOSAL_METHODS)[number]['id'];

export interface OtherDisposalMethod {
  label: string;
  safe: boolean;
}

export interface MeDisPractAnswers {
  // Practice / behaviour
  q1: ScaleAnswer | null; // discard unused medicines
  q2: ScaleAnswer | null; // discard when color/taste/texture changes
  q3: ScaleAnswer | null; // discard expired medicines
  q4: ScaleAnswer | null; // frequency of checking expiry date
  q5: YesNo | null; // has unused medications at home
  q6: YesNo | null; // has a collection system in locality
  q7Methods: DisposalMethodId[]; // selected fixed disposal methods
  q7Other: OtherDisposalMethod[]; // free-text "Other" methods

  // Knowledge
  q8: YesNo | null; // aware proper disposal matters
  q9: YesNo | null; // aware improper disposal threatens environment
  q10: YesNo | null; // aware improper disposal threatens own health
  q11: YesNo | null; // aware of superbug / AMR risk

  // Readiness / attitude
  q12: YesNo | null; // separates a place to dispose unused meds
  q13: YesNo | null; // wants more knowledge on proper disposal
  q14: YesNo | null; // ready to dispose properly if given a collection system
}

export const EMPTY_ANSWERS: MeDisPractAnswers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
  q6: null,
  q7Methods: [],
  q7Other: [],
  q8: null,
  q9: null,
  q10: null,
  q11: null,
  q12: null,
  q13: null,
  q14: null,
};

export type MeDisPractCategory = 'Very Poor' | 'Poor' | 'Fair' | 'Good';

export interface DomainScore {
  raw: number;
  max: number;
  scaled: number; // 0-100
}

export interface MeDisPractResult {
  practice: DomainScore;
  knowledge: DomainScore;
  readiness: DomainScore;
  index: number; // 0-100, weighted average (practice x2)
  category: MeDisPractCategory;
}

const scaleScore = (v: ScaleAnswer | null) => v ?? 0;
const yesNoScore = (v: YesNo | null, yesPoints: number) =>
  v === 'yes' ? yesPoints : 0;
const awarenessScore = (v: YesNo | null) => (v === 'yes' ? 1 : 0);

function practiceRaw(a: MeDisPractAnswers): number {
  const q1to4 =
    scaleScore(a.q1) + scaleScore(a.q2) + scaleScore(a.q3) + scaleScore(a.q4); // 0-16
  const q5 = yesNoScore(a.q5, a.q5 === 'no' ? 4 : 0); // No = safer = 4
  const q6 = yesNoScore(a.q6, a.q6 === 'yes' ? 4 : 0); // Yes = safer = 4
  const fixedSafe = a.q7Methods.filter(
    (id) => DISPOSAL_METHODS.find((m) => m.id === id)?.safe
  ).length;
  const otherSafe = a.q7Other.filter((m) => m.safe).length;
  const q7 = fixedSafe + otherSafe; // 0-8 (per instrument's stated range)
  return q1to4 + q5 + q6 + q7;
}

function knowledgeRaw(a: MeDisPractAnswers): number {
  return (
    awarenessScore(a.q8) +
    awarenessScore(a.q9) +
    awarenessScore(a.q10) +
    awarenessScore(a.q11)
  );
}

function readinessRaw(a: MeDisPractAnswers): number {
  return (
    awarenessScore(a.q12) + awarenessScore(a.q13) + awarenessScore(a.q14)
  );
}

function categorize(index: number): MeDisPractCategory {
  if (index <= 25) return 'Very Poor';
  if (index <= 50) return 'Poor';
  if (index <= 75) return 'Fair';
  return 'Good';
}

export function computeMeDisPractResult(
  answers: MeDisPractAnswers
): MeDisPractResult {
  const practice: DomainScore = (() => {
    const raw = practiceRaw(answers);
    const max = 32;
    return { raw, max, scaled: (raw / max) * 100 };
  })();

  const knowledge: DomainScore = (() => {
    const raw = knowledgeRaw(answers);
    const max = 4;
    return { raw, max, scaled: (raw / max) * 100 };
  })();

  const readiness: DomainScore = (() => {
    const raw = readinessRaw(answers);
    const max = 3;
    return { raw, max, scaled: (raw / max) * 100 };
  })();

  // Practice carries double weight in the combined index.
  const index =
    (practice.scaled * 2 + knowledge.scaled + readiness.scaled) / 4;

  return {
    practice,
    knowledge,
    readiness,
    index,
    category: categorize(index),
  };
}

export const TOTAL_QUESTIONS = 14;

export function countAnswered(a: MeDisPractAnswers): number {
  let n = 0;
  if (a.q1 !== null) n++;
  if (a.q2 !== null) n++;
  if (a.q3 !== null) n++;
  if (a.q4 !== null) n++;
  if (a.q5 !== null) n++;
  if (a.q6 !== null) n++;
  if (a.q7Methods.length > 0 || a.q7Other.length > 0) n++;
  if (a.q8 !== null) n++;
  if (a.q9 !== null) n++;
  if (a.q10 !== null) n++;
  if (a.q11 !== null) n++;
  if (a.q12 !== null) n++;
  if (a.q13 !== null) n++;
  if (a.q14 !== null) n++;
  return n;
}

export function isComplete(a: MeDisPractAnswers): boolean {
  return countAnswered(a) === TOTAL_QUESTIONS;
}
