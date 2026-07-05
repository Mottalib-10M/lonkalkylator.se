/**
 * Inneh\u00e5llsgenerering f\u00f6r l\u00f6nesidor (/lon/[slug])
 *
 * Genererar unik text per exakt l\u00f6nebelopp f\u00f6r att s\u00e4kerst\u00e4lla
 * h\u00f6g inter-page uniqueness (m\u00e5l: 80%+).
 */

import type { TaxResult } from './tax-engine-se';
import { calculateTakeHome } from './tax-engine-se';
import { formatKr } from './format';
import { SKIKTGRANS_STATLIG, DEFAULT_KOMMUNALSKATT } from '../data/tax-2026';

// --- Hj\u00e4lpfunktioner ---

// Unik variation per l\u00f6nebelopp baserat p\u00e5 ett enkelt hash
function variationIndex(amount: number): number {
  // Beloppen 25k,30k,35k,40k,45k,50k,60k,70k,80k -> alla unika index 0-4
  const k = Math.floor(amount / 5000);
  return Math.floor((k * 7 + 3) % 5);
}

function secondaryVariation(amount: number): number {
  const k = Math.floor(amount / 5000);
  return Math.floor((k * 11 + 1) % 4);
}

function tertiaryVariation(amount: number): number {
  const k = Math.floor(amount / 5000);
  return Math.floor((k * 13 + 2) % 3);
}

function fmt(n: number): string {
  return new Intl.NumberFormat('sv-SE').format(Math.round(n));
}

function fmtKr(n: number): string {
  return formatKr(Math.round(n));
}

// Nationell medianl\u00f6n 2026 (SCB)
const MEDIAN_SALARY = 36_200;

// Arbetsgivaravgift 2026
const ARBETSGIVARAVGIFT_RATE = 0.3142;

// --- Karri\u00e4rbeskrivningar per exakt belopp ---

const CAREER_MAP: Record<number, string[]> = {
  25000: ['butikss\u00e4ljare', 'hotellreceptionist', 'barista p\u00e5 caf\u00e9', 'kundtj\u00e4nstmedarbetare', 'v\u00e5rdbitr\u00e4de'],
  30000: ['l\u00e4rarassistent', 'kontorsadministrat\u00f6r', 'tr\u00e4dg\u00e5rdsarbetare', 'lagerarbetare', 'bibliotekarie'],
  35000: ['sjuksk\u00f6terska', 'f\u00f6rskoll\u00e4rare', 'elektriker', 'redovisningsekonom', 'polis'],
  40000: ['systemadministrat\u00f6r', 'gymnasiel\u00e4rare', 'myndighetshandl\u00e4ggare', 'marknadskoordinator', 'fastighetsskötare'],
  45000: ['civilingenj\u00f6r', 'projektledare inom bygg', 'verksamhetsutvecklare', 'ekonomichef p\u00e5 sm\u00e5f\u00f6retag', 'milj\u00f6konsult'],
  50000: ['senior mjukvaruutvecklare', 'advokat', 'aff\u00e4rsutvecklingschef', 'IT-arkitekt', 'tandl\u00e4kare'],
  60000: ['avdelningschef', 'specialist\u00f6verl\u00e4kare', 'managementkonsult', 'produktchef p\u00e5 techbolag', 'finansanalytiker'],
  70000: ['enterprises\u00e4ljare', 'chefsjurist', 'hedgefondanalytiker', 'CTO p\u00e5 scaleup-bolag', 'partner p\u00e5 revisionsf\u00f6retag'],
  80000: ['vd f\u00f6r medelstort f\u00f6retag', 'investeringschef', 'partners p\u00e5 aff\u00e4rsjuridisk byr\u00e5', 'CFO p\u00e5 b\u00f6rsnoterat bolag', 'kirurg'],
};

// Unika arbetsmarknadsbeskrivningar per belopp
const MARKET_INSIGHTS: Record<number, string> = {
  25000: 'Denna l\u00f6neniv\u00e5 ligger i det nedre segmentet av svensk arbetsmarknad och \u00e4r vanlig f\u00f6r deltidstj\u00e4nster, instegsjobb och servicebranschen. M\u00e5nga i denna grupp \u00e4r unga arbetstagare under 25 \u00e5r eller personer i karriärbyte.',
  30000: 'I intervallet kring 30 000 kr hittar vi en bred grupp anst\u00e4llda inom offentlig sektor och serviceyrken. Det \u00e4r en typisk l\u00f6n f\u00f6r heltidsarbetande utan h\u00f6gskoleutbildning eller f\u00f6r nyexaminerade akademiker.',
  35000: 'Runt 35 000 kr i m\u00e5nadsl\u00f6n befinner sig m\u00e5nga yrkesgrupper inom v\u00e5rd, utbildning och hantverk. Det \u00e4r n\u00e4ra den svenska medianl\u00f6nen och representerar en stabil medelinkomst.',
  40000: 'Vid 40 000 kr m\u00e5nadsl\u00f6n har man passerat medianl\u00f6nen med god marginal. H\u00e4r hittar vi kvalificerade tj\u00e4nstem\u00e4n med h\u00f6gskoleutbildning och n\u00e5gra \u00e5rs arbetslivserfarenhet.',
  45000: 'Med 45 000 kr i l\u00f6n tillh\u00f6r du den \u00f6vre tredjedelen av svenska l\u00f6ntagare. Det \u00e4r en typisk l\u00f6n f\u00f6r erfarna specialister och mellanchefer i b\u00e5de privat och offentlig sektor.',
  50000: 'En l\u00f6n p\u00e5 50 000 kr per m\u00e5nad placerar dig i topp 20% bland svenska l\u00f6ntagare. Det \u00e4r en niv\u00e5 d\u00e4r senioritet, expertis eller ledaransvar vanligen kr\u00e4vs.',
  60000: 'Vid 60 000 kr m\u00e5nadsl\u00f6n tillh\u00f6r du topp 10% av inkomsttagarna i Sverige. Denna niv\u00e5 inneb\u00e4r ofta chefsansvar, specialistkunskap eller f\u00f6rs\u00e4ljningsansvar med h\u00f6g m\u00e5luppfyllelse.',
  70000: 'En m\u00e5nadsl\u00f6n p\u00e5 70 000 kr placerar dig bland topp 5% av alla l\u00f6ntagare. Det \u00e4r en niv\u00e5 som n\u00e4stan uteslutande f\u00f6rekommer hos h\u00f6gre chefer, partners och mycket erfarna specialister.',
  80000: 'Med 80 000 kr i m\u00e5nadsl\u00f6n befinner du dig i topp 2\u20133% av svenska l\u00f6netagare. Denna kompensationsniv\u00e5 \u00e4r reserverad f\u00f6r toppledning, senior partners och h\u00f6gspecialiserade expert\-roller.',
};

// --- Huvudfunktioner ---

