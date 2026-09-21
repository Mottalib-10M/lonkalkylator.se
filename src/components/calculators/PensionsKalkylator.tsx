import { formatDec } from '@/lib/format';
import { useState } from 'react';
import InputField from '../ui/InputField';
import { calculatePensionsavgift, calculateTakeHome } from '../../lib/tax-engine-se';
import { PENSIONSAVGIFT_SATS, PENSIONSAVGIFT_TAK } from '../../data/tax-2026';
import { formatKr, formatPercent } from '../../lib/format';

export default function PensionsKalkylator() {
  const [monthlyGross, setMonthlyGross] = useState(40000);

  const grossAnnual = monthlyGross * 12;
  const pensionsavgift = calculatePensionsavgift(grossAnnual);
  const result = calculateTakeHome({ monthlyGross });
  const overCap = grossAnnual > PENSIONSAVGIFT_TAK;

  // Tjänstepension (schablonberäkning — arbetsgivaren betalar ca 4,5% ITP1 / 30% ITP2)
  const tjanstepensionRate = 0.045;
  const tjanstepension = Math.round(grossAnnual * tjanstepensionRate);

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

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pensionsberäkning 2025</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Bruttolön per år</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(grossAnnual)}</span>
            </div>
            <hr className="border-gray-100 dark:border-gray-700" />

            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Allmän pensionsavgift</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Avgift ({formatDec(PENSIONSAVGIFT_SATS * 100, 0)}%)</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(pensionsavgift)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Skattereduktion</span>
              <span className="font-medium text-green-600 dark:text-green-400 tabular-nums">-{formatKr(pensionsavgift)}</span>
            </div>
            {overCap && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-700 dark:text-yellow-300">
                Din inkomst överstiger taket för pensionsavgift ({formatKr(PENSIONSAVGIFT_TAK)}). Avgiften beräknas bara på inkomst upp till taket.
              </div>
            )}

            <hr className="border-gray-100 dark:border-gray-700" />

            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Tjänstepension (uppskattning)</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">ITP1 ({formatDec(tjanstepensionRate * 100, 1)}%)</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(tjanstepension)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tjänstepensionen betalas av din arbetsgivare utöver din bruttolön. Den exakta nivån beror på ditt kollektivavtal.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface overflow-hidden">
        <div className="bg-brand-500 px-6 py-8 text-center">
          <p className="text-sm font-medium text-brand-100 uppercase tracking-wider">Allmän pensionsavgift</p>
          <p className="mt-2 text-4xl sm:text-5xl font-bold text-white tabular-nums">
            {formatKr(pensionsavgift)}
          </p>
          <p className="mt-1 text-brand-200 text-sm">
            per år &middot; Full skattereduktion
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Pensionsavgift per månad</span>
            <span className="tabular-nums font-medium">{formatKr(Math.round(pensionsavgift / 12))}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Tjänstepension per år (uppskattning)</span>
            <span className="tabular-nums font-medium">{formatKr(tjanstepension)}</span>
          </div>
          <hr className="border-gray-100 dark:border-gray-700" />
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Nettolön per månad</span>
            <span className="tabular-nums font-semibold text-brand-600 dark:text-brand-400">{formatKr(result.netMonthly)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Effektiv skattesats</span>
            <span className="tabular-nums font-medium">{formatPercent(result.effectiveTaxRate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
