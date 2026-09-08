import type { Handler } from '@netlify/functions';
import { getDb } from './_db';
import {
  computeMeDisPractResult,
  isComplete,
  type MeDisPractAnswers,
} from '../../src/lib/medispract';
import {
  isDemographicsComplete,
  type DemographicInfo,
} from '../../src/lib/demographics';

const COLLECTION = 'submissions';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'POST') {
      return await createSubmission(event.body);
    }
    // Listing/browsing submissions is intentionally not exposed yet — this
    // is confidential household survey data and needs real access control
    // (e.g. Netlify Identity) before any read endpoint goes in.
    return json(405, { error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'Internal server error' });
  }
};

async function createSubmission(rawBody: string | null) {
  if (!rawBody) return json(400, { error: 'Missing request body' });

  let payload: {
    demographics?: DemographicInfo;
    answers?: MeDisPractAnswers;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { demographics, answers } = payload;
  if (!demographics || !answers) {
    return json(400, { error: 'demographics and answers are required' });
  }

  // Never trust a client-computed score for research data — recompute here
  // from the raw answers so every stored record is consistent and can't be
  // tampered with in transit.
  if (!isDemographicsComplete(demographics)) {
    return json(400, { error: 'Demographic details are incomplete' });
  }
  if (!isComplete(answers)) {
    return json(400, { error: 'Assessment answers are incomplete' });
  }

  const result = computeMeDisPractResult(answers);

  const db = await getDb();
  const doc = {
    demographics,
    answers,
    result,
    submittedAt: new Date().toISOString(),
  };

  const { insertedId } = await db.collection(COLLECTION).insertOne(doc);

  return json(201, { id: insertedId.toString() });
}
