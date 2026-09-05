import { motion } from 'framer-motion';
import { ArrowLeft, Code2, FileLock2, Microscope } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AboutScreenProps {
  onBack: () => void;
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h3>
      </div>
      <div className="space-y-1 pl-6">{children}</div>
    </section>
  );
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-4"
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">About this tool</CardTitle>
          <CardDescription>
            Credits, authorship, and terms of use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section icon={Microscope} label="The instrument">
            <p className="text-sm font-medium">
              MeDisPract Tool — Medication Disposal Practice Tool
            </p>
            <p className="text-sm text-muted-foreground">
              Developed by{' '}
              <span className="text-foreground font-medium">
                Dr. Sandip Mukhopadhyay
              </span>
              , MBBS, MD, NFPM, FAIMER Fellow — Principal Investigator
            </p>
            <p className="text-sm text-muted-foreground">
              Nodal Officer, MRHRU-Darjeeling &amp; Scientist E,
              ICMR-National Institute for Research in Bacterial Infections,
              Kolkata-700 010
            </p>
            <p className="text-sm text-muted-foreground">
              Contact:{' '}
              <a
                href="mailto:sandipcmcl@gmail.com"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                sandipcmcl@gmail.com
              </a>
            </p>
          </Section>

          <Separator />

          <Section icon={Code2} label="The application">
            <p className="text-sm text-muted-foreground">
              Designed and developed by{' '}
              <span className="text-foreground font-medium">
                Kalpojyoti Koch
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Computer Science graduate, Amity
            </p>
            <p className="text-sm text-muted-foreground">
              <a
                href="https://kalpo.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                kalpo.netlify.app
              </a>
            </p>
          </Section>

          <Separator />

          <Section icon={FileLock2} label="Copyright &amp; use">
            <p className="text-sm text-muted-foreground">
              The whole tool is applied together; no part should be applied
              separately.
            </p>
            <p className="text-sm text-muted-foreground">
              The tool is copyright protected and should not be used without
              prior permission.
            </p>
          </Section>
        </CardContent>
      </Card>
    </motion.div>
  );
}
