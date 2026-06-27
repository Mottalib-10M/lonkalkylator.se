import { useState } from 'react';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';
import { calculateRequiredGross, calculateTakeHome } from '../../lib/tax-engine-se';
import { KOMMUNER, DEFAULT_KOMMUNALSKATT } from '../../data/tax-2025';
import { formatKr } from '../../lib/format';

export default function NettoTillBruttoKalkylator() {
  const [targetNet, setTargetNet] = useState(25000);
  const [selectedKommun, setSelectedKommun] = useState('');

  const kommun = KOMMUNER.find(k => k.slug === selectedKommun);
  const kommunalskattRate = kommun?.rate ?? DEFAULT_KOMMUNALSKATT;

  const requiredGross = calculateRequiredGross(targetNet, kommunalskattRate);
  const result = calculateTakeHome({ monthlyGross: requiredGross, kommunalskattRate });

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <InputField
          label="Önskad nettolön per månad"
          value={targetNet}
          onChange={setTargetNet}
          prefix="kr"
          help="Den nettolön du vill ha utbetald per månad"
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
        </div>

        <div className="rounded-2xl border-2 border-accent-500 bg-accent-50 dark:bg-accent-500/10 p-6 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Du behöver en bruttolön på</p>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
            {formatKr(requiredGross)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            per månad &middot; {formatKr(requiredGross * 12)}/år
          </p>
        </div>
      </div>

      <div>
        <ResultPanel result={result} />
      </div>
    </div>
  );
}
