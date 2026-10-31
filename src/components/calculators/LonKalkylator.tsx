import { formatDec } from '@/lib/format';
import { useState, useId } from 'react';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';
import BreakdownBar from '../ui/BreakdownBar';
import { calculateTakeHome } from '../../lib/tax-engine-se';
import { DEFAULT_KOMMUNALSKATT } from '../../data/tax-2026';
import { ALLA_KOMMUNER } from '../../data/kommuner-2026';

interface Props {
  initialGross?: number;
}

export default function LonKalkylator({ initialGross = 35000 }: Props) {
  const [monthlyGross, setMonthlyGross] = useState(initialGross);
  const [selectedKommun, setSelectedKommun] = useState('');
  const kommunId = useId();
  const [kyrkoavgift, setKyrkoavgift] = useState(0);

  const kommun = ALLA_KOMMUNER.find(k => k.name === selectedKommun);
  const kommunalskattRate = kommun?.rate ?? DEFAULT_KOMMUNALSKATT;

  const result = calculateTakeHome({
    monthlyGross,
    kommunalskattRate,
    kyrkoavgift,
    begravningsavgiftRate: kommun?.begravning,
  });

  // Andelar som summerar till bruttolönen : skattereduktionerna dras av där motorn räknar av dem
  // (pensionsavgiftens reduktion först mot statlig skatt, sedan mot kommunalskatten ; jobbskatteavdrag och
  // förvärvsreduktion mot kommunalskatten), annars blir summan över 100 % (audit 2026-10-28).
  const pensRedStatlig = Math.min(result.pensionsavgiftReduktion, result.statligSkatt);
  const pensRedKommunal = result.pensionsavgiftReduktion - pensRedStatlig;
  const segments = [
    { label: 'Nettolön', value: result.netAnnual, color: '#005293' },
    { label: 'Kommunalskatt efter skattereduktioner', value: result.kommunalskatt - pensRedKommunal - result.jobbskatteavdrag - result.forvarvsreduktion, color: '#ef4444' },
    { label: 'Statlig skatt', value: result.statligSkatt - pensRedStatlig, color: '#f97316' },
    { label: 'Pensionsavgift', value: result.pensionsavgift, color: '#eab308' },
    { label: result.kyrkoavgift > 0 ? 'Begravnings-, public service- och kyrkoavgift' : 'Begravnings- och public service-avgift', value: result.begravningsavgift + result.publicServiceAvgift + result.kyrkoavgift, color: '#8b5cf6' },
  ].filter(s => s.value > 0);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <InputField
          label="Bruttolön per månad"
          value={monthlyGross}
          onChange={setMonthlyGross}
          prefix="kr"
          help="Ange din bruttolön per månad före skatt"
          step="any"
          min={0}
          max={500000}
        />

        <div className="mb-4">
          <label htmlFor={kommunId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kommun
          </label>
          <div className="relative">
            <select
              id={kommunId}
              value={selectedKommun}
              onChange={(e) => setSelectedKommun(e.target.value)}
              className="w-full appearance-none truncate rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-surface py-3 pl-4 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            >
              <option value="">Rikssnitt ({formatDec(DEFAULT_KOMMUNALSKATT, 2)}%)</option>
              {ALLA_KOMMUNER.map(k => (
                <option key={k.name} value={k.name}>
                  {k.name} ({formatDec(k.rate, 2)}%)
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Välj din kommun för korrekt kommunalskattesats
          </p>
        </div>

        <InputField
          label="Kyrkoavgift (%)"
          value={kyrkoavgift}
          onChange={setKyrkoavgift}
          prefix="%"
          help="Ange procent om du tillhör Svenska kyrkan (ca 1%). Lämna 0 om ej medlem."
          step={0.1}
          min={0}
          max={3}
          visaNoll
          decimaler={2}
        />

        <div className="mt-6">
          <BreakdownBar segments={segments} total={result.grossAnnual} />
        </div>
      </div>

      <div>
        <ResultPanel result={result} />
      </div>
    </div>
  );
}