export function getBandContext(amount: number, result: TaxResult): string {
  const ratio = amount / MEDIAN_SALARY;
  const dailyNet = Math.round(result.netAnnual / 365);
  const hourlyNet = Math.round(result.netMonthly / 168);
  const annualGross = amount * 12;
  const netPerWorkday = Math.round(result.netMonthly / 21);
  const weeklyGross = Math.round(amount * 12 / 52);

  // Avst\u00e5nd till skiktgr\u00e4nsen
  const taxableIncome = result.taxableIncome;
  const distToStatlig = SKIKTGRANS_STATLIG - taxableIncome;

  const prevAmount = amount - 5000;
  const nextAmount = amount + 5000;
  const prevResult = calculateTakeHome({ monthlyGross: prevAmount > 0 ? prevAmount : amount });
  const nextResult = calculateTakeHome({ monthlyGross: nextAmount });

  const diffFromPrev = result.netMonthly - prevResult.netMonthly;
  const diffToNext = nextResult.netMonthly - result.netMonthly;

  const vi = variationIndex(amount);

  const openings = [
    `En m\u00e5nadsl\u00f6n p\u00e5 ${fmtKr(amount)} brutto placerar dig ${ratio > 1 ? `${Math.round((ratio - 1) * 100)}% \u00f6ver` : `${Math.round((1 - ratio) * 100)}% under`} den svenska medianl\u00f6nen p\u00e5 ${fmtKr(MEDIAN_SALARY)}. Omr\u00e4knat till netto inneb\u00e4r det ${fmtKr(dailyNet)} per dag eller cirka ${fmtKr(hourlyNet)} per arbetstimme. P\u00e5 veckobasis tj\u00e4nar du ${fmtKr(weeklyGross)} brutto, varav ${fmtKr(result.netWeekly)} landar p\u00e5 kontot.`,

    `Med ${fmtKr(amount)} i bruttol\u00f6n f\u00e5r du ut ${fmtKr(result.netMonthly)} netto varje m\u00e5nad. Det motsvarar en timers\u00e4ttning efter skatt p\u00e5 ${fmtKr(hourlyNet)} och en dagsinkomst p\u00e5 ${fmtKr(dailyNet)}. Ditt l\u00f6nel\u00e4ge \u00e4r ${ratio > 1 ? `${Math.round((ratio - 1) * 100)}% h\u00f6gre` : `${Math.round((1 - ratio) * 100)}% l\u00e4gre`} \u00e4n riksgenomsnittet. Per arbetsdag inneb\u00e4r det ${fmtKr(netPerWorkday)} i din plånbok.`,

    `Vid en bruttol\u00f6n p\u00e5 ${fmtKr(amount)} landar din \u00e5rsinkomst p\u00e5 ${fmtKr(annualGross)} f\u00f6re skatt. Nettol\u00f6nen blir ${fmtKr(result.netMonthly)} per m\u00e5nad, vilket ger ${fmtKr(hourlyNet)} per timme efter skatt. J\u00e4mf\u00f6rt med medianl\u00f6nen p\u00e5 ${fmtKr(MEDIAN_SALARY)} ligger du ${ratio > 1 ? 'ovanf\u00f6r' : 'under'} snittet med ${fmtKr(Math.abs(amount - MEDIAN_SALARY))}. Din veckonettol\u00f6n uppg\u00e5r till ${fmtKr(result.netWeekly)}.`,

    `F\u00f6r dig som tj\u00e4nar ${fmtKr(amount)} brutto per m\u00e5nad blir den reella k\u00f6pkraften ${fmtKr(result.netMonthly)} efter skatt. Per arbetsdag (vid heltid) motsvarar det ungef\u00e4r ${fmtKr(netPerWorkday)}. Din l\u00f6n \u00e4r ${Math.round(Math.abs(ratio - 1) * 100)}% ${ratio > 1 ? '\u00f6ver' : 'under'} den nationella medianen. Varje arbetad timme ger dig reellt ${fmtKr(hourlyNet)} netto.`,

    `${fmtKr(amount)} i m\u00e5nadsl\u00f6n inneb\u00e4r att du varje \u00e5r f\u00f6rv\u00e4rvar ${fmtKr(annualGross)} brutto. Efter samtliga skatteavdrag kvarst\u00e5r ${fmtKr(result.netMonthly)} per m\u00e5nad. Per timme betyder det ${fmtKr(hourlyNet)} netto. Ditt l\u00f6nel\u00e4ge avviker med ${fmtKr(Math.abs(amount - MEDIAN_SALARY))} fr\u00e5n medianl\u00f6nen. Varje vecka landar ${fmtKr(result.netWeekly)} p\u00e5 ditt konto.`,
  ];

  let paragraph = openings[vi];

  // L\u00e4gg till skiktgr\u00e4nsinfo
  if (distToStatlig > 0) {
    paragraph += ` Din beskattningsbara inkomst p\u00e5 ${fmtKr(taxableIncome)} ligger ${fmtKr(distToStatlig)} under skiktgr\u00e4nsen f\u00f6r statlig skatt (${fmtKr(SKIKTGRANS_STATLIG)}). Det inneb\u00e4r att du enbart betalar kommunalskatt p\u00e5 ${result.kommunalskattRateUsed}% och slipper det extra skattep\u00e5slaget p\u00e5 20%.`;
  } else {
    paragraph += ` Eftersom din beskattningsbara inkomst p\u00e5 ${fmtKr(taxableIncome)} \u00f6verstiger skiktgr\u00e4nsen (${fmtKr(SKIKTGRANS_STATLIG)}) med ${fmtKr(Math.abs(distToStatlig))} betalar du ${fmtKr(result.statligSkatt)} per \u00e5r i statlig inkomstskatt ut\u00f6ver kommunalskatten p\u00e5 ${result.kommunalskattRateUsed}%.`;
  }

  // L\u00e4gg till j\u00e4mf\u00f6relse med angr\u00e4nsande l\u00f6ner
  paragraph += ` J\u00e4mf\u00f6rt med en l\u00f6n p\u00e5 ${fmtKr(prevAmount > 0 ? prevAmount : amount)} ger ${fmtKr(amount)} dig ${fmtKr(diffFromPrev)} mer i nettol\u00f6n varje m\u00e5nad. En l\u00f6ne\u00f6kning till ${fmtKr(nextAmount)} skulle ge ytterligare ${fmtKr(diffToNext)} netto per m\u00e5nad, det vill s\u00e4ga ${fmtKr(diffToNext * 12)} mer per \u00e5r.`;

  return paragraph;
}

export function getCareerDescription(amount: number): string {
  const careers = CAREER_MAP[amount] || ['tj\u00e4nsteman', 'specialist', 'handl\u00e4ggare', 'konsult', 'koordinator'];
  const vi = variationIndex(amount);
  const sv = secondaryVariation(amount);
  const marketInsight = MARKET_INSIGHTS[amount] || '';

  const templates = [
    `En bruttol\u00f6n p\u00e5 ${fmtKr(amount)} \u00e4r typisk f\u00f6r yrken som ${careers[0]}, ${careers[1]} och ${careers[2]}. Dessa roller kr\u00e4ver ofta ${sv === 0 ? 'relevant h\u00f6gskoleutbildning' : sv === 1 ? 'flera \u00e5rs yrkeserfarenhet' : sv === 2 ? 'specialistkompetens inom omr\u00e5det' : 'b\u00e5de formell utbildning och branschvana'} och befinner sig i en ${amount < 40000 ? 'tidig till medel' : amount < 60000 ? 'medel till \u00f6vre' : 'h\u00f6gre'} fas av karri\u00e4ren. ${marketInsight}`,

    `Bland de vanligaste yrkena med l\u00f6nel\u00e4ge kring ${fmtKr(amount)} hittar vi ${careers[1]}, ${careers[2]} och ${careers[3]}. Dessa befattningar utg\u00f6r ${amount < 40000 ? 'en stor del av den svenska arbetsmarknaden' : amount < 60000 ? 'kvalificerade specialistroller' : 'ledande positioner i organisationer'} och l\u00f6nen speglar ${sv === 0 ? 'ansvarsniv\u00e5n' : sv === 1 ? 'kompetenskraven' : sv === 2 ? 'marknadens efterfr\u00e5gan' : 'erfarenheten som kr\u00e4vs'}. ${marketInsight}`,

    `Vid l\u00f6neniv\u00e5n ${fmtKr(amount)} befinner sig yrkesgrupper som ${careers[0]}, ${careers[3]} och ${careers[4]}. Denna inkomstniv\u00e5 representerar ${amount < 35000 ? 'instegsl\u00f6ner och juniora positioner' : amount < 50000 ? 'erfarna yrkesut\u00f6vare och mellanchefer' : 'seniora specialister och h\u00f6gre chefstj\u00e4nster'} p\u00e5 den svenska arbetsmarknaden. ${marketInsight}`,

    `Typiska befattningar med en m\u00e5nadsl\u00f6n p\u00e5 ${fmtKr(amount)} inkluderar ${careers[2]}, ${careers[4]} och ${careers[0]}. Arbetsmarknaden f\u00f6r dessa roller \u00e4r ${amount < 35000 ? 'bred med m\u00e5nga arbetsgivare' : amount < 50000 ? 'konkurrenskraftig med goda karri\u00e4rm\u00f6jligheter' : 'specialiserad med h\u00f6ga intr\u00e4deskrav'}, och l\u00f6nen p\u00e5verkas av ${sv === 0 ? 'geografiskt l\u00e4ge' : sv === 1 ? 'bransch och f\u00f6retagsstorlek' : sv === 2 ? '\u00e5r av erfarenhet' : 'certifieringar och specialisering'}. ${marketInsight}`,

    `Med en bruttol\u00f6n p\u00e5 ${fmtKr(amount)} tillh\u00f6r du samma l\u00f6negrupp som ${careers[3]}, ${careers[1]} och ${careers[4]}. Det \u00e4r en inkomstniv\u00e5 d\u00e4r ${amount < 40000 ? 'de flesta har 2\u20135 \u00e5rs erfarenhet' : amount < 60000 ? 'man ofta har 5\u201310 \u00e5rs erfarenhet och viss ledarroll' : 'h\u00f6g kompetens och strategiskt ansvar \u00e4r norm'}. L\u00f6nesamtalet fokuserar vanligtvis p\u00e5 ${sv === 0 ? 'resultat och m\u00e5luppfyllelse' : sv === 1 ? 'ansvarsomr\u00e5dets ut\u00f6kning' : sv === 2 ? 'marknadsanpassning' : 'kompetensutveckling och ledarskap'}. ${marketInsight}`,
  ];

  return templates[vi];
}

