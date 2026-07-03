import { useState } from 'react';
import InputField from '../ui/InputField';
import { calculateTakeHome, calculateStatligSkatt, calculateGrundavdrag } from '../../lib/tax-engine-se';
import { SKIKTGRANS_STATLIG } from '../../data/tax-2026';
import { formatKr, formatPercent } from '../../lib/format';

export default function StatligSkattKalkylator() {
  const [monthlyGross, setMonthlyGross] = useState(55000);

  const result = calculateTakeHome({ monthlyGross });
  const grundavdrag = calculateGrundavdrag(monthlyGross * 12);
  const taxableIncome = Math.max(0, monthlyGross * 12 - grundavdrag);
  const statligSkatt = calculateStatligSkatt(taxableIncome);
  const overThreshold = taxableIncome > SKIKTGRANS_STATLIG;
  const amountOver = overThreshold ? taxableIncome - SKIKTGRANS_STATLIG : 0;

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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statlig inkomstskatt 2025</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Bruttolön per år</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(monthlyGross * 12)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Grundavdrag</span>
              <span className="font-medium text-green-600 dark:text-green-400 tabular-nums">-{formatKr(grundavdrag)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Beskattningsbar inkomst</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(taxableIncome)}</span>
            </div>
            <hr className="border-gray-100 dark:border-gray-700" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Skiktgräns 2025</span>
              <span className="font-medium text-gray-900 dark:text-white tabular-nums">{formatKr(SKIKTGRANS_STATLIG)}</span>
            </div>

            {overThreshold ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Belopp över skiktgränsen</span>
                  <span className="font-medium text-red-600 dark:text-red-400 tabular-nums">{formatKr(amountOver)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-900 dark:text-white">Statlig skatt (20%)</span>
                  <span className="text-red-600 dark:text-red-400 tabular-nums">{formatKr(statligSkatt)}</span>
                </div>
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
                  Du betalar statlig inkomstskatt! Din beskattningsbara inkomst överstiger skiktgränsen med {formatKr(amountOver)}.
                </div>
              </>
            ) : (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-300">
                Du betalar <strong>ingen</strong> statlig inkomstskatt. Din beskattningsbara inkomst understiger skiktgränsen med {formatKr(SKIKTGRANS_STATLIG - taxableIncome)}.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface overflow-hidden">
        <div className={`px-6 py-8 text-center ${overThreshold ? 'bg-red-600' : 'bg-brand-500'}`}>
          <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Statlig inkomstskatt</p>
          <p className="mt-2 text-4xl sm:text-5xl font-bold text-white tabular-nums">
            {formatKr(statligSkatt)}
          </p>
          <p className="mt-1 text-white/70 text-sm">
            per år &middot; {formatKr(Math.round(statligSkatt / 12))}/mån
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Total skatt (inkl. kommunalskatt)</span>
            <span className="tabular-nums font-medium">{formatKr(result.totalSkatt)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
            <span>Nettolön per månad</span>
            <span className="tabular-nums font-semibold text-brand-600 dark:text-brand-400">{formatKr(result.netMonthly)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Effektiv skattesats</span>
            <span className="tabular-nums font-medium">{formatPercent(result.effectiveTaxRate)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Marginalskatt</span>
            <span className="tabular-nums font-medium">{formatPercent(result.marginalTaxRate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
