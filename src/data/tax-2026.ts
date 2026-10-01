/**
 * Skattesatser och parametrar för beskattningsåret 2026
 *
 * Källor (kontrollerade 2026-10-02):
 * - Skatteverket, « Belopp och procent, inkomstår 2026 » : prisbasbelopp, inkomstbasbelopp, skiktgräns.
 * - Skatteverket, SKV 433 utgåva 36, « Teknisk beskrivning för skattetabeller 2026 » : grundavdrag,
 *   jobbskatteavdrag, allmän pensionsavgift, skattereduktion för förvärvsinkomst, public service-avgift.
 * - Skatteverkets öppna data « Skattesatser per kommun och församling », år 2026 : kommunernas skattesatser.
 * - SCB, « Kommunalskatterna 2026 » : genomsnittlig skattesats 32,38 %.
 * Till och med 2026-10-01 innehöll filen 2024 års prisbasbelopp, skiktgräns och avgiftstak.
 */

/** Prisbasbelopp 2026 */
export const PRISBASBELOPP = 59_200;

/** Inkomstbasbelopp 2026 */
export const INKOMSTBASBELOPP = 83_400;

/** Skiktgräns för statlig inkomstskatt 2026 (beskattningsbar förvärvsinkomst) */
export const SKIKTGRANS_STATLIG = 643_000;

/** Brytpunkt 2026 : årsinkomst från vilken statlig skatt betalas (under 66 år) */
export const BRYTPUNKT_STATLIG = 660_400;

/** Statlig skattesats */
export const STATLIG_SKATTESATS = 0.20;

/** Allmän pensionsavgift */
export const PENSIONSAVGIFT_SATS = 0.07;

/** Tak för pensionsavgift : 8,07 inkomstbasbelopp = 673 038 kr 2026 */
export const PENSIONSAVGIFT_TAK = Math.round(8.07 * INKOMSTBASBELOPP);

/** Skattereduktion för pensionsavgift, full avräkning */
export const PENSIONSAVGIFT_REDUKTION = 1.0;

/** Genomsnittlig kommunalskattesats 2026 (SCB) */
export const DEFAULT_KOMMUNALSKATT = 32.38;

/** Kyrkoavgift (medel, valfri, endast för Svenska kyrkan) */
export const KYRKOAVGIFT_DEFAULT = 0;

/** Begravningsavgift 2026, enhetlig sats utom i Stockholm (0,07 %) och Tranås */
export const BEGRAVNINGSAVGIFT = 0.292;

/** Public service-avgift : 1 % av beskattningsbar förvärvsinkomst, högst 1 % av 1,42 inkomstbasbelopp */
export const PUBLIC_SERVICE_SATS = 0.01;
export const PUBLIC_SERVICE_MAX = Math.floor(1.42 * INKOMSTBASBELOPP * 0.01);

/** Jobbskatteavdrag 2026, under 66 år (SKV 433, avsnitt 7.5.2), i prisbasbelopp */
export const JSA_2026 = {
  grans1: 0.91,
  grans2: 3.24,
  grans3: 8.08,
  sats2: 0.3874,
  bas3: 1.813,
  sats3: 0.251,
  tak: 3.027,
};

/** Skattereduktion för förvärvsinkomst : 0,75 % av inkomsten över 40 000 kr, högst 1 500 kr */
export const FORVARVSREDUKTION = { fran: 40_000, sats: 0.0075, max: 1_500 };

export interface Kommun {
  name: string;
  slug: string;
  rate: number; // Total kommunal + landstingsskatt i %
  lan: string;
}

/**
 * Kommunalskattesatser 2026, Total skattesats (kommunalskatt + regionskatt)
 * Källa: SCB / Skatteverket
 */
/**
 * Communes conservant une page dediee.
 *
 * Les trente pages de commune etaient identiques a 96,8 % : meme texte, seuls
 * le nom et le taux changeaient. On garde les huit plus peuplees, ou la
 * recherche « lon efter skatt + ville » a un volume reel ; les vingt-deux
 * autres figurent dans le tableau de /kommun/, qui les compare.
 *
 * Retirer une commune d'ici demande une redirection dans `astro.config.mjs`,
 * faute de quoi son URL retournerait une 404.
 */