export function getTaxTips(amount: number, result: TaxResult): string {
  const vi = variationIndex(amount);
  const sv = secondaryVariation(amount);
  const annualGross = amount * 12;
  const taxableIncome = result.taxableIncome;
  const distToStatlig = SKIKTGRANS_STATLIG - taxableIncome;

  // Ber\u00e4kna specifik r\u00e5dgivning
  const maxPensionSaving = Math.min(amount * 0.04, 5000);
  const pensionTaxSaving = Math.round(maxPensionSaving * 12 * (result.kommunalskattRateUsed / 100));
  const rutAvdragMax = Math.min(75000, annualGross * 0.5);
  const rotAvdragMax = Math.min(50000, annualGross * 0.5);

  let tips = '';

  if (distToStatlig > 0 && distToStatlig < 100000) {
    const extraPerMonth = Math.round(distToStatlig / 12);
    tips += `Vid din l\u00f6neniv\u00e5 p\u00e5 ${fmtKr(amount)} ligger du ${fmtKr(distToStatlig)} under skiktgr\u00e4nsen f\u00f6r statlig skatt. Det inneb\u00e4r att en l\u00f6ne\u00f6kning p\u00e5 mer \u00e4n ${fmtKr(extraPerMonth)} per m\u00e5nad (f\u00f6re grundavdrag) skulle medf\u00f6ra 20 procentenheter h\u00f6gre marginalskatt. \u00d6verv\u00e4g att omvandla del av bruttol\u00f6nen till pensionsavs\u00e4ttning f\u00f6r att undvika statlig skatt \u2014 det kan spara dig ${fmtKr(pensionTaxSaving)} per \u00e5r.`;
  } else if (distToStatlig > 0) {
    tips += `Med ${fmtKr(amount)} i bruttol\u00f6n betalar du enbart kommunalskatt p\u00e5 ${result.kommunalskattRateUsed}%. Du har ${fmtKr(distToStatlig)} kvar till skiktgr\u00e4nsen, s\u00e5 din marginalskatt \u00e4r l\u00e4gre \u00e4n f\u00f6r h\u00f6ginkomsttagare. Din effektiva skattesats p\u00e5 ${result.effectiveTaxRate.toFixed(1)}% \u00e4r f\u00f6rh\u00e5llandevis l\u00e5g tack vare jobbskatteavdraget p\u00e5 ${fmtKr(result.jobbskatteavdrag)}.`;
  } else {
    const statligPerMonth = Math.round(result.statligSkatt / 12);
    tips += `Din l\u00f6n p\u00e5 ${fmtKr(amount)} g\u00f6r att du betalar ${fmtKr(result.statligSkatt)} per \u00e5r (${fmtKr(statligPerMonth)}/m\u00e5n) i statlig inkomstskatt. Genom bruttol\u00f6nev\u00e4xling till pension kan du spara upp till ${fmtKr(pensionTaxSaving)} per \u00e5r i skatt. Marginalskatten p\u00e5 ${result.marginalTaxRate.toFixed(1)}% g\u00f6r att varje sparad krona \u00e4r extra v\u00e4rdefull.`;
  }

  const rutTips = [
    ` Utnyttja RUT-avdraget: vid din inkomst p\u00e5 ${fmtKr(amount)} kan du f\u00e5 upp till ${fmtKr(rutAvdragMax)} i \u00e5rligt avdrag f\u00f6r hush\u00e5llstj\u00e4nster. Det motsvarar halva kostnaden f\u00f6r st\u00e4dning, tr\u00e4dg\u00e5rdsarbete eller barnpassning. Kombinerat med ROT-avdrag (max ${fmtKr(rotAvdragMax)}) f\u00f6r renoveringar kan du s\u00e4nka din skatt ytterligare.`,
    ` Vid ${fmtKr(amount)} brutto har du utrymme f\u00f6r RUT-avdrag p\u00e5 upp till ${fmtKr(rutAvdragMax)} per \u00e5r. Anv\u00e4nd det f\u00f6r att s\u00e4nka din skatt genom att k\u00f6pa hush\u00e5llstj\u00e4nster som st\u00e4dning eller f\u00f6nsterputsning. ROT-avdraget p\u00e5 max ${fmtKr(rotAvdragMax)} g\u00e4ller f\u00f6r renovering och reparation av bostaden.`,
    ` F\u00f6r dig med ${fmtKr(amount)} i l\u00f6n \u00e4r RUT-avdraget en effektiv skattereduktion. Du f\u00e5r tillbaka 50% av arbetskostnaden f\u00f6r hush\u00e5llstj\u00e4nster, upp till ${fmtKr(rutAvdragMax)} per \u00e5r. P\u00e5 s\u00e5 vis sparar du reellt ${fmtKr(Math.round(rutAvdragMax / 2))} \u00e5rligen om du nyttjar avdraget fullt ut.`,
    ` Med en \u00e5rsinkomst p\u00e5 ${fmtKr(annualGross)} kvalificerar du dig f\u00f6r ${fmtKr(rutAvdragMax)} i RUT-avdrag. Tj\u00e4nster som hemst\u00e4dning, flytt och TV-montering ger 50% skattereduktion. Det sänker din reella \u00e5rsskatt fr\u00e5n ${fmtKr(result.totalSkatt)} till s\u00e5 l\u00e5gt som ${fmtKr(Math.max(0, result.totalSkatt - rutAvdragMax))}.`,
    ` Gl\u00f6m inte att ditt jobbskatteavdrag p\u00e5 ${fmtKr(result.jobbskatteavdrag)} redan s\u00e4nker din skatt avsev\u00e4rt vid ${fmtKr(amount)} i l\u00f6n. Kombinera detta med RUT-avdrag (max ${fmtKr(rutAvdragMax)}/\u00e5r) f\u00f6r maximal skatteoptimering. Det g\u00f6r att din verkliga skattebörda kan s\u00e4nkas till under ${Math.max(0, result.effectiveTaxRate - 3).toFixed(0)}% effektivt.`,
  ];

  tips += rutTips[vi];

  // L\u00e4gg till extra sparr\u00e5d baserat p\u00e5 inkomstniv\u00e5
  const savingsTips = [
    ` \u00d6verv\u00e4g \u00e4ven att \u00f6ppna ett ISK-konto d\u00e4r avkastning schablonbeskattas. Vid din inkomst p\u00e5 ${fmtKr(amount)} \u00e4r ISK f\u00f6rdelaktigt j\u00e4mf\u00f6rt med kapitalinkomstbeskattning p\u00e5 30% om din f\u00f6rv\u00e4ntade avkastning \u00f6verstiger schablonavkastningen.`,
    ` T\u00e4nk p\u00e5 att privat pensionssparande (IPS) inte l\u00e4ngre ger avdragsr\u00e4tt, men tj\u00e4nstepensionsavsättningar minskar din beskattningsbara inkomst direkt. Vid ${fmtKr(amount)} kan detta vara ett smartare alternativ \u00e4n direkt l\u00f6ne\u00f6kning.`,
    ` En kapital\u00f6rs\u00e4kring (KF) kan vara intressant vid din inkomstniv\u00e5 p\u00e5 ${fmtKr(amount)} eftersom vinster inte beskattas l\u00f6pande. Schablonskatten ber\u00e4knas p\u00e5 v\u00e4rdet, inte p\u00e5 vinsten.`,
    ` Vid din bruttol\u00f6n p\u00e5 ${fmtKr(amount)} kan \u00e4ven g\u00e5vor till godk\u00e4nda organisationer ge skattereduktion. Maxavdraget \u00e4r 1 500 kr per \u00e5r, vilket s\u00e4nker din slutliga skatt fr\u00e5n ${fmtKr(result.totalSkatt)} till ${fmtKr(result.totalSkatt - 1500)}.`,
    ` Notera att vid ${fmtKr(amount)} brutto \u00e4r din allm\u00e4nna pensionsavgift ${fmtKr(result.pensionsavgift)} per \u00e5r. Hela denna avgift ges tillbaka som skattereduktion, s\u00e5 den p\u00e5verkar inte din slutliga nettol\u00f6n negativt.`,
  ];

  tips += savingsTips[sv];

  return tips;
}

