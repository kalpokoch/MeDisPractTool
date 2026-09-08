import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Loader2, MapPin } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  MAX_AGE,
  MIN_AGE,
  formatDateDisplay,
  hasSettlement,
  isAgeValid,
  isDemographicsComplete,
  todayISO,
  type DemographicInfo,
} from '@/lib/demographics';
import { LocationError, detectStateAndDistrict } from '@/lib/geolocation';

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
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationFilled, setLocationFilled] = useState(false);

  // Keep the displayed date current if the form is left open past midnight.
  useEffect(() => {
    const sync = () => {
      const today = todayISO();
      if (today !== info.date) onChange({ date: today });
    };
    sync();
    const id = setInterval(sync, 60_000);
    return () => clearInterval(id);
  }, [info.date, onChange]);

  const handleDetectLocation = async () => {
    setLocating(true);
    setLocationError(null);
    try {
      const { state, district } = await detectStateAndDistrict();
      onChange({ state, district });
      setLocationFilled(true);
    } catch (err) {
      setLocationError(
        err instanceof LocationError
          ? err.message
          : 'Could not detect your location. Please enter it manually.'
      );
    } finally {
      setLocating(false);
    }
  };

  const complete = isDemographicsComplete(info);
  const ageEntered = info.age !== null;
  const ageInvalid = ageEntered && !isAgeValid(info.age);
  const settlementMissing =
    !hasSettlement(info) &&
    (info.slNo.trim() !== '' || info.householdNo.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            Household &amp; respondent details
          </CardTitle>
          <CardDescription>
            Please fill in these details before starting the assessment.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* 1. Date (auto) + 2. Sl. No. */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 h-9 text-sm">
                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{formatDateDisplay(info.date)}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  Recorded automatically
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slNo">Sl. No.</Label>
              <Input
                id="slNo"
                value={info.slNo}
                onChange={(e) => onChange({ slNo: e.target.value })}
                placeholder="e.g. 001"
              />
            </div>
          </div>

          <Separator />

          {/* 3. Location detection → State & District */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Location</Label>
              <p className="text-xs text-muted-foreground">
                Click below to insert your location.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDetectLocation}
              disabled={locating}
              className="w-full sm:w-auto"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {locating ? 'Detecting location…' : 'Use my current location'}
            </Button>

            {locationError && (
              <p className="text-xs text-destructive">{locationError}</p>
            )}
            {locationFilled && !locationError && (
              <p className="text-xs text-muted-foreground">
                Location detected. Please check the State and District below
                and correct them if needed.
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={info.state}
                  onChange={(e) => onChange({ state: e.target.value })}
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
            </div>
          </div>

          <Separator />

          {/* 4. Village / Town / City — at least one */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Village / Town / City</Label>
              <p className="text-xs text-muted-foreground">
                Fill in whichever one applies to this household.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={info.village}
                  onChange={(e) => onChange({ village: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="town">Town</Label>
                <Input
                  id="town"
                  value={info.town}
                  onChange={(e) => onChange({ town: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={info.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                />
              </div>
            </div>
            {settlementMissing && (
              <p className="text-xs text-destructive">
                Please fill in at least one of Village, Town, or City.
              </p>
            )}
          </div>

          <Separator />

          {/* 5. Household No. 6. Respondent's name + Age */}
          <div className="grid sm:grid-cols-2 gap-4">
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
                aria-invalid={ageInvalid}
              />
              {ageInvalid && (
                <p className="text-xs text-destructive">
                  Please enter an age between {MIN_AGE} and {MAX_AGE}.
                </p>
              )}
            </div>
          </div>

          {/* 7. Head of the family */}
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

        <CardFooter className="flex flex-col gap-2">
          <Button
            size="lg"
            className="w-full"
            disabled={!complete}
            onClick={onContinue}
          >
            Continue to assessment
          </Button>
          {!complete && (
            <p className="text-xs text-muted-foreground text-center">
              Fill in all details above to continue.
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
