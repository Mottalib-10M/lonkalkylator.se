/**
 * Centralised navigation data for Header and Footer components.
 * All internal links use trailing slashes to match trailingSlash: 'always'.
 */

export interface NavLink {
  href: string;
  label: string;
}

export interface NavGroup {
  label: string;
  children: NavLink[];
}

// ---------------------------------------------------------------------------
// Header nav groups (desktop dropdowns + mobile accordions)
// ---------------------------------------------------------------------------

export const headerCalcLinks: Record<string, NavGroup> = {
  sv: {
    label: 'Kalkylatorer',
    children: [
      { href: '/', label: 'Lönekalkylator' },
      { href: '/statlig-skatt-kalkylator/', label: 'Statlig skatt-kalkylator' },
      { href: '/pensionskalkylator/', label: 'Pensionskalkylator' },
      { href: '/netto-till-brutto/', label: 'Netto till brutto' },
      { href: '/timlon-kalkylator/', label: 'Timlönkalkylator' },
      { href: '/kalkylatorer/', label: 'Alla kalkylatorer' },
    ],
  },
  en: {
    label: 'Calculators',
    children: [
      { href: '/en/', label: 'Salary Calculator' },
      { href: '/en/', label: 'All Calculators' },
    ],
  },
};

export const headerSalaryLinks: Record<string, NavGroup> = {
  sv: {
    label: 'Lönebelopp',
    children: [
      { href: '/lon/25000/', label: '25 000 kr/mån' },
      { href: '/lon/30000/', label: '30 000 kr/mån' },
      { href: '/lon/35000/', label: '35 000 kr/mån' },
      { href: '/lon/40000/', label: '40 000 kr/mån' },
      { href: '/lon/50000/', label: '50 000 kr/mån' },
      { href: '/lon/70000/', label: '70 000 kr/mån' },
    ],
  },
};

export const headerGuideLinks: Record<string, NavGroup> = {
  sv: {
    label: 'Guider',
    children: [
      { href: '/guides/skattesatser-2025/', label: 'Skattesatser 2025' },
      { href: '/guides/jobbskatteavdrag-forklarat/', label: 'Jobbskatteavdrag förklarat' },
      { href: '/guides/kommunalskatt-forklarat/', label: 'Kommunalskatt förklarat' },
      { href: '/guides/', label: 'Alla guider' },
    ],
  },
  en: {
    label: 'Glossary',
    children: [
      { href: '/en/glossary/', label: 'Tax Glossary' },
    ],
  },
};

/** Build the full header nav items array for a given language. */
export function getHeaderNavItems(lang: string): NavGroup[] {
  if (lang === 'en') {
    return [headerCalcLinks.en, headerGuideLinks.en];
  }
  return [headerCalcLinks.sv, headerSalaryLinks.sv, headerGuideLinks.sv];
}

// ---------------------------------------------------------------------------
// Footer nav links (flat lists per column)
// ---------------------------------------------------------------------------

export const footerCalcLinks: Record<string, NavLink[]> = {
  sv: [
    { href: '/', label: 'Lönekalkylator' },
    { href: '/statlig-skatt-kalkylator/', label: 'Statlig skatt-kalkylator' },
    { href: '/pensionskalkylator/', label: 'Pensionskalkylator' },
    { href: '/netto-till-brutto/', label: 'Netto till brutto' },
    { href: '/timlon-kalkylator/', label: 'Timlönkalkylator' },
    { href: '/kalkylatorer/', label: 'Alla kalkylatorer' },
    { href: '/embed/', label: 'Widget' },
  ],
};

export const footerSalaryLinks: Record<string, NavLink[]> = {
  sv: [
    { href: '/lon/25000/', label: '25 000 kr/mån' },
    { href: '/lon/30000/', label: '30 000 kr/mån' },
    { href: '/lon/40000/', label: '40 000 kr/mån' },
    { href: '/lon/50000/', label: '50 000 kr/mån' },
    { href: '/lon/70000/', label: '70 000 kr/mån' },
  ],
};

export const footerGuideLinks: Record<string, NavLink[]> = {
  sv: [
    { href: '/guides/skattesatser-2025/', label: 'Skattesatser 2025' },
    { href: '/guides/jobbskatteavdrag-forklarat/', label: 'Jobbskatteavdrag' },
    { href: '/guides/kommunalskatt-forklarat/', label: 'Kommunalskatt' },
    { href: '/guides/metodik/', label: 'Var metodik' },
    { href: '/guides/', label: 'Alla guider' },
    { href: '/nyheter/', label: 'Nyheter' },
  ],
};

export const footerInfoLinks: Record<string, NavLink[]> = {
  sv: [
    { href: '/om-oss/', label: 'Om oss' },
    { href: '/kontakt/', label: 'Kontakt' },
    { href: '/integritetspolicy/', label: 'Integritetspolicy' },
    { href: '/villkor/', label: 'Villkor' },
  ],
};