export function buildFaqs(amount: number, result: TaxResult): { question: string; answer: string }[] {
  const formattedAmount = fmt(amount);
  const annualGross = amount * 12;
  const prevAmount = amount - 5000;
  const nextAmount = amount + 5000;
  const prevResult = prevAmount > 0 ? calculateTakeHome({ monthlyGross: prevAmount }) : null;
  const nextResult = calculateTakeHome({ monthlyGross: nextAmount });
  const dailyNet = Math.round(result.netMonthly / 21);
  const hourlyNet = Math.round(result.netMonthly / 168);
  const employerCost = Math.round(amount * (1 + ARBETSGIVARAVGIFT_RATE));

  return [
    {
      question: `Vad blir nettol\u00f6nen p\u00e5 ${formattedAmount} kr i bruttol\u00f6n 2026?`,
      answer: `Med en bruttol\u00f6n p\u00e5 ${formattedAmount} kr per m\u00e5nad och genomsnittlig kommunalskatt (${DEFAULT_KOMMUNALSKATT}%) blir din nettol\u00f6n ungef\u00e4r ${fmtKr(result.netMonthly)} per m\u00e5nad. Per \u00e5r inneb\u00e4r det ${fmtKr(result.netAnnual)} netto av ${fmtKr(annualGross)} brutto. Din effektiva skattesats blir ${result.effectiveTaxRate.toFixed(1)}%. Arbetsgivarens totalkostnad \u00e4r ${fmtKr(employerCost)} per m\u00e5nad inklusive arbetsgivaravgifter.`,
    },
    {
      question: `Hur mycket skatt betalar man p\u00e5 ${formattedAmount} kr i m\u00e5nadsl\u00f6n?`,
      answer: `P\u00e5 ${formattedAmount} kr brutto per m\u00e5nad betalar du totalt ${fmtKr(result.totalSkatt)} per \u00e5r i skatt, varav kommunalskatt ${fmtKr(result.kommunalskatt)}${result.statligSkatt > 0 ? ` och statlig skatt ${fmtKr(result.statligSkatt)}` : ''}. Per m\u00e5nad blir skatten cirka ${fmtKr(Math.round(result.totalSkatt / 12))}. Jobbskatteavdraget p\u00e5 ${fmtKr(result.jobbskatteavdrag)} och pensionsavgiftsreduktionen p\u00e5 ${fmtKr(result.pensionsavgiftReduktion)} minskar din slutliga skattebörda.`,
    },
    {
      question: `Vad \u00e4r marginalskatten vid ${formattedAmount} kr i l\u00f6n?`,
      answer: `Vid en bruttol\u00f6n p\u00e5 ${formattedAmount} kr \u00e4r din marginalskatt cirka ${result.marginalTaxRate.toFixed(1)}%. Det inneb\u00e4r att om du f\u00e5r 1 000 kr mer i bruttol\u00f6n beh\u00e5ller du ungef\u00e4r ${fmtKr(Math.round(1000 * (1 - result.marginalTaxRate / 100)))} efter skatt. ${result.statligSkatt > 0 ? `Marginalskatten inkluderar 20% statlig skatt d\u00e5 du \u00f6verstiger skiktgr\u00e4nsen p\u00e5 ${fmtKr(SKIKTGRANS_STATLIG)}.` : `Du betalar ingen statlig skatt s\u00e5 marginalskatten best\u00e5r enbart av kommunalskatt (${result.kommunalskattRateUsed}%) och begravningsavgift.`}`,
    },
    {
      question: `Hur mycket mer f\u00e5r man ut med ${formattedAmount} kr j\u00e4mf\u00f6rt med ${fmt(prevAmount > 0 ? prevAmount : amount - 1000)} kr?`,
      answer: prevResult
        ? `Skillnaden i nettol\u00f6n mellan ${fmtKr(prevAmount)} och ${fmtKr(amount)} brutto \u00e4r ${fmtKr(result.netMonthly - prevResult.netMonthly)} per m\u00e5nad. P\u00e5 ett \u00e5r blir det ${fmtKr(result.netAnnual - prevResult.netAnnual)} mer i plånboken. Effektiva skattesatsen g\u00e5r fr\u00e5n ${prevResult.effectiveTaxRate.toFixed(1)}% till ${result.effectiveTaxRate.toFixed(1)}%. Det inneb\u00e4r att av l\u00f6ne\u00f6kningen p\u00e5 ${fmtKr(5000)} beh\u00e5ller du ${fmtKr(result.netMonthly - prevResult.netMonthly)} netto.`
        : `Vid ${fmtKr(amount)} brutto f\u00e5r du ${fmtKr(result.netMonthly)} netto. En l\u00f6ne\u00f6kning p\u00e5 1 000 kr ger dig cirka ${fmtKr(Math.round(1000 * (1 - result.marginalTaxRate / 100)))} extra netto per m\u00e5nad.`,
    },
    {
      question: `Vad \u00e4r timl\u00f6nen netto vid ${formattedAmount} kr i m\u00e5nadsl\u00f6n?`,
      answer: `Med ${formattedAmount} kr brutto per m\u00e5nad och heltidsarbete (168 timmar/m\u00e5nad) blir din nettotiml\u00f6n ungef\u00e4r ${fmtKr(hourlyNet)}. Per arbetsdag (8 timmar) inneb\u00e4r det ${fmtKr(dailyNet)} efter skatt. P\u00e5 en hel arbetsvecka f\u00e5r du ut cirka ${fmtKr(result.netWeekly)}. Den faktiska bruttotiml\u00f6nen \u00e4r ${fmtKr(Math.round(amount / 168))} f\u00f6re skatt.`,
    },
    {
      question: `L\u00f6nar sig en l\u00f6ne\u00f6kning fr\u00e5n ${formattedAmount} kr till ${fmt(nextAmount)} kr?`,
      answer: `En h\u00f6jning fr\u00e5n ${fmtKr(amount)} till ${fmtKr(nextAmount)} brutto ger dig ${fmtKr(nextResult.netMonthly - result.netMonthly)} mer netto per m\u00e5nad. P\u00e5 \u00e5rsbasis inneb\u00e4r det ${fmtKr(nextResult.netAnnual - result.netAnnual)} extra. Marginalskatten vid ${fmtKr(nextAmount)} \u00e4r ${nextResult.marginalTaxRate.toFixed(1)}%, s\u00e5 av varje extra krona beh\u00e5ller du ${(100 - nextResult.marginalTaxRate).toFixed(0)} \u00f6re. Effektiva skattesatsen \u00f6kar fr\u00e5n ${result.effectiveTaxRate.toFixed(1)}% till ${nextResult.effectiveTaxRate.toFixed(1)}%.`,
    },
  ];
}

