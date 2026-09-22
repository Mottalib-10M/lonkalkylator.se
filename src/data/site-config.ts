/**
 * Site configuration for lonkalkylator.se
 */

export const SITE_NAME = 'Lönekalkylator';
export const SITE_URL = 'https://lonkalkylator.se';
export const CURRENCY = 'SEK';
export const CURRENCY_SYMBOL = 'kr';
export const LOCALE = 'sv-SE';
export const TAX_YEAR = 2026;
export const LAST_UPDATED = '2026-07-01';
export const OG_IMAGE = `${SITE_URL}/og-default.png`;
export const OG_IMAGE_WIDTH = '1200';
export const OG_IMAGE_HEIGHT = '630';

export const CONTACT_EMAIL = 'kontakt@lonkalkylator.se';

/*
 * Identite legale de l'editeur (RECETTE-SITE.md, controle check-legal).
 * Un champ laisse vide ressort en jaune sur la page legale et fait echouer le
 * controle : rien ne part en ligne avec une mention manquante.
 */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',
  legalForm: '',                 // vide : publication a titre personnel, pas de societe
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: 'Frankrike',          // pays de l'editeur, pas du site
  phone: '',
  registerLabel: 'SIREN',
  registerNumber: '',
  vatLabel: 'Momsregistreringsnummer',
  vatNumber: '',                 // vide : non assujetti
  jurisdiction: 'Sverige',
  supervisoryAuthority: 'Integritetsskyddsmyndigheten (IMY), Box 8114, 104 20 Stockholm, Sverige',
  supervisoryAuthorityUrl: 'https://www.imy.se/privatperson/utfora-arenden/lamna-ett-klagomal/',
  hosting: {
    name: 'GitHub, Inc.',
    address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States',
    phone: '',
    url: 'https://github.com',
  },
};
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];
