import { useState } from 'react';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';
import BreakdownBar from '../ui/BreakdownBar';
import { calculateTakeHome } from '../../lib/tax-engine-se';
import { KOMMUNER, DEFAULT_KOMMUNALSKATT } from '../../data/tax-2025';

interface Props {
  initialGross?: number;
}

export default function LonKalkylator({ initialGross = 35000 }: Props) {
  const [monthlyGross, setMonthlyGross] = useState(initialGross);
  const [selectedKommun, setSelectedKommun] = useState('');
  const [kyrkoavgift, setKyrkoavgift] = useState(0);

  const kommun = KOMMUNER.find(k => k.slug === selectedKommun);
  const kommunalskattRate = kommun?.rate ?? DEFAULT_KOMMUNALSKATT;

  const result = calculateTakeHome({
    monthlyGross,
    kommunalskattRate,
    kyrkoavgift,
  });

  const segments = [
    { label: 'Nettolön', value: result.netAnnual, color: '#005293' },
    { label: 'Kommunalskatt', value: result.kommunalskatt, color: '#ef4444' },
    { label: 'Statlig skatt', value: result.statligSkatt, color: '#f97316' },
    { label: 'Pensionsavgift', value: Math.max(0, result.pensionsavgift - result.pensionsavgiftReduktion), color: '#eab308' },
    { label: 'Begravningsavgift', value: result.begravningsavgift, color: '#8b5cf6' },
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
          step={1000}
          min={0}
          max={500000}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kommun
          </label>
          <select
            value={selectedKommun}
            onChange={(e) => setSelectedKommun(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-surface py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          >
            <option value="">Rikssnitt ({DEFAULT_KOMMUNALSKATT}%)</option>
            {KOMMUNER.map(k => (
              <option key={k.slug} value={k.slug}>
                {k.name} ({k.rate}%)
              </option>
            ))}
          </select>
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
