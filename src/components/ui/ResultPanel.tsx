import { formatDec } from '@/lib/format';
import { formatCurrency, formatPercent, formatKr } from '../../lib/format';
import type { TaxResult } from '../../lib/tax-engine-se';

interface Props {
  result: TaxResult;
}

export default function ResultPanel({ result }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface overflow-hidden">
      {/* Nettolön - huvudresultat */}
      <div className="bg-brand-500 px-6 py-8 text-center">
        <p className="text-sm font-medium text-brand-100 uppercase tracking-wider">Din nettolön</p>
        <p className="mt-2 text-4xl sm:text-5xl font-bold text-white tabular-nums result-value">
          {formatKr(result.netMonthly)}
        </p>
        <p className="mt-1 text-brand-200 text-sm">
          per månad &middot; {formatKr(result.netAnnual)}/år &middot; {formatKr(result.netWeekly)}/vecka
        </p>
      </div>

      {/* Uppdelning */}
      <div className="px-6 py-5 space-y-3">
        <Row label="Bruttolön" value={result.grossAnnual} bold />
        <Divider />
        <Row label="Grundavdrag" value={result.grundavdrag} note="Avdrag" positive />
        <Row label="Beskattningsbar inkomst" value={result.taxableIncome} />
        <Divider />
        <Row label={`Kommunalskatt (${formatDec(result.kommunalskattRateUsed, 2)}%)`} value={-result.kommunalskatt} negative />
        {result.statligSkatt > 0 && (
          <Row label="Statlig inkomstskatt (20%)" value={-result.statligSkatt} negative />
        )}
        <Row label="Allmän pensionsavgift (7%)" value={-result.pensionsavgift} negative />
        <Row label="Begravningsavgift" value={-result.begravningsavgift} negative />
        {result.kyrkoavgift > 0 && (
          <Row label="Kyrkoavgift" value={-result.kyrkoavgift} negative />
        )}
        <Divider />
        <Row label="Skattereduktion pensionsavgift" value={result.pensionsavgiftReduktion} positive note="Reduktion" />
        <Row label="Jobbskatteavdrag" value={result.jobbskatteavdrag} positive note="Reduktion" />
        <Divider />
        <Row label="Total skatt" value={-result.totalSkatt} negative bold />
        <Row label="Nettolön per år" value={result.netAnnual} bold accent />
        <Divider />
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
  );
}

function Row({ label, value, bold, negative, positive, accent, note }: {
  label: string; value: number; bold?: boolean; negative?: boolean; positive?: boolean; accent?: boolean; note?: string;
}) {
  return (
    <div className={`flex justify-between items-center ${bold ? 'font-semibold' : ''} ${accent ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'}`}>
      <span className="text-sm">{label}</span>
      <div className="text-right">
        <span className={`tabular-nums ${negative ? 'text-red-600 dark:text-red-400' : ''} ${positive ? 'text-green-600 dark:text-green-400' : ''}`}>
          {formatKr(value)}
        </span>
        {note && <span className="block text-xs text-green-600 dark:text-green-400">{note}</span>}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100 dark:border-gray-700" />;
}
