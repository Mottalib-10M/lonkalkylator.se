/**
 * Skattesatser och parametrar för beskattningsåret 2026
 * Källa: Skatteverket (skatteverket.se)
 *
 * Innehåller:
 * - Kommunalskattesatser för 30 stora kommuner
 * - Statlig inkomstskatt (20% på inkomst över skiktgräns)
 * - Grundavdrag (baserat på prisbasbelopp 58 800 kr för 2026)
 * - Jobbskatteavdrag
 * - Allmän pensionsavgift
 */

/** Prisbasbelopp 2026 */
export const PRISBASBELOPP = 58_800;

/** Skiktgräns för statlig inkomstskatt 2026 (taxerad förvärvsinkomst) */
export const SKIKTGRANS_STATLIG = 615_300;

/** Statlig skattesats */
export const STATLIG_SKATTESATS = 0.20;

/** Allmän pensionsavgift */
export const PENSIONSAVGIFT_SATS = 0.07;

/** Tak för pensionsavgift (8,07 inkomstbasbelopp, ca 614 000 kr 2026) */
export const PENSIONSAVGIFT_TAK = 614_000;

/** Skattereduktion för pensionsavgift — full avräkning */
export const PENSIONSAVGIFT_REDUKTION = 1.0;

/** Genomsnittlig kommunalskattesats 2026 */
export const DEFAULT_KOMMUNALSKATT = 32.37;

/** Kyrkoavgift (medel, valfri — endast för Svenska kyrkan) */
export const KYRKOAVGIFT_DEFAULT = 0;

/** Begravningsavgift (medel) */
export const BEGRAVNINGSAVGIFT = 0.28;

export interface Kommun {
  name: string;
  slug: string;
  rate: number; // Total kommunal + landstingsskatt i %
  lan: string;
}

/**
 * Kommunalskattesatser 2026 — Total skattesats (kommunalskatt + regionskatt)
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
  { name: 'Stockholm', slug: 'stockholm', rate: 30.48, lan: 'Stockholms län' },
  { name: 'Göteborg', slug: 'goteborg', rate: 33.11, lan: 'Västra Götalands län' },
  { name: 'Malmö', slug: 'malmo', rate: 33.73, lan: 'Skåne län' },
  { name: 'Uppsala', slug: 'uppsala', rate: 33.03, lan: 'Uppsala län' },
  { name: 'Linköping', slug: 'linkoping', rate: 32.00, lan: 'Östergötlands län' },
  { name: 'Örebro', slug: 'orebro', rate: 33.65, lan: 'Örebro län' },
  { name: 'Västerås', slug: 'vasteras', rate: 31.64, lan: 'Västmanlands län' },
  { name: 'Norrköping', slug: 'norrkoping', rate: 33.30, lan: 'Östergötlands län' },
  { name: 'Helsingborg', slug: 'helsingborg', rate: 31.34, lan: 'Skåne län' },
  { name: 'Jönköping', slug: 'jonkoping', rate: 32.60, lan: 'Jönköpings län' },
  { name: 'Umeå', slug: 'umea', rate: 34.87, lan: 'Västerbottens län' },
  { name: 'Lund', slug: 'lund', rate: 32.69, lan: 'Skåne län' },
  { name: 'Borås', slug: 'boras', rate: 33.01, lan: 'Västra Götalands län' },
  { name: 'Sundsvall', slug: 'sundsvall', rate: 34.02, lan: 'Västernorrlands län' },
  { name: 'Eskilstuna', slug: 'eskilstuna', rate: 32.69, lan: 'Södermanlands län' },
  { name: 'Gävle', slug: 'gavle', rate: 33.76, lan: 'Gävleborgs län' },
  { name: 'Karlstad', slug: 'karlstad', rate: 33.43, lan: 'Värmlands län' },
  { name: 'Växjö', slug: 'vaxjo', rate: 32.59, lan: 'Kronobergs län' },
  { name: 'Halmstad', slug: 'halmstad', rate: 31.84, lan: 'Hallands län' },
  { name: 'Luleå', slug: 'lulea', rate: 33.74, lan: 'Norrbottens län' },
  { name: 'Täby', slug: 'taby', rate: 29.68, lan: 'Stockholms län' },
  { name: 'Solna', slug: 'solna', rate: 29.70, lan: 'Stockholms län' },
  { name: 'Nacka', slug: 'nacka', rate: 30.12, lan: 'Stockholms län' },
  { name: 'Huddinge', slug: 'huddinge', rate: 31.63, lan: 'Stockholms län' },
  { name: 'Södertälje', slug: 'sodertalje', rate: 32.78, lan: 'Stockholms län' },
  { name: 'Trollhättan', slug: 'trollhattan', rate: 33.56, lan: 'Västra Götalands län' },
  { name: 'Kalmar', slug: 'kalmar', rate: 33.07, lan: 'Kalmar län' },
  { name: 'Kristianstad', slug: 'kristianstad', rate: 33.86, lan: 'Skåne län' },
  { name: 'Östersund', slug: 'ostersund', rate: 34.22, lan: 'Jämtlands län' },
  { name: 'Falun', slug: 'falun', rate: 33.51, lan: 'Dalarnas län' },
];

/**
 * Lönebelopp för /lon/[slug]/ sidor
 */
export const SALARY_AMOUNTS = [25_000, 30_000, 35_000, 40_000, 45_000, 50_000, 60_000, 70_000, 80_000];
