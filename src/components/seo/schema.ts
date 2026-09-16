// JSON-LD builders (CLAUDE.md rule 4). Every page passes its graph to <SeoHead schema={...}>.
import { SITE, absoluteUrl } from '@/lib/site';

type Thing = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export function organization(): Thing {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
      width: 512,
      height: 512,
    },
    email: SITE.email,
    vatID: SITE.vatId,
    foundingDate: SITE.foundingDate,
    slogan: SITE.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE.email,
      availableLanguage: ['nl'],
      areaServed: ['BE', 'NL'],
    },
    founder: { '@id': `${SITE.url}/over-flavory/#bart` },
    sameAs: Object.values(SITE.social),
  };
}

export function website(): Thing {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    inLanguage: SITE.locale,
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): Thing {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPage(opts: { path: string; title: string; description: string; type?: string }): Thing {
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: SITE.locale,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function faqPage(path: string, items: { question: string; answer: string }[]): Thing {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: stripMarkdown(item.answer) },
    })),
  };
}

export interface ProductSchemaInput {
  path: string;
  name: string;
  description: string;
  sku: string;
  gtin13?: string | undefined;
  price: number;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  images: string[];
  category: string;
  reviews: { author: string; rating: number; body: string; title?: string | undefined }[];
}

const AVAILABILITY = {
  in_stock: 'https://schema.org/InStock',
  out_of_stock: 'https://schema.org/OutOfStock',
  preorder: 'https://schema.org/PreOrder',
} as const;

export function product(p: ProductSchemaInput): Thing {
  const url = absoluteUrl(p.path);
  // Offers are valid for a year; refreshed on every build.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    description: p.description,
    url,
    sku: p.sku,
    ...(p.gtin13 ? { gtin13: p.gtin13 } : {}),
    image: p.images,
    category: p.category,
    brand: { '@type': 'Brand', name: SITE.name },
    manufacturer: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      url,
      price: p.price.toFixed(2),
      priceCurrency: 'EUR',
      priceValidUntil,
      availability: AVAILABILITY[p.availability],
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      shippingDetails: SITE.shipping.countries.map((country) => ({
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: country },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: SITE.shipping.minDays,
            maxValue: SITE.shipping.maxDays,
            unitCode: 'DAY',
          },
        },
      })),
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: [...SITE.shipping.countries],
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: SITE.returnDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
        merchantReturnLink: absoluteUrl('/verzending-en-retour/'),
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.rating.value,
      reviewCount: SITE.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: p.reviews.slice(0, 3).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      ...(r.title ? { name: r.title } : {}),
      reviewBody: r.body,
    })),
  };
}

export function itemList(path: string, items: { name: string; path: string }[]): Thing {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#itemlist`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function person(opts: {
  id: string;
  name: string;
  description: string;
  image?: string | undefined;
  sameAs?: string[] | undefined;
}): Thing {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/over-flavory/#${opts.id}`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl('/over-flavory/'),
    worksFor: { '@id': ORG_ID },
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  };
}

export function article(opts: {
  path: string;
  headline: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified?: Date | undefined;
  authorId: string;
  authorName: string;
}): Thing {
  return {
    '@type': 'BlogPosting',
    '@id': `${absoluteUrl(opts.path)}#article`,
    mainEntityOfPage: absoluteUrl(opts.path),
    headline: opts.headline,
    description: opts.description,
    image: [opts.image],
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    inLanguage: SITE.locale,
    author: {
      '@type': 'Person',
      '@id': `${SITE.url}/over-flavory/#${opts.authorId}`,
      name: opts.authorName,
      url: absoluteUrl('/over-flavory/'),
    },
    publisher: { '@id': ORG_ID },
  };
}

export function localBusiness(store: {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  url?: string | undefined;
}): Thing {
  return {
    '@type': 'Store',
    '@id': `${absoluteUrl('/verkooppunten/')}#${store.id}`,
    name: store.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.street,
      postalCode: store.postalCode,
      addressLocality: store.city,
      addressCountry: store.country,
    },
    ...(store.url ? { url: store.url } : {}),
  };
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}
