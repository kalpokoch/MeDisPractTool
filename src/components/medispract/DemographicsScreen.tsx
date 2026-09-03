import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  MAX_AGE,
  MIN_AGE,
  isDemographicsComplete,
  type DemographicInfo,
} from '@/lib/demographics';

interface DemographicsScreenProps {
  info: DemographicInfo;
  onChange: (patch: Partial<DemographicInfo>) => void;
  onContinue: () => void;
}

export function DemographicsScreen({
  info,
  onChange,
  onContinue,
}: DemographicsScreenProps) {
  const complete = isDemographicsComplete(info);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Household &amp; respondent details</CardTitle>
          <CardDescription>
            Please fill in these details before starting the assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="village">Name of the village</Label>
              <Input
                id="village"
                value={info.village}
                onChange={(e) => onChange({ village: e.target.value })}
                placeholder="e.g. Rampur"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="block">Block</Label>
              <Input
                id="block"
                value={info.block}
                onChange={(e) => onChange({ block: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={info.district}
                onChange={(e) => onChange({ district: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={info.state}
                onChange={(e) => onChange({ state: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="householdNo">Household No.</Label>
              <Input
                id="householdNo"
                value={info.householdNo}
                onChange={(e) => onChange({ householdNo: e.target.value })}
                placeholder="e.g. HH-014"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="respondentName">Respondent's name</Label>
              <Input
                id="respondentName"
                value={info.respondentName}
                onChange={(e) => onChange({ respondentName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={MIN_AGE}
                max={MAX_AGE}
                value={info.age ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  onChange({ age: v === '' ? null : Number(v) });
                }}
                placeholder={`${MIN_AGE}-${MAX_AGE}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Are you the head of the family?</Label>
            <RadioGroup
              value={info.isHeadOfFamily ?? undefined}
              onValueChange={(v) =>
                onChange({ isHeadOfFamily: v as 'yes' | 'no' })
              }
              className="grid grid-cols-2 gap-2 max-w-xs"
            >
              {(['yes', 'no'] as const).map((opt) => (
                <div key={opt}>
                  <RadioGroupItem
                    value={opt}
                    id={`head-${opt}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`head-${opt}`}
                    className="flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium capitalize cursor-pointer transition-colors peer-data-checked:bg-primary peer-data-checked:text-primary-foreground peer-data-checked:border-primary hover:bg-muted"
                  >
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full"
            disabled={!complete}
            onClick={onContinue}
          >
            Continue to assessment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
