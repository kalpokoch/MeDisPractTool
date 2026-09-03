import { useState } from 'react';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DISPOSAL_METHODS,
  type DisposalMethodId,
  type OtherDisposalMethod,
} from '@/lib/medispract';

interface DisposalMethodsQuestionProps {
  number: number;
  selected: DisposalMethodId[];
  otherMethods: OtherDisposalMethod[];
  onSelectedChange: (selected: DisposalMethodId[]) => void;
  onOtherMethodsChange: (methods: OtherDisposalMethod[]) => void;
}

export function DisposalMethodsQuestion({
  number,
  selected,
  otherMethods,
  onSelectedChange,
  onOtherMethodsChange,
}: DisposalMethodsQuestionProps) {
  const [otherDraft, setOtherDraft] = useState('');

  const toggle = (id: DisposalMethodId, checked: boolean) => {
    onSelectedChange(
      checked ? [...selected, id] : selected.filter((v) => v !== id)
    );
  };

  const addOther = () => {
    const label = otherDraft.trim();
    if (!label) return;
    onOtherMethodsChange([...otherMethods, { label, safe: false }]);
    setOtherDraft('');
  };

  const removeOther = (index: number) => {
    onOtherMethodsChange(otherMethods.filter((_, i) => i !== index));
  };

  const toggleOtherSafe = (index: number) => {
    onOtherMethodsChange(
      otherMethods.map((m, i) => (i === index ? { ...m, safe: !m.safe } : m))
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium leading-relaxed">
        <span className="text-muted-foreground mr-2">{number}.</span>
        How do you dispose of your expired medications? (Select all that apply)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DISPOSAL_METHODS.map((method) => (
          <label
            key={method.id}
            htmlFor={`method-${method.id}`}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer hover:bg-muted"
          >
            <Checkbox
              id={`method-${method.id}`}
              checked={selected.includes(method.id)}
              onCheckedChange={(checked) => toggle(method.id, checked === true)}
            />
            {method.label}
          </label>
        ))}
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex gap-2">
          <Input
            placeholder="Other method (optional)"
            value={otherDraft}
            onChange={(e) => setOtherDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOther();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addOther}>
            Add
          </Button>
        </div>
        {otherMethods.length > 0 && (
          <ul className="space-y-2">
            {otherMethods.map((m, i) => (
              <li
                key={`${m.label}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <span>{m.label}</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox
                      checked={m.safe}
                      onCheckedChange={() => toggleOtherSafe(i)}
                    />
                    This is a safe disposal method
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOther(i)}
                    aria-label={`Remove ${m.label}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
