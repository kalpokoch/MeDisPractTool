import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { YesNo } from '@/lib/medispract';

interface YesNoQuestionProps {
  id: string;
  number: number;
  prompt: string;
  value: YesNo | null;
  onChange: (value: YesNo) => void;
}

export function YesNoQuestion({
  id,
  number,
  prompt,
  value,
  onChange,
}: YesNoQuestionProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="text-muted-foreground mr-2">{number}.</span>
        {prompt}
      </p>
      <RadioGroup
        value={value ?? undefined}
        onValueChange={(v) => onChange(v as YesNo)}
        className="grid grid-cols-2 gap-2 max-w-xs"
      >
        {(['yes', 'no'] as const).map((opt) => (
          <div key={opt}>
            <RadioGroupItem value={opt} id={`${id}-${opt}`} className="peer sr-only" />
            <Label
              htmlFor={`${id}-${opt}`}
              className="flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium capitalize cursor-pointer transition-colors peer-data-checked:bg-primary peer-data-checked:text-primary-foreground peer-data-checked:border-primary hover:bg-muted"
            >
              {opt}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
