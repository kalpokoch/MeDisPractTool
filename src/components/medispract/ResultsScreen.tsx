import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CloudUpload, Loader2, RotateCcw, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type {
  MeDisPractAnswers,
  MeDisPractCategory,
  MeDisPractResult,
} from '@/lib/medispract';
import type { DemographicInfo } from '@/lib/demographics';
import { downloadMeDisPractExcel } from '@/lib/exportExcel';
import { ApiError, submitToDatabase } from '@/lib/api';

interface ResultsScreenProps {
  demographics: DemographicInfo;
  answers: MeDisPractAnswers;
  result: MeDisPractResult;
  onRetake: () => void;
}

const CATEGORY_STYLES: Record<
  MeDisPractCategory,
  { badge: string; ring: string; text: string }
> = {
  'Very Poor': {
    badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    ring: 'stroke-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
  Poor: {
    badge:
      'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    ring: 'stroke-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
  },
  Fair: {
    badge:
      'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    ring: 'stroke-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  Good: {
    badge:
      'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    ring: 'stroke-green-500',
    text: 'text-green-600 dark:text-green-400',
  },
};

const INTERPRETATION: Record<MeDisPractCategory, string> = {
  'Very Poor':
    'Unsafe medication disposal behaviour predominates. There is significant room to improve how unused and expired medicines are handled.',
  Poor: 'Unsafe medication disposal behaviour predominates, with some awareness or readiness to change.',
  Fair: 'Moderate medication disposal behaviour — some safe practices are in place, but there is still room to improve.',
  Good: 'Safe medication disposal behaviour predominates. Keep up the good practice.',
};

function DomainBar({
  label,
  scaled,
  raw,
  max,
}: {
  label: string;
  scaled: number;
  raw: number;
  max: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {raw}/{max} · {Math.round(scaled)}%
        </span>
      </div>
      <Progress value={scaled} />
    </div>
  );
}

export function ResultsScreen({
  demographics,
  answers,
  result,
  onRetake,
}: ResultsScreenProps) {
  const styles = CATEGORY_STYLES[result.category];
  const roundedIndex = Math.round(result.index);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - roundedIndex / 100);

  const handleDownload = () => {
    downloadMeDisPractExcel(demographics, answers, result);
  };

  const [submitState, setSubmitState] = useState<
    'idle' | 'submitting' | 'submitted' | 'error'
  >('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitToDatabase = async () => {
    setSubmitState('submitting');
    setSubmitError(null);
    try {
      await submitToDatabase(demographics, answers);
      setSubmitState('submitted');
    } catch (err) {
      setSubmitState('error');
      setSubmitError(
        err instanceof ApiError ? err.message : 'Something went wrong.'
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl">Your MeDisPract Index</CardTitle>
          <CardDescription>
            Based on your practice, knowledge, and readiness responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth="10"
                  className="fill-none stroke-muted"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className={cn('fill-none', styles.ring)}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold">{roundedIndex}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn('px-3 py-1 text-sm', styles.badge)}
            >
              {result.category}
            </Badge>
            <p className={cn('text-sm text-center max-w-sm', styles.text)}>
              {INTERPRETATION[result.category]}
            </p>
          </div>

          <div className="space-y-4">
            <DomainBar
              label="Practice & behaviour (2x weight)"
              scaled={result.practice.scaled}
              raw={result.practice.raw}
              max={result.practice.max}
            />
            <DomainBar
              label="Knowledge"
              scaled={result.knowledge.scaled}
              raw={result.knowledge.raw}
              max={result.knowledge.max}
            />
            <DomainBar
              label="Readiness & attitude"
              scaled={result.readiness.scaled}
              raw={result.readiness.raw}
              max={result.readiness.max}
            />
          </div>
        </CardContent>
        {submitState === 'error' && submitError && (
          <p className="text-xs text-destructive text-center px-6">
            {submitError}
          </p>
        )}
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="w-full sm:flex-1"
            onClick={onRetake}
          >
            <RotateCcw className="w-4 h-4" />
            Retake assessment
          </Button>
          <Button className="w-full sm:flex-1" onClick={handleDownload}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button
            variant="outline"
            className="w-full sm:flex-1"
            onClick={handleSubmitToDatabase}
            disabled={submitState === 'submitting' || submitState === 'submitted'}
          >
            {submitState === 'submitting' && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {submitState === 'submitted' && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
            {(submitState === 'idle' || submitState === 'error') && (
              <CloudUpload className="w-4 h-4" />
            )}
            {submitState === 'submitted'
              ? 'Submitted'
              : submitState === 'submitting'
                ? 'Submitting…'
                : 'Submit to database'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