export function getRaiseSimulation(amount: number, result: TaxResult): string {
  const raise5 = Math.round(amount * 1.05);
  const raise10 = Math.round(amount * 1.10);
  const raise15 = Math.round(amount * 1.15);
  const result5 = calculateTakeHome({ monthlyGross: raise5 });
  const result10 = calculateTakeHome({ monthlyGross: raise10 });
  const result15 = calculateTakeHome({ monthlyGross: raise15 });

  const netDiff5 = result5.netMonthly - result.netMonthly;
  const netDiff10 = result10.netMonthly - result.netMonthly;
  const netDiff15 = result15.netMonthly - result.netMonthly;
  const annualDiff5 = result5.netAnnual - result.netAnnual;
  const annualDiff10 = result10.netAnnual - result.netAnnual;
  const annualDiff15 = result15.netAnnual - result.netAnnual;

  const vi = variationIndex(amount);

  const intros = [
    `L\u00e5t oss simulera vad en l\u00f6ne\u00f6kning fr\u00e5n ${fmtKr(amount)} skulle inneb\u00e4ra i praktiken f\u00f6r din ekonomi.`,
    `H\u00e4r ser du exakt vad en h\u00f6jning fr\u00e5n din nuvarande l\u00f6n p\u00e5 ${fmtKr(amount)} ger netto efter skatt.`,
    `Vid n\u00e4sta l\u00f6nesamtal \u00e4r det v\u00e4rdefullt att veta vad en h\u00f6jning fr\u00e5n ${fmtKr(amount)} faktiskt inneb\u00e4r i fickan.`,
    `M\u00e5nga undrar vad en l\u00f6ne\u00f6kning egentligen ger i pl\u00e5nboken. H\u00e4r \u00e4r de exakta siffrorna f\u00f6r dig med ${fmtKr(amount)} brutto.`,
    `S\u00e5 h\u00e4r p\u00e5verkas din m\u00e5nadsekonomi av en l\u00f6neh\u00f6jning fr\u00e5n ${fmtKr(amount)} brutto per m\u00e5nad.`,
  ];

  let text = intros[vi];

  text += ` En 5-procentig h\u00f6jning tar din bruttol\u00f6n fr\u00e5n ${fmtKr(amount)} till ${fmtKr(raise5)}. Din nettol\u00f6n \u00f6kar d\u00e5 med ${fmtKr(netDiff5)} per m\u00e5nad (fr\u00e5n ${fmtKr(result.netMonthly)} till ${fmtKr(result5.netMonthly)}). P\u00e5 \u00e5rsbasis inneb\u00e4r det ${fmtKr(annualDiff5)} mer att spendera eller spara.`;

  text += ` Med en 10-procentig h\u00f6jning n\u00e5r du ${fmtKr(raise10)} brutto, vilket ger ${fmtKr(result10.netMonthly)} netto \u2014 en \u00f6kning p\u00e5 ${fmtKr(netDiff10)} per m\u00e5nad och ${fmtKr(annualDiff10)} per \u00e5r.`;

  text += ` G\u00e5r du \u00e4nda till +15% (${fmtKr(raise15)} brutto) f\u00e5r du ut ${fmtKr(result15.netMonthly)} netto, en m\u00e5natlig \u00f6kning p\u00e5 ${fmtKr(netDiff15)} fr\u00e5n nuvarande ${fmtKr(result.netMonthly)}, totalt ${fmtKr(annualDiff15)} extra per \u00e5r.`;

  // Effektivitetsanalys
  const efficiency5 = Math.round((netDiff5 / (raise5 - amount)) * 100);
  const efficiency10 = Math.round((netDiff10 / (raise10 - amount)) * 100);

  text += ` Av varje extra bruttokrona beh\u00e5ller du ${efficiency5} \u00f6re vid +5% och ${efficiency10} \u00f6re vid +10%. ${efficiency5 < 70 ? `Den relativt l\u00e5ga effektiviteten beror p\u00e5 att du betalar b\u00e5de kommunal och statlig skatt vid denna inkomstniv\u00e5.` : `Den goda effektiviteten beror p\u00e5 att du inte betalar statlig inkomstskatt vid denna l\u00f6neniv\u00e5.`}`;

  return text;
}

export function getBudgetBreakdown(netMonthly: number, amount: number): string {
  const vi = variationIndex(amount);
  const tv = tertiaryVariation(amount);

  // Anpassa procentsatser baserat p\u00e5 inkomstniv\u00e5
  let housing: number, food: number, transport: number, savings: number, leisure: number, other: number;

  if (netMonthly < 22000) {
    housing = 0.40; food = 0.18; transport = 0.10; savings = 0.05; leisure = 0.12; other = 0.15;
  } else if (netMonthly < 30000) {
    housing = 0.35; food = 0.15; transport = 0.10; savings = 0.10; leisure = 0.14; other = 0.16;
  } else if (netMonthly < 40000) {
    housing = 0.30; food = 0.13; transport = 0.09; savings = 0.15; leisure = 0.15; other = 0.18;
  } else if (netMonthly < 55000) {
    housing = 0.27; food = 0.11; transport = 0.08; savings = 0.20; leisure = 0.14; other = 0.20;
  } else {
    housing = 0.24; food = 0.09; transport = 0.07; savings = 0.28; leisure = 0.12; other = 0.20;
  }

  const housingKr = Math.round(netMonthly * housing);
  const foodKr = Math.round(netMonthly * food);
  const transportKr = Math.round(netMonthly * transport);
  const savingsKr = Math.round(netMonthly * savings);
  const leisureKr = Math.round(netMonthly * leisure);
  const otherKr = Math.round(netMonthly * other);

  const intros = [
    `Med en nettol\u00f6n p\u00e5 ${fmtKr(netMonthly)} per m\u00e5nad kan en rimlig budgetf\u00f6rdelning se ut s\u00e5 h\u00e4r:`,
    `S\u00e5 h\u00e4r kan du f\u00f6rdela dina ${fmtKr(netMonthly)} netto varje m\u00e5nad f\u00f6r en balanserad ekonomi:`,
    `En rekommenderad m\u00e5nadsbudget vid ${fmtKr(netMonthly)} i nettoinkomst f\u00f6rdelar sig enligt f\u00f6ljande:`,
    `F\u00f6r dig som f\u00e5r ut ${fmtKr(netMonthly)} efter skatt f\u00f6resl\u00e5r vi denna budgetuppdelning:`,
    `H\u00e4r \u00e4r ett budgetf\u00f6rslag anpassat till din nettol\u00f6n p\u00e5 ${fmtKr(netMonthly)} (bruttol\u00f6n ${fmtKr(amount)}):`,
  ];

  let text = intros[vi];

  text += ` Boende: ${fmtKr(housingKr)} (${Math.round(housing * 100)}%).`;
  text += ` Livsmedel: ${fmtKr(foodKr)} (${Math.round(food * 100)}%).`;
  text += ` Transport: ${fmtKr(transportKr)} (${Math.round(transport * 100)}%).`;
  text += ` Sparande och investeringar: ${fmtKr(savingsKr)} (${Math.round(savings * 100)}%).`;
  text += ` N\u00f6jen och fritid: ${fmtKr(leisureKr)} (${Math.round(leisure * 100)}%).`;
  text += ` \u00d6vrigt (kl\u00e4der, f\u00f6rs\u00e4kringar, of\u00f6rutsett): ${fmtKr(otherKr)} (${Math.round(other * 100)}%).`;

  // Sparr\u00e5d specifikt f\u00f6r niv\u00e5n
  if (netMonthly < 25000) {
    text += ` Vid denna inkomstniv\u00e5 \u00e4r det viktigast att bygga ett buffertsparande p\u00e5 minst ${fmtKr(netMonthly * 3)} (tre m\u00e5naders nettol\u00f6n) innan du b\u00f6rjar med l\u00e5ngsiktigt sparande. Med ${fmtKr(savingsKr)} per m\u00e5nad tar det ${Math.ceil((netMonthly * 3) / savingsKr)} m\u00e5nader att n\u00e5 den bufferten.`;
  } else if (netMonthly < 35000) {
    text += ` Med ${fmtKr(netMonthly)} i nettol\u00f6n b\u00f6r du prioritera att spara ${fmtKr(savingsKr)} per m\u00e5nad. P\u00e5 ett \u00e5r ger det ${fmtKr(savingsKr * 12)} i sparkapital. ${tv === 0 ? 'F\u00f6rdela idealt mellan buffertkonto och breda indexfonder f\u00f6r l\u00e5ngsiktig tillv\u00e4xt.' : tv === 1 ? 'Ett ISK-konto med global indexfond \u00e4r ofta det mest skatteeffektiva valet vid din inkomst.' : 'Satsa p\u00e5 att f\u00f6rst fylla en buffert p\u00e5 tre m\u00e5nadsl\u00f6ner, sedan investera resten.'}`;
  } else if (netMonthly < 50000) {
    text += ` Din nettol\u00f6n p\u00e5 ${fmtKr(netMonthly)} ger goda sparaf\u00f6ruts\u00e4ttningar. Med ${fmtKr(savingsKr)} per m\u00e5nad n\u00e5r du ${fmtKr(savingsKr * 12)} p\u00e5 ett \u00e5r. ${tv === 0 ? '\u00d6verv\u00e4g att f\u00f6rdela mellan ISK (aktier/fonder), tj\u00e4nstepension och privat pensionssparande.' : tv === 1 ? 'En bra strategi \u00e4r 60% indexfonder, 20% r\u00e4ntefonder och 20% buffert vid din inkomstniv\u00e5.' : 'Vid denna l\u00f6n kan du \u00e4ven \u00f6verv\u00e4ga extra amortering p\u00e5 bol\u00e5n som en form av sparande.'}`;
  } else {
    text += ` Med en nettol\u00f6n p\u00e5 ${fmtKr(netMonthly)} b\u00f6r sparandet p\u00e5 ${fmtKr(savingsKr)} per m\u00e5nad diversifieras. ${tv === 0 ? 'ISK f\u00f6r l\u00e5ngsiktigt sparande, KF (kapital\u00f6rs\u00e4kring) f\u00f6r skatteplanering, och eventuellt direkt fastighetsexponering genom REITs eller bostadsk\u00f6.' : tv === 1 ? 'En portf\u00f6lj med 50% globala aktier, 20% svenska fastighetsaktier, 15% r\u00e4ntor och 15% alternativa investeringar passar din riskprofil.' : 'Vid denna inkomstniv\u00e5 kan det vara v\u00e4rt att anlita en oberoende finansiell r\u00e5dgivare f\u00f6r att optimera sparande och skatt.'}`;
  }

  return text;
}

