/**
 * SEO-verktyg, Schema.org-generatorer, titel- och canonical-byggare
 */

import { SITE_NAME, SITE_URL, TAX_YEAR, LAST_UPDATED, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '../data/site-config';

export { SITE_NAME, SITE_URL, LAST_UPDATED, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT };

export function buildCanonical(slug: string): string {
  const path = slug.startsWith('/') ? slug : `/${slug}`;
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${SITE_URL}${withSlash}`;
}

export function webApplicationSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'SEK' },
    creator: personSchema(),
    inLanguage: 'sv',
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    founder: personSchema(),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/kontakt/`,
    },
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Radif Partners',
    jobTitle: 'Finansexpert & utvecklare',
    description: 'Éditeur de calculateurs et de guides pratiques',
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function websiteSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'sv',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function articleSchema(
  headline: string,
  description: string,
  url: string,
  datePublished: string,
  dateModified: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    datePublished,
    dateModified,
    author: personSchema(),
    publisher: organizationSchema(),
    image: OG_IMAGE,
    inLanguage: 'sv',
  };
}
