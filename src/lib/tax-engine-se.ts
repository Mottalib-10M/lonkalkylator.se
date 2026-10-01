/**
 * Svensk skatteberäkningsmotor 2026
 *
 * Beräknar nettolön baserat på Skatteverkets regler för beskattningsåret 2026.
 * Omfattar: kommunalskatt, statlig inkomstskatt, grundavdrag, jobbskatteavdrag,
 * allmän pensionsavgift och begravningsavgift.
 *
 * Källa: Skatteverket (skatteverket.se)
 */

import {
  PRISBASBELOPP,
  SKIKTGRANS_STATLIG,
  STATLIG_SKATTESATS,
  PENSIONSAVGIFT_SATS,
  PENSIONSAVGIFT_TAK,
  DEFAULT_KOMMUNALSKATT,
  BEGRAVNINGSAVGIFT,
  PUBLIC_SERVICE_SATS,
  PUBLIC_SERVICE_MAX,
  JSA_2026,
  FORVARVSREDUKTION,
} from '../data/tax-2026';

export interface TaxInput {
  /** Bruttolön per månad i kr */
  monthlyGross: number;
  /** Kommunalskattesats i % (t.ex. 32.38) */
  kommunalskattRate?: number;
  /** Kyrkoavgift i % (0 om ej medlem) */
  kyrkoavgift?: number;
  /** Ålder (under 65/över 65 påverkar jobbskatteavdrag) */
  age?: number;
  /** Internt : hoppa över marginalskatten (används när motorn anropar sig själv) */
  skipMarginal?: boolean;
}

export interface TaxResult {
  /** Bruttolön per år */
  grossAnnual: number;
  /** Bruttolön per månad */
  grossMonthly: number;
  /** Grundavdrag (årligt) */
  grundavdrag: number;
  /** Beskattningsbar förvärvsinkomst */
  taxableIncome: number;
  /** Kommunalskatt (årlig) */
  kommunalskatt: number;
  /** Statlig inkomstskatt (årlig) */
  statligSkatt: number;
  /** Allmän pensionsavgift (årlig) */
  pensionsavgift: number;
  /** Skattereduktion för pensionsavgift */
  pensionsavgiftReduktion: number;
  /** Jobbskatteavdrag (årligt) */
  jobbskatteavdrag: number;
  /** Skattereduktion för förvärvsinkomst (årlig, högst 1 500 kr) */
  forvarvsreduktion: number;
  /** Begravningsavgift (årlig) */
  begravningsavgift: number;
  /** Public service-avgift (årlig) */
  publicServiceAvgift: number;
  /** Kyrkoavgift (årlig) */
  kyrkoavgift: number;
  /** Total skatt (årlig) */
  totalSkatt: number;
  /** Nettolön per år */
  netAnnual: number;
  /** Nettolön per månad */
  netMonthly: number;
  /** Nettolön per vecka */
  netWeekly: number;
  /** Effektiv skattesats */
  effectiveTaxRate: number;
  /** Marginalskatt */
  marginalTaxRate: number;
  /** Kommunalskattesats som använts */
  kommunalskattRateUsed: number;
}

/**
 * Beräkna grundavdrag (63 kap. 3 § inkomstskattelagen, SKV 433 avsnitt 6)
 *
 * - Inkomst högst 0,99 PBB : 0,423 PBB
 * - 0,99–2,72 PBB : 0,423 PBB + 20 % av inkomsten över 0,99 PBB
 * - 2,72–3,11 PBB : 0,77 PBB
 * - 3,11–7,88 PBB : 0,77 PBB − 10 % av inkomsten över 3,11 PBB
 * - över 7,88 PBB : 0,293 PBB
 * Avrundas uppåt till närmaste hundratal och kan inte överstiga inkomsten.
 */
export function calculateGrundavdrag(grossAnnual: number): number {
  if (grossAnnual <= 0) return 0;

  const pbb = PRISBASBELOPP;
  let avdrag: number;

  if (grossAnnual <= 0.99 * pbb) {
    avdrag = 0.423 * pbb;
  } else if (grossAnnual <= 2.72 * pbb) {
    avdrag = 0.423 * pbb + 0.2 * (grossAnnual - 0.99 * pbb);
  } else if (grossAnnual <= 3.11 * pbb) {
    avdrag = 0.77 * pbb;
  } else if (grossAnnual <= 7.88 * pbb) {
    avdrag = 0.77 * pbb - 0.1 * (grossAnnual - 3.11 * pbb);
  } else {
    avdrag = 0.293 * pbb;
  }

  // Avrunda uppåt till närmaste 100-tal (en tusendel dras av för att inte lyfta ett jämnt belopp på grund av flyttal)
  return Math.min(Math.ceil((avdrag - 0.001) / 100) * 100, Math.floor(grossAnnual));
}

