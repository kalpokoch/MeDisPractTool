import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { ScaleAnswer } from '@/lib/medispract';

const SCALE_OPTIONS: { value: ScaleAnswer; label: string }[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Often' },
  { value: 4, label: 'Always' },
];

interface ScaleQuestionProps {
  id: string;
  number: number;
  prompt: string;
  value: ScaleAnswer | null;
  onChange: (value: ScaleAnswer) => void;
}

export function ScaleQuestion({
  id,
  number,
  prompt,
  value,
  onChange,
}: ScaleQuestionProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="text-muted-foreground mr-2">{number}.</span>
        {prompt}
      </p>
      <RadioGroup
        value={value === null ? undefined : String(value)}
        onValueChange={(v) => onChange(Number(v) as ScaleAnswer)}
        className="grid grid-cols-2 sm:grid-cols-5 gap-2"
      >
        {SCALE_OPTIONS.map((opt) => (
          <div key={opt.value}>
            <RadioGroupItem
              value={String(opt.value)}
              id={`${id}-${opt.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`${id}-${opt.value}`}
              className="flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium text-center cursor-pointer transition-colors peer-data-checked:bg-primary peer-data-checked:text-primary-foreground peer-data-checked:border-primary hover:bg-muted"
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
