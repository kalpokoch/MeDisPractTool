import { useState } from 'react';
import { IntroScreen } from '@/components/medispract/IntroScreen';
import { SurveyScreen } from '@/components/medispract/SurveyScreen';
import { ResultsScreen } from '@/components/medispract/ResultsScreen';
import {
  EMPTY_ANSWERS,
  computeMeDisPractResult,
  isComplete,
  type MeDisPractAnswers,
} from '@/lib/medispract';

type Stage = 'intro' | 'survey' | 'results';

function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<MeDisPractAnswers>(EMPTY_ANSWERS);

  const updateAnswers = (patch: Partial<MeDisPractAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = () => {
    if (!isComplete(answers)) return;
    setStage('results');
  };

  const handleRetake = () => {
    setAnswers(EMPTY_ANSWERS);
    setStage('intro');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12">
      {stage === 'intro' && (
        <IntroScreen onStart={() => setStage('survey')} />
      )}
      {stage === 'survey' && (
        <SurveyScreen
          answers={answers}
          onChange={updateAnswers}
          onSubmit={handleSubmit}
        />
      )}
      {stage === 'results' && (
        <ResultsScreen
          result={computeMeDisPractResult(answers)}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}

export default App;
