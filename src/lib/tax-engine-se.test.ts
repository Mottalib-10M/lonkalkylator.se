import { describe, it, expect } from 'vitest';
import {
  calculateGrundavdrag,
  calculateKommunalskatt,
  calculateStatligSkatt,
  calculatePensionsavgift,
  calculateJobbskatteavdrag,
  calculateBegravningsavgift,
  calculateTakeHome,
  calculateRequiredGross,
} from './tax-engine-se';
import { SKIKTGRANS_STATLIG, PENSIONSAVGIFT_TAK } from '../data/tax-2026';

describe('calculateGrundavdrag', () => {
  it('returnerar 0 för 0 kr inkomst', () => {
    expect(calculateGrundavdrag(0)).toBe(0);
  });

  it('returnerar minst 16 800 kr', () => {
    expect(calculateGrundavdrag(100_000)).toBeGreaterThanOrEqual(16_800);
  });

  it('ökar med inkomst upp till en viss nivå', () => {
    const low = calculateGrundavdrag(120_000);
    const mid = calculateGrundavdrag(180_000);
    expect(mid).toBeGreaterThanOrEqual(low);
  });

  it('ger rimligt grundavdrag vid 420 000 kr', () => {
    const avdrag = calculateGrundavdrag(420_000);
    expect(avdrag).toBeGreaterThan(30_000);
    expect(avdrag).toBeLessThan(50_000);
  });
});

describe('calculateKommunalskatt', () => {
  it('returnerar 0 för 0 kr beskattningsbar inkomst', () => {
    expect(calculateKommunalskatt(0, 32.37)).toBe(0);
  });

  it('beräknar korrekt skatt vid 300 000 kr', () => {
    const result = calculateKommunalskatt(300_000, 32.00);
    expect(result).toBe(96_000);
  });

  it('höjer skatten med högre skattesats', () => {
    const low = calculateKommunalskatt(400_000, 30.00);
    const high = calculateKommunalskatt(400_000, 34.00);
    expect(high).toBeGreaterThan(low);
  });
});

describe('calculateStatligSkatt', () => {
  it('returnerar 0 under skiktgränsen', () => {
    expect(calculateStatligSkatt(500_000)).toBe(0);
  });

  it('returnerar 0 exakt vid skiktgränsen', () => {
    expect(calculateStatligSkatt(SKIKTGRANS_STATLIG)).toBe(0);
  });

  it('beräknar 20% på belopp över skiktgränsen', () => {
    const over = 100_000;
    const result = calculateStatligSkatt(SKIKTGRANS_STATLIG + over);
    expect(result).toBe(Math.round(over * 0.20));
  });

  it('ger rimlig statlig skatt vid 800 000 kr', () => {
    const result = calculateStatligSkatt(800_000);
    expect(result).toBe(Math.round((800_000 - SKIKTGRANS_STATLIG) * 0.20));
  });
});

describe('calculatePensionsavgift', () => {
  it('returnerar 0 för 0 kr', () => {
    expect(calculatePensionsavgift(0)).toBe(0);
  });

  it('beräknar 7% på inkomst under taket', () => {
    const result = calculatePensionsavgift(400_000);
    expect(result).toBe(Math.round(400_000 * 0.07));
  });

  it('begränsas vid taket', () => {
    const atCap = calculatePensionsavgift(PENSIONSAVGIFT_TAK);
    const overCap = calculatePensionsavgift(PENSIONSAVGIFT_TAK + 200_000);
    expect(overCap).toBe(atCap);
  });
});

describe('calculateJobbskatteavdrag', () => {
  it('returnerar 0 för 0 kr', () => {
    expect(calculateJobbskatteavdrag(0, 32.37)).toBe(0);
  });

  it('ger positivt JSA för normala inkomster', () => {
    const result = calculateJobbskatteavdrag(420_000, 32.37);
    expect(result).toBeGreaterThan(20_000);
  });

  it('ökar med inkomst upp till en viss nivå', () => {
    const jsa300 = calculateJobbskatteavdrag(300_000, 32.37);
    const jsa400 = calculateJobbskatteavdrag(400_000, 32.37);
    expect(jsa400).toBeGreaterThan(jsa300);
  });
});

