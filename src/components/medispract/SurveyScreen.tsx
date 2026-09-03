import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScaleQuestion } from './ScaleQuestion';
import { YesNoQuestion } from './YesNoQuestion';
import { DisposalMethodsQuestion } from './DisposalMethodsQuestion';
import {
  countAnswered,
  isComplete,
  TOTAL_QUESTIONS,
  type MeDisPractAnswers,
} from '@/lib/medispract';

interface SurveyScreenProps {
  answers: MeDisPractAnswers;
  onChange: (patch: Partial<MeDisPractAnswers>) => void;
  onSubmit: () => void;
}

export function SurveyScreen({ answers, onChange, onSubmit }: SurveyScreenProps) {
  const answered = countAnswered(answers);
  const progress = (answered / TOTAL_QUESTIONS) * 100;
  const complete = isComplete(answers);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-3 pt-1">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium">Your assessment</span>
          <span className="text-muted-foreground">
            {answered} / {TOTAL_QUESTIONS} answered
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Practice &amp; behaviour</CardTitle>
            <CardDescription>
              How you actually handle unused and expired medicines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScaleQuestion
              id="q1"
              number={1}
              prompt="Do you discard unused medicines of your home?"
              value={answers.q1}
              onChange={(v) => onChange({ q1: v })}
            />
            <Separator />
            <ScaleQuestion
              id="q2"
              number={2}
              prompt="Do you discard medicines when they change color, melt, or change taste?"
              value={answers.q2}
              onChange={(v) => onChange({ q2: v })}
            />
            <Separator />
            <ScaleQuestion
              id="q3"
              number={3}
              prompt="Do you discard expired medicines of your home?"
              value={answers.q3}
              onChange={(v) => onChange({ q3: v })}
            />
            <Separator />
            <ScaleQuestion
              id="q4"
              number={4}
              prompt="How often do you check the expiry date of medicines?"
              value={answers.q4}
              onChange={(v) => onChange({ q4: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q5"
              number={5}
              prompt="Do you have unused medications in your home?"
              value={answers.q5}
              onChange={(v) => onChange({ q5: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q6"
              number={6}
              prompt="Do you have any collection system for unused medicines in your locality?"
              value={answers.q6}
              onChange={(v) => onChange({ q6: v })}
            />
            <Separator />
            <DisposalMethodsQuestion
              number={7}
              selected={answers.q7Methods}
              otherMethods={answers.q7Other}
              onSelectedChange={(v) => onChange({ q7Methods: v })}
              onOtherMethodsChange={(v) => onChange({ q7Other: v })}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Knowledge</CardTitle>
            <CardDescription>
              Your awareness of the risks of improper disposal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <YesNoQuestion
              id="q8"
              number={8}
              prompt="Are you aware that proper disposal of medicines is important?"
              value={answers.q8}
              onChange={(v) => onChange({ q8: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q9"
              number={9}
              prompt="Are you aware that improper disposal of medicines can be a threat to the environment?"
              value={answers.q9}
              onChange={(v) => onChange({ q9: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q10"
              number={10}
              prompt="Are you aware that improper disposal of medicines can be a threat to your own health?"
              value={answers.q10}
              onChange={(v) => onChange({ q10: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q11"
              number={11}
              prompt="Do you know improper disposal of medicines can lead to superbugs (drug-resistant organisms)?"
              value={answers.q11}
              onChange={(v) => onChange({ q11: v })}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Readiness &amp; attitude</CardTitle>
            <CardDescription>
              How ready you are to change or improve your disposal habits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <YesNoQuestion
              id="q12"
              number={12}
              prompt="Do you set aside a separate place to dispose of your unused medicines at home?"
              value={answers.q12}
              onChange={(v) => onChange({ q12: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q13"
              number={13}
              prompt="Do you need more knowledge about proper disposal of left-over medicines?"
              value={answers.q13}
              onChange={(v) => onChange({ q13: v })}
            />
            <Separator />
            <YesNoQuestion
              id="q14"
              number={14}
              prompt="Are you ready to dispose of medicines properly if you are provided with a collection system?"
              value={answers.q14}
              onChange={(v) => onChange({ q14: v })}
            />
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex flex-col items-center gap-2 pb-10 pt-2">
        <Button size="lg" className="w-full max-w-xs" disabled={!complete} onClick={onSubmit}>
          See my MeDisPract Index
        </Button>
        {!complete && (
          <p className="text-xs text-muted-foreground">
            Answer all {TOTAL_QUESTIONS} questions to see your result.
          </p>
        )}
      </div>
    </div>
  );
}
