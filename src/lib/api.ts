import type { DemographicInfo } from '@/lib/demographics';
import type { MeDisPractAnswers } from '@/lib/medispract';

const API_BASE = '/api';

export class ApiError extends Error {}

export async function submitToDatabase(
  demographics: DemographicInfo,
  answers: MeDisPractAnswers
): Promise<{ id: string }> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demographics, answers }),
    });
  } catch {
    throw new ApiError(
      'Could not reach the server. Check your internet connection and try again.'
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      (body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : null) ?? 'Could not save the submission. Please try again.'
    );
  }

  return response.json();
}
