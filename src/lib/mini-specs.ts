/** Miniräknare för guiderna (RECETTE §9.3), beräknade med sajtens skattemotor. */
import { calculateTakeHome, calculateJobbskatteavdrag, calculateGrundavdrag } from './tax-engine-se';
import { DEFAULT_KOMMUNALSKATT, SKIKTGRANS_STATLIG } from '../data/tax-2026';
import type { MiniSpec } from './mini-types';

const kr = (x: number) => new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(Math.round(x)) + ' kr';
const pct = (x: number, d = 1) => new Intl.NumberFormat('sv-SE', { minimumFractionDigits: d, maximumFractionDigits: d }).format(x) + ' %';
const lon = (def = 40000) => ({ id: 'm', label: 'Bruttolön per månad', def, unit: 'kr', max: 2000000 });
const kom = { id: 'k', label: 'Kommunalskatt', def: DEFAULT_KOMMUNALSKATT, unit: '%', max: 40, decimals: 2 };
const R = (m: number, k = DEFAULT_KOMMUNALSKATT) => calculateTakeHome({ monthlyGross: m, kommunalskattRate: k });

const SPECS: Record<string, MiniSpec> = {
  netto: { title: 'Räkna ut din nettolön', cta: 'Lönekalkylatorn', inputs: [lon(), kom], run: ({ m, k }) => {
    const r = R(m, k); return { head: ['Nettolön per månad', kr(r.netMonthly)], rows: [['Skatt per månad', kr(r.totalSkatt / 12)], ['Effektiv skatt', pct(r.effectiveTaxRate)], ['Jobbskatteavdrag per år', kr(r.jobbskatteavdrag)]] };
  } },
  jobb: { title: 'Hur stort blir ditt jobbskatteavdrag?', cta: 'Lönekalkylatorn', inputs: [lon(), kom], run: ({ m, k }) => {
    const j = calculateJobbskatteavdrag(m * 12, k); return { head: ['Jobbskatteavdrag per år', kr(j)], rows: [['Per månad', kr(j / 12)], ['Grundavdrag per år', kr(calculateGrundavdrag(m * 12))]] };
  } },
  kommunal: { title: 'Vad kostar kommunalskatten dig?', cta: 'Lönekalkylatorn', inputs: [lon(), kom], run: ({ m, k }) => {
    const r = R(m, k); const snitt = R(m); return { head: ['Kommunalskatt per år', kr(r.kommunalskatt)], rows: [['Mot rikssnittet', `${r.netAnnual >= snitt.netAnnual ? '+' : '−'}${kr(Math.abs(r.netAnnual - snitt.netAnnual))} netto per år`], ['Nettolön per månad', kr(r.netMonthly)]] };
  } },
  satser: { title: 'Alla skattesatser på din lön', cta: 'Lönekalkylatorn', inputs: [lon(55000)], run: ({ m }) => {
    const r = R(m); return { head: ['Total skatt per år', kr(r.totalSkatt)], rows: [['Kommunalskatt', kr(r.kommunalskatt)], ['Statlig skatt (20 % över ' + kr(SKIKTGRANS_STATLIG) + ')', kr(r.statligSkatt)], ['Jobbskatteavdrag och andra reduktioner', `−${kr(r.kommunalskatt + r.statligSkatt + r.pensionsavgift + r.begravningsavgift + r.kyrkoavgift - r.totalSkatt)}`], ['Marginalskatt', pct(r.marginalTaxRate)]] };
  } },
};

export function getSpec(kind: string, _lang?: string): MiniSpec {
  const s = SPECS[kind]; if (!s) throw new Error(`Okänd miniräknare: ${kind}`); return s;
}