/**
 * Beräkna kommunalskatt
 */
export function calculateKommunalskatt(taxableIncome: number, ratePercent: number): number {
  if (taxableIncome <= 0) return 0;
  return Math.round(taxableIncome * (ratePercent / 100));
}

/**
 * Beräkna statlig inkomstskatt (20% på beskattningsbar inkomst över skiktgränsen)
 */
export function calculateStatligSkatt(taxableIncome: number): number {
  if (taxableIncome <= SKIKTGRANS_STATLIG) return 0;
  return Math.round((taxableIncome - SKIKTGRANS_STATLIG) * STATLIG_SKATTESATS);
}

/**
 * Beräkna allmän pensionsavgift : 7 % av inkomsten upp till 8,07 inkomstbasbelopp,
 * avrundat till närmaste hundratal (50 kr avrundas nedåt). Ingen avgift under 0,423 PBB.
 */
export function calculatePensionsavgift(grossAnnual: number): number {
  if (grossAnnual < 0.423 * PRISBASBELOPP) return 0;
  const underlag = Math.min(grossAnnual, PENSIONSAVGIFT_TAK);
  const avgift = Math.round(underlag * PENSIONSAVGIFT_SATS * 100) / 100;
  return Math.ceil((avgift - 50) / 100 - 1e-9) * 100;
}

/**
 * Beräkna jobbskatteavdrag (JSA) 2026, under 66 år
 *
 * 67 kap. 7 § inkomstskattelagen, enligt Skatteverkets tekniska beskrivning SKV 433 (avsnitt 7.5.2).
 * AI = arbetsinkomst (avrundad nedåt till hundratal), GA = grundavdrag, KI = kommunal skattesats.
 * - AI högst 0,91 PBB : (AI − GA) × KI
 * - 0,91–3,24 PBB : (0,91 PBB + 38,74 % × (AI − 0,91 PBB) − GA) × KI
 * - 3,24–8,08 PBB : (1,813 PBB + 25,1 % × (AI − 3,24 PBB) − GA) × KI
 * - över 8,08 PBB : (3,027 PBB − GA) × KI
 */
export function calculateJobbskatteavdrag(grossAnnual: number, kommunalskattRate: number): number {
  if (grossAnnual <= 0) return 0;

  const pbb = PRISBASBELOPP;
  const ki = kommunalskattRate / 100;
  const ai = Math.floor(grossAnnual / 100) * 100;
  const ga = calculateGrundavdrag(grossAnnual);
  const j = JSA_2026;

  let underlag: number;
  if (ai <= j.grans1 * pbb) {
    underlag = ai - ga;
  } else if (ai <= j.grans2 * pbb) {
    underlag = j.grans1 * pbb + j.sats2 * (ai - j.grans1 * pbb) - ga;
  } else if (ai <= j.grans3 * pbb) {
    underlag = j.bas3 * pbb + j.sats3 * (ai - j.grans2 * pbb) - ga;
  } else {
    underlag = j.tak * pbb - ga;
  }

  return Math.max(0, Math.floor(underlag * ki));
}

/** Skattereduktion för förvärvsinkomst : 0,75 % av beskattningsbar inkomst över 40 000 kr, högst 1 500 kr. */
export function calculateForvarvsreduktion(taxableIncome: number): number {
  const f = FORVARVSREDUKTION;
  if (taxableIncome <= f.fran) return 0;
  return Math.min(f.max, Math.floor((taxableIncome - f.fran) * f.sats));
}

/** Public service-avgift : 1 % av beskattningsbar förvärvsinkomst, högst 1 184 kr 2026. */
export function calculatePublicService(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  return Math.min(PUBLIC_SERVICE_MAX, Math.floor(taxableIncome * PUBLIC_SERVICE_SATS));
}

/**
 * Beräkna begravningsavgift
 */
export function calculateBegravningsavgift(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  return Math.round(taxableIncome * (BEGRAVNINGSAVGIFT / 100));
}

/**
 * Fullständig skatteberäkning, returnerar TaxResult
 */