export function getUniqueComparisons(amount: number, result: TaxResult): string {
  const prev1 = amount - 1000;
  const prev5 = amount - 5000;
  const next1 = amount + 1000;
  const next5 = amount + 5000;
  const next10 = amount + 10000;

  const rPrev1 = calculateTakeHome({ monthlyGross: prev1 > 0 ? prev1 : 1000 });
  const rPrev5 = calculateTakeHome({ monthlyGross: prev5 > 0 ? prev5 : 1000 });
  const rNext1 = calculateTakeHome({ monthlyGross: next1 });
  const rNext5 = calculateTakeHome({ monthlyGross: next5 });
  const rNext10 = calculateTakeHome({ monthlyGross: next10 });

  const vi = variationIndex(amount);

  const intros = [
    `F\u00f6r att s\u00e4tta din l\u00f6n p\u00e5 ${fmtKr(amount)} i perspektiv \u2014 h\u00e4r \u00e4r en detaljerad j\u00e4mf\u00f6relse med n\u00e4rliggande l\u00f6neniv\u00e5er:`,
    `S\u00e5 h\u00e4r f\u00f6rh\u00e5ller sig ${fmtKr(amount)} i bruttol\u00f6n j\u00e4mf\u00f6rt med angr\u00e4nsande belopp efter skatt:`,
    `En j\u00e4mf\u00f6relse visar hur ${fmtKr(amount)} brutto st\u00e5r sig mot andra l\u00f6neniv\u00e5er i det svenska skattesystemet:`,
    `H\u00e4r ser du den exakta nettoskillnaden mellan ${fmtKr(amount)} och n\u00e4rliggande l\u00f6nebelopp f\u00f6r 2026:`,
    `L\u00e5t oss j\u00e4mf\u00f6ra din bruttol\u00f6n p\u00e5 ${fmtKr(amount)} med l\u00f6ner strax under och \u00f6ver din niv\u00e5:`,
  ];

  let text = intros[vi];

  if (prev1 > 0) {
    text += ` J\u00e4mf\u00f6rt med ${fmtKr(prev1)} brutto: din nettol\u00f6n p\u00e5 ${fmtKr(result.netMonthly)} \u00e4r ${fmtKr(result.netMonthly - rPrev1.netMonthly)} h\u00f6gre per m\u00e5nad (${fmtKr((result.netMonthly - rPrev1.netMonthly) * 12)} per \u00e5r).`;
  }
  if (prev5 > 0) {
    text += ` J\u00e4mf\u00f6rt med ${fmtKr(prev5)} brutto: nettoskillnaden \u00e4r ${fmtKr(result.netMonthly - rPrev5.netMonthly)} per m\u00e5nad (${fmtKr(result.netAnnual - rPrev5.netAnnual)} per \u00e5r). Av bruttoh\u00f6jningen p\u00e5 ${fmtKr(5000)} beh\u00e5ller du ${Math.round(((result.netMonthly - rPrev5.netMonthly) / 5000) * 100)}% netto.`;
  }

  text += ` J\u00e4mf\u00f6rt med ${fmtKr(next1)} brutto: den som tj\u00e4nar 1 000 kr mer brutto f\u00e5r ${fmtKr(rNext1.netMonthly - result.netMonthly)} mer netto per m\u00e5nad.`;
  text += ` J\u00e4mf\u00f6rt med ${fmtKr(next5)} brutto: nettoskillnaden \u00e4r ${fmtKr(rNext5.netMonthly - result.netMonthly)} per m\u00e5nad, och effektiva skattesatsen g\u00e5r fr\u00e5n ${result.effectiveTaxRate.toFixed(1)}% till ${rNext5.effectiveTaxRate.toFixed(1)}%.`;
  text += ` J\u00e4mf\u00f6rt med ${fmtKr(next10)} brutto: hela ${fmtKr(rNext10.netMonthly - result.netMonthly)} mer netto per m\u00e5nad, ${fmtKr((rNext10.netAnnual - result.netAnnual))} extra \u00e5rligen.`;

  // J\u00e4mf\u00f6relse med medianen
  const medianResult = calculateTakeHome({ monthlyGross: MEDIAN_SALARY });
  const diffFromMedian = result.netMonthly - medianResult.netMonthly;

  if (diffFromMedian > 0) {
    text += ` Din l\u00f6n p\u00e5 ${fmtKr(amount)} ger ${fmtKr(diffFromMedian)} mer netto per m\u00e5nad \u00e4n medianl\u00f6nen (${fmtKr(MEDIAN_SALARY)}), vilket motsvarar ${fmtKr(diffFromMedian * 12)} extra per \u00e5r. I procent \u00e4r din nettol\u00f6n ${Math.round((result.netMonthly / medianResult.netMonthly - 1) * 100)}% h\u00f6gre \u00e4n mediannettol\u00f6nen.`;
  } else if (diffFromMedian < 0) {
    text += ` Din l\u00f6n p\u00e5 ${fmtKr(amount)} ger ${fmtKr(Math.abs(diffFromMedian))} mindre netto per m\u00e5nad \u00e4n medianl\u00f6nen (${fmtKr(MEDIAN_SALARY)}). F\u00f6r att n\u00e5 mediannettol\u00f6nen p\u00e5 ${fmtKr(medianResult.netMonthly)} beh\u00f6ver du en bruttol\u00f6ne\u00f6kning p\u00e5 ${fmtKr(MEDIAN_SALARY - amount)}.`;
  } else {
    text += ` Din l\u00f6n p\u00e5 ${fmtKr(amount)} ligger exakt p\u00e5 medianl\u00f6nen f\u00f6r Sverige med en nettol\u00f6n p\u00e5 ${fmtKr(result.netMonthly)}.`;
  }

  return text;
}