describe('calculateBegravningsavgift', () => {
  it('returnerar 0 för 0 kr', () => {
    expect(calculateBegravningsavgift(0)).toBe(0);
  });

  it('beräknar 0.28% korrekt', () => {
    const result = calculateBegravningsavgift(400_000);
    expect(result).toBe(Math.round(400_000 * 0.0028));
  });
});

describe('calculateTakeHome', () => {
  it('ger nettolön mindre än bruttolön', () => {
    const result = calculateTakeHome({ monthlyGross: 35_000 });
    expect(result.netMonthly).toBeLessThan(35_000);
    expect(result.netMonthly).toBeGreaterThan(0);
  });

  it('ger korrekt bruttolön', () => {
    const result = calculateTakeHome({ monthlyGross: 40_000 });
    expect(result.grossAnnual).toBe(480_000);
    expect(result.grossMonthly).toBe(40_000);
  });

  it('nettolönen per månad är nettolön per år / 12', () => {
    const result = calculateTakeHome({ monthlyGross: 45_000 });
    expect(result.netMonthly).toBe(Math.round(result.netAnnual / 12));
  });

  it('effektiv skattesats är rimlig (20-35%)', () => {
    const result = calculateTakeHome({ monthlyGross: 35_000 });
    expect(result.effectiveTaxRate).toBeGreaterThan(15);
    expect(result.effectiveTaxRate).toBeLessThan(40);
  });

  it('statlig skatt är 0 vid låg inkomst', () => {
    const result = calculateTakeHome({ monthlyGross: 30_000 });
    expect(result.statligSkatt).toBe(0);
  });

  it('statlig skatt > 0 vid hög inkomst', () => {
    const result = calculateTakeHome({ monthlyGross: 70_000 });
    expect(result.statligSkatt).toBeGreaterThan(0);
  });

  it('hanterar 0 kr bruttolön', () => {
    const result = calculateTakeHome({ monthlyGross: 0 });
    expect(result.netMonthly).toBe(0);
    expect(result.totalSkatt).toBe(0);
  });

  it('använder angiven kommunalskattesats', () => {
    const result = calculateTakeHome({ monthlyGross: 40_000, kommunalskattRate: 30.48 });
    expect(result.kommunalskattRateUsed).toBe(30.48);
  });

  it('lägre kommunalskatt ger högre nettolön', () => {
    const low = calculateTakeHome({ monthlyGross: 40_000, kommunalskattRate: 29.68 });
    const high = calculateTakeHome({ monthlyGross: 40_000, kommunalskattRate: 33.73 });
    expect(low.netMonthly).toBeGreaterThan(high.netMonthly);
  });

  it('kyrkoavgift minskar nettolönen', () => {
    const without = calculateTakeHome({ monthlyGross: 40_000, kyrkoavgift: 0 });
    const with_ = calculateTakeHome({ monthlyGross: 40_000, kyrkoavgift: 1.0 });
    expect(with_.netMonthly).toBeLessThan(without.netMonthly);
  });
});

describe('calculateRequiredGross', () => {
  it('returnerar 0 för 0 kr målnetto', () => {
    expect(calculateRequiredGross(0)).toBe(0);
  });

  it('hittar bruttolön som ger önskad nettolön', () => {
    const targetNet = 25_000;
    const gross = calculateRequiredGross(targetNet);
    const result = calculateTakeHome({ monthlyGross: gross });
    expect(Math.abs(result.netMonthly - targetNet)).toBeLessThanOrEqual(10);
  });

  it('hittar bruttolön vid hög nettolön', () => {
    const targetNet = 50_000;
    const gross = calculateRequiredGross(targetNet);
    const result = calculateTakeHome({ monthlyGross: gross });
    expect(Math.abs(result.netMonthly - targetNet)).toBeLessThanOrEqual(10);
  });

  it('bruttolön är alltid högre än nettolön', () => {
    const gross = calculateRequiredGross(30_000);
    expect(gross).toBeGreaterThan(30_000);
  });
});
