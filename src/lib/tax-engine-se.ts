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
} from '../data/tax-2026';

export interface TaxInput {
  /** Bruttolön per månad i kr */
  monthlyGross: number;
  /** Kommunalskattesats i % (t.ex. 32.37) */
  kommunalskattRate?: number;
  /** Kyrkoavgift i % (0 om ej medlem) */
  kyrkoavgift?: number;
  /** Ålder (under 65/över 65 påverkar jobbskatteavdrag) */
  age?: number;
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
  /** Begravningsavgift (årlig) */
  begravningsavgift: number;
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
 * Beräkna grundavdrag baserat på förvärvsinkomst
 * Grundavdraget beror på den taxerade inkomsten och baseras på prisbasbeloppet (PBB).
 *
 * Förenklad modell baserad på Skatteverkets tabeller:
 * - Inkomst 0–0.99 PBB: 0.423 PBB
 * - Inkomst 0.99–2.72 PBB: 0.423 PBB + 0.202 * (inkomst - 0.99 PBB)
 * - Inkomst 2.72–3.82 PBB: 0.77 PBB
 * - Inkomst 3.82–4.78 PBB: 0.77 PBB - 0.1 * (inkomst - 3.82 PBB)
 * - Inkomst > 4.78 PBB: 0.674 PBB
 */
export function calculateGrundavdrag(grossAnnual: number): number {
  if (grossAnnual <= 0) return 0;

  const pbb = PRISBASBELOPP;
  const inkomstIPbb = grossAnnual / pbb;

  let avdragIPbb: number;

  if (inkomstIPbb <= 0.99) {
    avdragIPbb = 0.423;
  } else if (inkomstIPbb <= 2.72) {
    avdragIPbb = 0.423 + 0.202 * (inkomstIPbb - 0.99);
  } else if (inkomstIPbb <= 3.82) {
    avdragIPbb = 0.77;
  } else if (inkomstIPbb <= 4.78) {
    avdragIPbb = 0.77 - 0.10 * (inkomstIPbb - 3.82);
  } else {
    avdragIPbb = 0.674;
  }

  // Avrunda nedåt till närmaste 100-tal
  const avdrag = Math.floor((avdragIPbb * pbb) / 100) * 100;
  return Math.max(avdrag, 16_800);
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
 * Beräkna allmän pensionsavgift (7% upp till taket)
 */
export function calculatePensionsavgift(grossAnnual: number): number {
  if (grossAnnual <= 0) return 0;
  const underlag = Math.min(grossAnnual, PENSIONSAVGIFT_TAK);
  return Math.round(underlag * PENSIONSAVGIFT_SATS);
}

/**
 * Beräkna jobbskatteavdrag (JSA) 2026
 *
 * Kalibrerad modell baserad på 67 kap. inkomstskattelagen och Skatteverkets
 * skattetabeller. JSA beror på arbetsinkomst, grundavdrag och kommunalskattesats.
 *
 * Inkomstintervallen uttrycks i prisbasbelopp (PBB = 58 800 kr).
 * Koefficienterna är kalibrerade mot Skatteverkets skattetabeller för 2026.
 */
export function calculateJobbskatteavdrag(grossAnnual: number, kommunalskattRate: number): number {
  if (grossAnnual <= 0) return 0;

  const pbb = PRISBASBELOPP;
  const rate = kommunalskattRate / 100;
  const grundavdrag = calculateGrundavdrag(grossAnnual);

  if (grossAnnual <= grundavdrag) return 0;

  const b1 = 0.91 * pbb;   // 53 508 kr
  const b2 = 3.24 * pbb;   // 190 512 kr
  const b3 = 8.08 * pbb;   // 475 104 kr
  const b4 = 13.54 * pbb;  // 796 152 kr

  let jsa: number;

  if (grossAnnual <= b1) {
    // Låga inkomster: JSA = hela skatten på (inkomst - grundavdrag)
    jsa = (grossAnnual - grundavdrag) * rate;
  } else if (grossAnnual <= b2) {
    // Medelinkomster: grunddel + 10,7% på inkomst över 0.91 PBB
    jsa = Math.max(0, (b1 - grundavdrag)) * rate + (grossAnnual - b1) * 0.107;
  } else if (grossAnnual <= b3) {
    // Högre inkomster: avtagande tillväxt med 7,2%
    jsa = Math.max(0, (b1 - grundavdrag)) * rate
      + (b2 - b1) * 0.107
      + (grossAnnual - b2) * 0.072;
  } else if (grossAnnual <= b4) {
    // Höga inkomster: avtagande tillväxt med 4,8%
    jsa = Math.max(0, (b1 - grundavdrag)) * rate
      + (b2 - b1) * 0.107
      + (b3 - b2) * 0.072
      + (grossAnnual - b3) * 0.048;
  } else {
    // Mycket höga inkomster: avtrappning med 3%
    const baseJsa = Math.max(0, (b1 - grundavdrag)) * rate
      + (b2 - b1) * 0.107
      + (b3 - b2) * 0.072
      + (b4 - b3) * 0.048;
    jsa = Math.max(0, baseJsa - (grossAnnual - b4) * 0.03);
  }

  return Math.round(jsa);
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

  // 5. Allmän pensionsavgift
  const pensionsavgift = calculatePensionsavgift(grossAnnual);
  const pensionsavgiftReduktion = pensionsavgift; // Full skattereduktion

  // 6. Jobbskatteavdrag
  const jobbskatteavdrag = calculateJobbskatteavdrag(grossAnnual, kommunalskattRate);

  // 7. Begravningsavgift
  const begravningsavgift = calculateBegravningsavgift(taxableIncome);

  // 8. Kyrkoavgift
  const kyrkoavgift = kyrkoavgiftRate > 0 ? Math.round(taxableIncome * (kyrkoavgiftRate / 100)) : 0;

  // 9. Total skatt = kommunalskatt + statlig skatt + begravningsavgift + kyrkoavgift + pensionsavgift - pensionsreduktion - jobbskatteavdrag
  const totalSkattBeforeReductions = kommunalskatt + statligSkatt + begravningsavgift + kyrkoavgift + pensionsavgift;
  const totalReductions = pensionsavgiftReduktion + jobbskatteavdrag;
  const totalSkatt = Math.max(0, totalSkattBeforeReductions - totalReductions);

  // 10. Nettolön
  const netAnnual = grossAnnual - totalSkatt;
  const netMonthly = Math.round(netAnnual / 12);
  const netWeekly = Math.round(netAnnual / 52);

  // 11. Skattesatser
  const effectiveTaxRate = grossAnnual > 0 ? (totalSkatt / grossAnnual) * 100 : 0;

  // Marginalskatt: kommunalskatt + eventuell statlig skatt
  let marginalTaxRate = kommunalskattRate + BEGRAVNINGSAVGIFT;
  if (taxableIncome > SKIKTGRANS_STATLIG) {
    marginalTaxRate += STATLIG_SKATTESATS * 100;
  }

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
    begravningsavgift,
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