export function getEmployerCostBreakdown(amount: number, result: TaxResult): string {
  const vi = variationIndex(amount);
  const arbetsgivaravgift = Math.round(amount * ARBETSGIVARAVGIFT_RATE);
  const totalEmployerCost = amount + arbetsgivaravgift;
  const totalEmployerCostAnnual = totalEmployerCost * 12;
  const semesterersattning = Math.round(amount * 0.12);
  const fullCostWithHoliday = totalEmployerCost + semesterersattning;

  // Uppdelning av arbetsgivaravgiften
  const alderspension = Math.round(amount * 0.1021);
  const sjukforsakring = Math.round(amount * 0.0355);
  const foraldraforsakring = Math.round(amount * 0.0260);
  const arbetsmarknad = Math.round(amount * 0.0266);
  const overigt = arbetsgivaravgift - alderspension - sjukforsakring - foraldraforsakring - arbetsmarknad;

  const intros = [
    `N\u00e4r din arbetsgivare betalar dig ${fmtKr(amount)} i bruttol\u00f6n \u00e4r den faktiska personalkostnaden betydligt h\u00f6gre.`,
    `Ut\u00f6ver din bruttol\u00f6n p\u00e5 ${fmtKr(amount)} betalar din arbetsgivare ocks\u00e5 arbetsgivaravgifter p\u00e5 ${ARBETSGIVARAVGIFT_RATE * 100}%.`,
    `Den totala kostnaden f\u00f6r att anst\u00e4lla dig vid ${fmtKr(amount)} i m\u00e5nadsl\u00f6n \u00e4r mer \u00e4n vad l\u00f6nebeskedet visar.`,
    `F\u00f6r att f\u00f6rst\u00e5 den fulla bilden vid ${fmtKr(amount)} brutto beh\u00f6ver vi r\u00e4kna in arbetsgivarens kostnader.`,
    `S\u00e5 h\u00e4r ser den totala arbetskraftskostnaden ut n\u00e4r du tj\u00e4nar ${fmtKr(amount)} i bruttol\u00f6n:`,
  ];

  let text = intros[vi];

  text += ` Arbetsgivaravgiften uppg\u00e5r till ${fmtKr(arbetsgivaravgift)} per m\u00e5nad (${(ARBETSGIVARAVGIFT_RATE * 100).toFixed(2)}% av bruttol\u00f6nen).`;
  text += ` Det inneb\u00e4r att den totala m\u00e5nadskostnaden f\u00f6r arbetsgivaren \u00e4r ${fmtKr(totalEmployerCost)}, eller ${fmtKr(totalEmployerCostAnnual)} per \u00e5r.`;
  text += ` Av din arbetsgivares kostnad p\u00e5 ${fmtKr(totalEmployerCost)} landar ${fmtKr(result.netMonthly)} p\u00e5 ditt konto \u2014 det \u00e4r ${Math.round((result.netMonthly / totalEmployerCost) * 100)}% av totalkostnaden.`;

  text += ` Arbetsgivaravgiften f\u00f6rdelar sig p\u00e5: \u00e5lderspension ${fmtKr(alderspension)}, sjukf\u00f6rs\u00e4kring ${fmtKr(sjukforsakring)}, f\u00f6r\u00e4ldraf\u00f6rs\u00e4kring ${fmtKr(foraldraforsakring)}, arbetsmarknadsavgift ${fmtKr(arbetsmarknad)} och \u00f6vrigt ${fmtKr(overigt)}.`;

  text += ` Med semesterers\u00e4ttning (12%) tillkommer ytterligare ${fmtKr(semesterersattning)}, vilket ger en total personalkostnad p\u00e5 ungef\u00e4r ${fmtKr(fullCostWithHoliday)} per m\u00e5nad.`;

  return text;
}

export function getAnnualTimeline(amount: number, result: TaxResult): string {
  const vi = variationIndex(amount);
  const annualGross = amount * 12;
  const monthlyNet = result.netMonthly;
  const annualNet = result.netAnnual;
  const semesterDagar = 25;
  const semesterersattning = Math.round(amount * 0.12);

  // Ber\u00e4kna milstolpar under \u00e5ret
  const firstQuarterNet = monthlyNet * 3;
  const halfYearNet = monthlyNet * 6;
  const skatteaterb = Math.round(result.jobbskatteavdrag * 0.3); // F\u00f6renklad uppskattning av \u00e5terb\u00e4ring

  const intros = [
    `S\u00e5 h\u00e4r ser ditt ekonomiska \u00e5r ut med ${fmtKr(amount)} i bruttol\u00f6n, fr\u00e5n januari till december:`,
    `En \u00e5rs\u00f6versikt f\u00f6r dig som tj\u00e4nar ${fmtKr(amount)} brutto per m\u00e5nad visar flera viktiga ekonomiska milstolpar:`,
    `Med en bruttol\u00f6n p\u00e5 ${fmtKr(amount)} per m\u00e5nad f\u00f6ljer ditt kassafl\u00f6de detta m\u00f6nster under \u00e5ret:`,
    `H\u00e4r \u00e4r din \u00e5rskalender f\u00f6r inkomst och skatt vid ${fmtKr(amount)} brutto m\u00e5nadsl\u00f6n:`,
    `L\u00e5t oss g\u00e5 igenom ditt ekonomiska \u00e5r vid en bruttol\u00f6n p\u00e5 ${fmtKr(amount)} kronor per m\u00e5nad:`,
  ];

  let text = intros[vi];

  text += ` Januari\u2013mars: Under f\u00f6rsta kvartalet tj\u00e4nar du ${fmtKr(firstQuarterNet)} netto (${fmtKr(amount * 3)} brutto). Du betalar cirka ${fmtKr(Math.round(result.totalSkatt / 4))} i skatt under dessa m\u00e5nader.`;

  text += ` April: Deklarationstid. Med din l\u00f6n p\u00e5 ${fmtKr(amount)} och korrekt skattetabell b\u00f6r din prelimin\u00e4rskatt st\u00e4mma v\u00e4l med slutskatten. ${skatteaterb > 0 ? `En eventuell \u00e5terb\u00e4ring landar troligen p\u00e5 kontot i april\u2013juni.` : 'Du b\u00f6r inte r\u00e4kna med n\u00e5gon st\u00f6rre \u00e5terb\u00e4ring om skattetabellen matchar din situation.'}`;

  text += ` Juni: Semesterperioden b\u00f6rjar. Med ${semesterDagar} semesterdagar och semestertill\u00e4gg f\u00e5r du ut ungef\u00e4r ${fmtKr(Math.round(monthlyNet * 1.12))} denna m\u00e5nad (inklusive semestertill\u00e4gg p\u00e5 0,8% per dag).`;

  text += ` Juli\u2013augusti: Under sommarm\u00e5naderna har du nu ackumulerat ${fmtKr(halfYearNet + monthlyNet * 2)} i nettoinkomst hittills under \u00e5ret.`;

  text += ` December: \u00c5rets sista l\u00f6n. Totalt under \u00e5ret har du f\u00e5tt ${fmtKr(annualNet)} netto av ${fmtKr(annualGross)} brutto. Sammanlagd betald skatt: ${fmtKr(result.totalSkatt)}.`;

  text += ` Under hela \u00e5ret har jobbskatteavdraget p\u00e5 ${fmtKr(result.jobbskatteavdrag)} och pensionsavgiftsreduktionen p\u00e5 ${fmtKr(result.pensionsavgiftReduktion)} s\u00e4nkt din skatt avsevärt j\u00e4mf\u00f6rt med l\u00e4nder utan motsvarande avdrag.`;

  return text;
}

