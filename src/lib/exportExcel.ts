import * as XLSX from 'xlsx';
import type { DemographicInfo } from '@/lib/demographics';
import {
  DISPOSAL_METHODS,
  type MeDisPractAnswers,
  type MeDisPractResult,
  type ScaleAnswer,
  type YesNo,
} from '@/lib/medispract';

const SCALE_LABELS: Record<ScaleAnswer, string> = {
  0: 'Never',
  1: 'Rarely',
  2: 'Sometimes',
  3: 'Often',
  4: 'Always',
};

const yesNoLabel = (v: YesNo | null) => (v === null ? '' : v === 'yes' ? 'Yes' : 'No');
const scaleLabel = (v: ScaleAnswer | null) => (v === null ? '' : SCALE_LABELS[v]);

const QUESTION_TEXT: Record<string, string> = {
  q1: 'Do you discard unused medicines of your home?',
  q2: 'Do you discard medicines when they change color, melt, or change taste?',
  q3: 'Do you discard expired medicines of your home?',
  q4: 'How often do you check the expiry date of medicines?',
  q5: 'Do you have unused medications in your home?',
  q6: 'Do you have any collection system for unused medicines in your locality?',
  q7: 'How do you dispose of your expired medications?',
  q8: 'Are you aware that proper disposal of medicines is important?',
  q9: 'Are you aware that improper disposal of medicines can be a threat to the environment?',
  q10: 'Are you aware that improper disposal of medicines can be a threat to your own health?',
  q11: 'Do you know improper disposal of medicines can lead to superbugs (drug-resistant organisms)?',
  q12: 'Do you set aside a separate place to dispose of your unused medicines at home?',
  q13: 'Do you need more knowledge about proper disposal of left-over medicines?',
  q14: 'Are you ready to dispose of medicines properly if you are provided with a collection system?',
};

function q7Label(a: MeDisPractAnswers): string {
  const fixed = a.q7Methods.map(
    (id) => DISPOSAL_METHODS.find((m) => m.id === id)?.label ?? id
  );
  const other = a.q7Other.map((m) => `${m.label}${m.safe ? ' (safe)' : ' (unsafe)'}`);
  return [...fixed, ...other].join(', ');
}

export function buildMeDisPractWorkbook(
  demographics: DemographicInfo,
  answers: MeDisPractAnswers,
  result: MeDisPractResult
): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const demoRows = [
    ['Field', 'Value'],
    ['Name of the village', demographics.village],
    ['Block', demographics.block],
    ['District', demographics.district],
    ['State', demographics.state],
    ['Household No.', demographics.householdNo],
    ["Respondent's name", demographics.respondentName],
    ['Head of family', demographics.isHeadOfFamily === 'yes' ? 'Yes' : 'No'],
    ['Age', demographics.age ?? ''],
  ];
  const demoSheet = XLSX.utils.aoa_to_sheet(demoRows);
  demoSheet['!cols'] = [{ wch: 22 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, demoSheet, 'Demographics');

  const assessmentRows: (string | number)[][] = [
    ['No.', 'Question', 'Response'],
    [1, QUESTION_TEXT.q1, scaleLabel(answers.q1)],
    [2, QUESTION_TEXT.q2, scaleLabel(answers.q2)],
    [3, QUESTION_TEXT.q3, scaleLabel(answers.q3)],
    [4, QUESTION_TEXT.q4, scaleLabel(answers.q4)],
    [5, QUESTION_TEXT.q5, yesNoLabel(answers.q5)],
    [6, QUESTION_TEXT.q6, yesNoLabel(answers.q6)],
    [7, QUESTION_TEXT.q7, q7Label(answers)],
    [8, QUESTION_TEXT.q8, yesNoLabel(answers.q8)],
    [9, QUESTION_TEXT.q9, yesNoLabel(answers.q9)],
    [10, QUESTION_TEXT.q10, yesNoLabel(answers.q10)],
    [11, QUESTION_TEXT.q11, yesNoLabel(answers.q11)],
    [12, QUESTION_TEXT.q12, yesNoLabel(answers.q12)],
    [13, QUESTION_TEXT.q13, yesNoLabel(answers.q13)],
    [14, QUESTION_TEXT.q14, yesNoLabel(answers.q14)],
  ];
  const assessmentSheet = XLSX.utils.aoa_to_sheet(assessmentRows);
  assessmentSheet['!cols'] = [{ wch: 5 }, { wch: 70 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, assessmentSheet, 'Assessment');

  const resultRows = [
    ['Domain', 'Raw score', 'Max', 'Scaled (0-100)'],
    [
      'Practice & behaviour (2x weight)',
      result.practice.raw,
      result.practice.max,
      Math.round(result.practice.scaled),
    ],
    [
      'Knowledge',
      result.knowledge.raw,
      result.knowledge.max,
      Math.round(result.knowledge.scaled),
    ],
    [
      'Readiness & attitude',
      result.readiness.raw,
      result.readiness.max,
      Math.round(result.readiness.scaled),
    ],
    [],
    ['MeDisPract Index', Math.round(result.index), '', ''],
    ['Category', result.category, '', ''],
  ];
  const resultSheet = XLSX.utils.aoa_to_sheet(resultRows);
  resultSheet['!cols'] = [{ wch: 34 }, { wch: 12 }, { wch: 8 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, resultSheet, 'Result');

  return wb;
}

function slug(value: string): string {
  return value.trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
}

export function downloadMeDisPractExcel(
  demographics: DemographicInfo,
  answers: MeDisPractAnswers,
  result: MeDisPractResult
): void {
  const wb = buildMeDisPractWorkbook(demographics, answers, result);
  const namePart = slug(demographics.respondentName) || 'respondent';
  const hhPart = slug(demographics.householdNo) || 'household';
  const filename = `MeDisPract_${namePart}_${hhPart}.xlsx`;
  XLSX.writeFile(wb, filename);
}