export function calculateTakeHome(input: TaxInput): TaxResult {
  const monthlyGross = Math.max(0, input.monthlyGross);
  const grossAnnual = monthlyGross * 12;
  const kommunalskattRate = input.kommunalskattRate ?? DEFAULT_KOMMUNALSKATT;
  const kyrkoavgiftRate = input.kyrkoavgift ?? 0;

  // 1. Grundavdrag
  const grundavdrag = calculateGrundavdrag(grossAnnual);

  // 2. Beskattningsbar förvärvsinkomst
  const taxableIncome = Math.max(0, grossAnnual - grundavdrag);

  // 3. Kommunalskatt
  const kommunalskatt = calculateKommunalskatt(taxableIncome, kommunalskattRate);

  // 4. Statlig inkomstskatt
  const statligSkatt = calculateStatligSkatt(taxableIncome);

  // 5. Allmän pensionsavgift, och skattereduktionen som motsvarar den (kan inte överstiga inkomstskatten)
  const pensionsavgift = calculatePensionsavgift(grossAnnual);
  const pensionsavgiftReduktion = Math.min(pensionsavgift, kommunalskatt + statligSkatt);

  // 6. Jobbskatteavdrag och skattereduktion för förvärvsinkomst : räknas bara av mot kommunal inkomstskatt
  const kommunalKvar = Math.max(0, kommunalskatt - Math.max(0, pensionsavgiftReduktion - statligSkatt));
  const jsaBeraknat = calculateJobbskatteavdrag(grossAnnual, kommunalskattRate);
  const jsaUtnyttjat = Math.min(jsaBeraknat, kommunalKvar);
  const forvarvsreduktion = Math.min(calculateForvarvsreduktion(taxableIncome), kommunalKvar - jsaUtnyttjat);
  const jobbskatteavdrag = jsaUtnyttjat;

  // 7. Begravningsavgift och public service-avgift : påverkas inte av skattereduktionerna
  const begravningsavgift = calculateBegravningsavgift(taxableIncome);
  const publicServiceAvgift = calculatePublicService(taxableIncome);

  // 8. Kyrkoavgift
  const kyrkoavgift = kyrkoavgiftRate > 0 ? Math.round(taxableIncome * (kyrkoavgiftRate / 100)) : 0;

  // 9. Total skatt
  const totalSkatt =
    kommunalskatt + statligSkatt + begravningsavgift + publicServiceAvgift + kyrkoavgift + pensionsavgift
    - pensionsavgiftReduktion - jobbskatteavdrag - forvarvsreduktion;

  // 10. Nettolön
  const netAnnual = grossAnnual - totalSkatt;
  const netMonthly = Math.round(netAnnual / 12);
  const netWeekly = Math.round(netAnnual / 52);

  // 11. Skattesatser
  const effectiveTaxRate = grossAnnual > 0 ? (totalSkatt / grossAnnual) * 100 : 0;

  // Marginalskatt : skatten på ytterligare 12 000 kr per år (1 000 kr i månaden), mätt i motorn själv
  // så att grundavdragets och jobbskatteavdragets avtrappning räknas med.
  const marginalTaxRate = input.skipMarginal
    ? 0
    : ((calculateTakeHome({ ...input, monthlyGross: monthlyGross + 1000, skipMarginal: true }).totalSkatt - totalSkatt) / 12_000) * 100;

  return {
    grossAnnual,
    grossMonthly: monthlyGross,
    grundavdrag,
    taxableIncome,
    kommunalskatt,
    statligSkatt,
    pensionsavgift,
    pensionsavgiftReduktion,
    jobbskatteavdrag,
    forvarvsreduktion,
    begravningsavgift,
    publicServiceAvgift,
    kyrkoavgift,
    totalSkatt,
    netAnnual,
    netMonthly,
    netWeekly,
    effectiveTaxRate,
    marginalTaxRate,
    kommunalskattRateUsed: kommunalskattRate,
  };
}

/**
 * Beräkna erforderlig bruttolön för att uppnå önskad nettolön (binär sökning)
 */
export function calculateRequiredGross(
  targetNetMonthly: number,
  kommunalskattRate?: number,
  kyrkoavgift?: number,
): number {
  if (targetNetMonthly <= 0) return 0;

  let low = targetNetMonthly;
  let high = targetNetMonthly * 2.5;

  // Utöka övre gräns om det behövs
  while (calculateTakeHome({ monthlyGross: high, kommunalskattRate, kyrkoavgift }).netMonthly < targetNetMonthly) {
    high *= 2;
  }

  // Binär sökning
  for (let i = 0; i < 100; i++) {
    const mid = Math.round((low + high) / 2);
    const result = calculateTakeHome({ monthlyGross: mid, kommunalskattRate, kyrkoavgift });

    if (Math.abs(result.netMonthly - targetNetMonthly) <= 1) {
      return mid;
    }

    if (result.netMonthly < targetNetMonthly) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return Math.round((low + high) / 2);
}