export function getPurchasingPowerContext(amount: number, result: TaxResult): string {
  const vi = variationIndex(amount);
  const netMonthly = result.netMonthly;
  const netAnnual = result.netAnnual;

  // Ber\u00e4kna vad nettol\u00f6nen r\u00e4cker till i konkreta termer
  const hyraStockholm = 12500; // Genomsnittlig hyra 2-rum Stockholm
  const hyraRiket = 7500; // Genomsnittlig hyra rikssnitt
  const matPerPerson = 4000; // Livsmedel per person/m\u00e5nad
  const bensin = 2000; // Bensin/m\u00e5nad
  const elKostnad = 1500; // El per m\u00e5nad genomsnitt
  const mobilOchBredband = 700;

  const efterBoende = netMonthly - hyraStockholm;
  const efterBoendeRiket = netMonthly - hyraRiket;
  const sparutrymme = netMonthly - hyraRiket - matPerPerson - bensin - elKostnad - mobilOchBredband;

  // Bol\u00e5nekapacitet (f\u00f6renklad: 4.5x \u00e5rsinkomst brutto minus kalkylr\u00e4nta)
  const bolanKapacitet = Math.round(amount * 12 * 4.5);
  const bostadsvarde = Math.round(bolanKapacitet / 0.85); // 85% bel\u00e5ning

  const intros = [
    `Med en nettol\u00f6n p\u00e5 ${fmtKr(netMonthly)} fr\u00e5n din bruttol\u00f6n p\u00e5 ${fmtKr(amount)} \u2014 vad r\u00e4cker pengarna egentligen till i vardagen?`,
    `L\u00e5t oss s\u00e4tta din nettol\u00f6n p\u00e5 ${fmtKr(netMonthly)} (brutto ${fmtKr(amount)}) i relation till faktiska levnadskostnader i Sverige 2026.`,
    `H\u00e4r \u00e4r en realistisk bild av vad ${fmtKr(netMonthly)} netto per m\u00e5nad (fr\u00e5n ${fmtKr(amount)} brutto) inneb\u00e4r i k\u00f6pkraft:`,
    `Dina ${fmtKr(netMonthly)} i nettol\u00f6n fr\u00e5n ${fmtKr(amount)} brutto ger f\u00f6ljande ekonomiska utrymme:`,
    `Vad kan du g\u00f6ra med ${fmtKr(netMonthly)} netto per m\u00e5nad? S\u00e5 h\u00e4r ser verkligheten ut vid ${fmtKr(amount)} bruttol\u00f6n:`,
  ];

  let text = intros[vi];

  text += ` Boendekapacitet: I Stockholm (genomsnittshyra ${fmtKr(hyraStockholm)} f\u00f6r tv\u00e5rum) \u00e5terst\u00e5r ${fmtKr(efterBoende)} efter hyran. I \u00f6vriga landet (genomsnitt ${fmtKr(hyraRiket)}) beh\u00e5ller du ${fmtKr(efterBoendeRiket)} efter boendekostnaden.`;

  text += ` Bol\u00e5nekapacitet: Med ${fmtKr(amount)} i bruttol\u00f6n kan du l\u00e5na upp till ungef\u00e4r ${fmtKr(bolanKapacitet)} (4,5 g\u00e5nger \u00e5rsinkomsten). Det r\u00e4cker till en bostad v\u00e4rd cirka ${fmtKr(bostadsvarde)} vid 85% bel\u00e5ningsgrad.`;

  if (sparutrymme > 0) {
    text += ` Efter grundl\u00e4ggande utgifter (hyra ${fmtKr(hyraRiket)}, mat ${fmtKr(matPerPerson)}, transport ${fmtKr(bensin)}, el ${fmtKr(elKostnad)}, mobil/bredband ${fmtKr(mobilOchBredband)}) \u00e5terst\u00e5r ${fmtKr(sparutrymme)} per m\u00e5nad f\u00f6r sparande, n\u00f6jen och \u00f6vrigt. P\u00e5 ett \u00e5r kan du potentiellt spara ${fmtKr(sparutrymme * 12)} om du h\u00e5ller en stram budget.`;
  } else {
    text += ` Notera att med grundl\u00e4ggande utgifter (hyra, mat, transport, el, mobil) p\u00e5 totalt ${fmtKr(hyraRiket + matPerPerson + bensin + elKostnad + mobilOchBredband)} per m\u00e5nad \u00e4r marginalen smal vid ${fmtKr(netMonthly)} netto. Det \u00e4r viktigt att budgetera noggrant och prioritera vilka utgifter som \u00e4r n\u00f6dv\u00e4ndiga.`;
  }

  // \u00c5rssemester-pengar
  const semesterPeng = Math.round(netMonthly * 25 / 21); // 25 dagars netto
  text += ` Under dina 25 semesterdagar per \u00e5r ger l\u00f6nen p\u00e5 ${fmtKr(amount)} dig ungef\u00e4r ${fmtKr(semesterPeng)} i netto semesterl\u00f6n (inklusive semestertill\u00e4gg), vilket du kan anv\u00e4nda till semester och rekreation.`;

  return text;
}

export function getPensionProjection(amount: number, result: TaxResult): string {
  const vi = variationIndex(amount);
  const annualGross = amount * 12;

  // Tj\u00e4nstepension (vanligtvis 4.5% under 7.5 IBB + 30% \u00f6ver)
  const ibb = 76200; // Inkomstbasbelopp 2026
  const pensionTak = 7.5 * ibb; // 571 500
  const tjanstepensionUnder = Math.min(annualGross, pensionTak) * 0.045;
  const tjanstepensionOver = annualGross > pensionTak ? (annualGross - pensionTak) * 0.30 : 0;
  const tjanstepensionTotal = Math.round(tjanstepensionUnder + tjanstepensionOver);
  const tjanstepensionMonthly = Math.round(tjanstepensionTotal / 12);

  // Allm\u00e4n pension (enbart arbetsinkomst under taket)
  const allmanPensionBase = Math.min(annualGross, pensionTak) * 0.185; // F\u00f6renklad
  const allmanPensionMonthly = Math.round(allmanPensionBase / 12);

  // Uppskattad pension vid 65 \u00e5r (mycket f\u00f6renklad)
  const yearsToRetirement = 30; // Antar 35 \u00e5r kvar
  const estimatedPensionMonthly = Math.round((allmanPensionBase + tjanstepensionTotal) * yearsToRetirement / (12 * 20)); // V\u00e4ldigt f\u00f6renklad

  const intros = [
    `Vid en bruttol\u00f6n p\u00e5 ${fmtKr(amount)} per m\u00e5nad byggs din framtida pension upp genom b\u00e5de allm\u00e4n pension och tj\u00e4nstepension.`,
    `S\u00e5 h\u00e4r p\u00e5verkar din l\u00f6n p\u00e5 ${fmtKr(amount)} brutto din pensionsuppbyggnad 2026:`,
    `Med ${fmtKr(amount)} i m\u00e5nadsl\u00f6n ser dina pensionsavs\u00e4ttningar ut s\u00e5 h\u00e4r:`,
    `Din bruttol\u00f6n p\u00e5 ${fmtKr(amount)} genererar f\u00f6ljande pensionsavs\u00e4ttningar varje \u00e5r:`,
    `H\u00e4r \u00e4r en \u00f6versikt av hur ${fmtKr(amount)} i m\u00e5nadsl\u00f6n bidrar till din framtida pension:`,
  ];

  let text = intros[vi];

  text += ` Allm\u00e4n pension: Baserat p\u00e5 din \u00e5rsl\u00f6n p\u00e5 ${fmtKr(annualGross)} avs\u00e4tts 18,5% (upp till taket p\u00e5 ${fmtKr(pensionTak)}) till din allm\u00e4nna pension. Det inneb\u00e4r ${fmtKr(Math.round(allmanPensionBase))} per \u00e5r (${fmtKr(allmanPensionMonthly)}/m\u00e5nad) i pensionsr\u00e4tt.`;

  text += ` Tj\u00e4nstepension: Med typiskt ITP-avtal avs\u00e4tter arbetsgivaren 4,5% p\u00e5 l\u00f6nedelen under ${fmtKr(pensionTak)}${tjanstepensionOver > 0 ? ` och 30% p\u00e5 delen \u00f6ver taket` : ''}. Det ger ${fmtKr(tjanstepensionTotal)} per \u00e5r (${fmtKr(tjanstepensionMonthly)}/m\u00e5nad) i tj\u00e4nstepension.`;

  text += ` Totalt avs\u00e4tts cirka ${fmtKr(Math.round(allmanPensionBase) + tjanstepensionTotal)} per \u00e5r till din pension vid l\u00f6nen ${fmtKr(amount)}.`;

  if (annualGross > pensionTak) {
    text += ` Viktigt: Eftersom din \u00e5rsl\u00f6n p\u00e5 ${fmtKr(annualGross)} \u00f6verstiger pensionstaket p\u00e5 ${fmtKr(pensionTak)} byggs ingen allm\u00e4n pension p\u00e5 inkomst \u00f6ver detta tak. Tj\u00e4nstepensionens h\u00f6gre avs\u00e4ttning (30%) kompenserar delvis f\u00f6r detta.`;
  } else {
    text += ` Hela din \u00e5rsinkomst p\u00e5 ${fmtKr(annualGross)} ligger under pensionstaket (${fmtKr(pensionTak)}), s\u00e5 full pensionsr\u00e4tt tj\u00e4nas in p\u00e5 hela beloppet.`;
  }

  text += ` Tips: \u00d6verv\u00e4g privat pensionssparande f\u00f6r att komplettera de ${fmtKr(Math.round(allmanPensionBase) + tjanstepensionTotal)} som avs\u00e4tts \u00e5rligen. Varje extra tusenlapp du sparar nu v\u00e4xer avsev\u00e4rt \u00f6ver tid med r\u00e4nta p\u00e5 r\u00e4nta.`;

  return text;
}

/**
 * H\u00e4mta alla inneh\u00e5llssektioner f\u00f6r en given l\u00f6nesida
 */
export function getSalaryPageContent(amount: number) {
  const result = calculateTakeHome({ monthlyGross: amount });

  return {
    bandContext: getBandContext(amount, result),
    careerDescription: getCareerDescription(amount),
    taxTips: getTaxTips(amount, result),
    faqs: buildFaqs(amount, result),
    raiseSimulation: getRaiseSimulation(amount, result),
    budgetBreakdown: getBudgetBreakdown(result.netMonthly, amount),
    uniqueComparisons: getUniqueComparisons(amount, result),
    employerCost: getEmployerCostBreakdown(amount, result),
    annualTimeline: getAnnualTimeline(amount, result),
    purchasingPower: getPurchasingPowerContext(amount, result),
    pensionProjection: getPensionProjection(amount, result),
    result,
  };
}
