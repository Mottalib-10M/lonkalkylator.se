import { formatDec } from '@/lib/format';
import { useState } from 'react';
import InputField from '../ui/InputField';
import ResultPanel from '../ui/ResultPanel';
import { calculateTakeHome } from '../../lib/tax-engine-se';
import { KOMMUNER, DEFAULT_KOMMUNALSKATT } from '../../data/tax-2026';
import { formatKr } from '../../lib/format';

export default function TimlonKalkylator() {
  const [hourlyRate, setHourlyRate] = useState(200);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [selectedKommun, setSelectedKommun] = useState('');

  const kommun = KOMMUNER.find(k => k.slug === selectedKommun);
  const kommunalskattRate = kommun?.rate ?? DEFAULT_KOMMUNALSKATT;

  // Beräkna: timmar/vecka * 52 veckor / 12 månader = timmar/månad
  const hoursPerMonth = (hoursPerWeek * 52) / 12;
  const monthlyGross = Math.round(hourlyRate * hoursPerMonth);

  const result = calculateTakeHome({ monthlyGross, kommunalskattRate });

  // Nettotimlön
  const netHourlyRate = result.netAnnual > 0 ? Math.round((result.netAnnual / 52 / hoursPerWeek) * 100) / 100 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <InputField
          label="Timlön (brutto)"
          value={hourlyRate}
          onChange={setHourlyRate}
          prefix="kr"
          suffix="/timme"
          help="Din timlön före skatt"
          step={10}
          min={0}
          max={5000}
        />

        <InputField
          label="Timmar per vecka"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          prefix=""
          suffix="tim/vecka"
          help="Antal timmar du jobbar per vecka (heltid = 40)"
          step={1}
          min={1}
          max={80}
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
            <option value="">Rikssnitt ({formatDec(DEFAULT_KOMMUNALSKATT, 2)}%)</option>
            {KOMMUNER.map(k => (
              <option key={k.slug} value={k.slug}>
                {k.name} ({formatDec(k.rate, 2)}%)
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface p-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Omvandling</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Timlön (brutto)</span>
            <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(hourlyRate)}/tim</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Månadslön (brutto)</span>
            <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(monthlyGross)}/mån</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Årslön (brutto)</span>
            <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(monthlyGross * 12)}/år</span>
          </div>
          <hr className="border-gray-100 dark:border-gray-700" />
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-gray-900 dark:text-white">Nettotimlön</span>
            <span className="text-brand-600 dark:text-brand-400 tabular-nums">{formatKr(netHourlyRate)}/tim</span>
          </div>
        </div>
      </div>

      <div>
        <ResultPanel result={result} />
      </div>
    </div>
  );
}
