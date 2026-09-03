import { useState } from 'react';
import { IntroScreen } from '@/components/medispract/IntroScreen';
import { DemographicsScreen } from '@/components/medispract/DemographicsScreen';
import { SurveyScreen } from '@/components/medispract/SurveyScreen';
import { ResultsScreen } from '@/components/medispract/ResultsScreen';
import {
  EMPTY_ANSWERS,
  computeMeDisPractResult,
  isComplete,
  type MeDisPractAnswers,
} from '@/lib/medispract';
import {
  EMPTY_DEMOGRAPHICS,
  isDemographicsComplete,
  type DemographicInfo,
} from '@/lib/demographics';

type Stage = 'intro' | 'demographics' | 'survey' | 'results';

function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const [demographics, setDemographics] = useState<DemographicInfo>(
    EMPTY_DEMOGRAPHICS
  );
  const [answers, setAnswers] = useState<MeDisPractAnswers>(EMPTY_ANSWERS);

  const updateDemographics = (patch: Partial<DemographicInfo>) => {
    setDemographics((prev) => ({ ...prev, ...patch }));
  };

  const updateAnswers = (patch: Partial<MeDisPractAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  };

  const handleContinueToSurvey = () => {
    if (!isDemographicsComplete(demographics)) return;
    setStage('survey');
  };

  const handleSubmit = () => {
    if (!isComplete(answers)) return;
    setStage('results');
  };

  const handleRetake = () => {
    setDemographics(EMPTY_DEMOGRAPHICS);
    setAnswers(EMPTY_ANSWERS);
    setStage('intro');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12">
      {stage === 'intro' && (
        <IntroScreen onStart={() => setStage('demographics')} />
      )}
      {stage === 'demographics' && (
        <DemographicsScreen
          info={demographics}
          onChange={updateDemographics}
          onContinue={handleContinueToSurvey}
        />
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
          demographics={demographics}
          answers={answers}
          result={computeMeDisPractResult(answers)}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}

export default App;
