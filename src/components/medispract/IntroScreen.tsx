import { motion } from 'framer-motion';
import { ClipboardList, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface IntroScreenProps {
  onStart: () => void;
}

const POINTS = [
  {
    icon: ClipboardList,
    title: '14 quick questions',
    description: 'Covering your disposal practice, knowledge, and readiness.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidential',
    description: 'Your answers are only used to calculate your index.',
  },
  {
    icon: Sparkles,
    title: 'Instant result',
    description: 'Get your MeDisPract Index and category right away.',
  },
];

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-2xl sm:text-3xl">
            MeDisPract Index
          </CardTitle>
          <CardDescription className="text-base">
            Medication Disposal Practice Tool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            This tool measures how safely you dispose of unused and expired
            medicines, and reports a single MeDisPract Index across three
            domains: practice, knowledge, and readiness.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {POINTS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border p-4 text-center space-y-2"
              >
                <p.icon className="w-5 h-5 mx-auto text-primary" />
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full" onClick={onStart}>
            Start Assessment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