export const KOMMUNER_MED_SIDA: string[] = [
  'stockholm', 'goteborg', 'malmo', 'uppsala',
  'linkoping', 'vasteras', 'orebro', 'helsingborg',
];

export const KOMMUNER: Kommun[] = [
  { name: 'Stockholm', slug: 'stockholm', rate: 30.55, lan: 'Stockholms län' },
  { name: 'Göteborg', slug: 'goteborg', rate: 32.60, lan: 'Västra Götalands län' },
  { name: 'Malmö', slug: 'malmo', rate: 32.42, lan: 'Skåne län' },
  { name: 'Uppsala', slug: 'uppsala', rate: 32.85, lan: 'Uppsala län' },
  { name: 'Linköping', slug: 'linkoping', rate: 31.75, lan: 'Östergötlands län' },
  { name: 'Örebro', slug: 'orebro', rate: 33.65, lan: 'Örebro län' },
  { name: 'Västerås', slug: 'vasteras', rate: 31.24, lan: 'Västmanlands län' },
  { name: 'Norrköping', slug: 'norrkoping', rate: 33.30, lan: 'Östergötlands län' },
  { name: 'Helsingborg', slug: 'helsingborg', rate: 31.39, lan: 'Skåne län' },
  { name: 'Jönköping', slug: 'jonkoping', rate: 33.40, lan: 'Jönköpings län' },
  { name: 'Umeå', slug: 'umea', rate: 34.65, lan: 'Västerbottens län' },
  { name: 'Lund', slug: 'lund', rate: 32.42, lan: 'Skåne län' },
  { name: 'Borås', slug: 'boras', rate: 32.79, lan: 'Västra Götalands län' },
  { name: 'Sundsvall', slug: 'sundsvall', rate: 33.88, lan: 'Västernorrlands län' },
  { name: 'Eskilstuna', slug: 'eskilstuna', rate: 32.85, lan: 'Södermanlands län' },
  { name: 'Gävle', slug: 'gavle', rate: 33.77, lan: 'Gävleborgs län' },
  { name: 'Karlstad', slug: 'karlstad', rate: 33.55, lan: 'Värmlands län' },
  { name: 'Växjö', slug: 'vaxjo', rate: 32.19, lan: 'Kronobergs län' },
  { name: 'Halmstad', slug: 'halmstad', rate: 32.38, lan: 'Hallands län' },
  { name: 'Luleå', slug: 'lulea', rate: 33.84, lan: 'Norrbottens län' },
  { name: 'Täby', slug: 'taby', rate: 29.88, lan: 'Stockholms län' },
  { name: 'Solna', slug: 'solna', rate: 29.70, lan: 'Stockholms län' },
  { name: 'Nacka', slug: 'nacka', rate: 30.11, lan: 'Stockholms län' },
  { name: 'Huddinge', slug: 'huddinge', rate: 31.71, lan: 'Stockholms län' },
  { name: 'Södertälje', slug: 'sodertalje', rate: 32.38, lan: 'Stockholms län' },
  { name: 'Trollhättan', slug: 'trollhattan', rate: 33.84, lan: 'Västra Götalands län' },
  { name: 'Kalmar', slug: 'kalmar', rate: 33.67, lan: 'Kalmar län' },
  { name: 'Kristianstad', slug: 'kristianstad', rate: 32.64, lan: 'Skåne län' },
  { name: 'Östersund', slug: 'ostersund', rate: 33.72, lan: 'Jämtlands län' },
  { name: 'Falun', slug: 'falun', rate: 34.05, lan: 'Dalarnas län' },
];

/**
 * Lönebelopp för /lon/[slug]/ sidor
 */
export const SALARY_AMOUNTS = [25_000, 30_000, 35_000, 40_000, 45_000, 50_000, 60_000, 70_000, 80_000];
