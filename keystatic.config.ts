// Keystatic admin at /keystatic. Locally it edits files directly; on Netlify it commits to GitHub.
// Production needs KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET and
// PUBLIC_KEYSTATIC_GITHUB_APP_SLUG in the Netlify environment (see README).
import { collection, config, fields } from '@keystatic/core';

const PILLARS = [
  { label: 'Wijnproeverij thuis', value: 'wijnproeverij-thuis' },
  { label: 'Wijn leren proeven', value: 'wijn-leren-proeven' },
  { label: 'Druiven en stijlen', value: 'druiven-en-stijlen' },
  { label: 'Wijn en eten', value: 'wijn-en-eten' },
  { label: 'Wijn als cadeau', value: 'wijn-cadeau' },
  { label: 'Zakelijk', value: 'zakelijk' },
];

const seoTitle = fields.text({
  label: 'SEO-titel',
  description: 'Max. 50 tekens, zoekwoord vooraan. "| Flavory" wordt automatisch toegevoegd.',
  validation: { isRequired: true, length: { max: 50 } },
});
const seoDescription = (label = 'Meta description') =>
  fields.text({
    label,
    description: '120 tot 155 tekens. Beschrijf de pagina en geef een reden om te klikken.',
    multiline: true,
    validation: { isRequired: true, length: { min: 120, max: 155 } },
  });
const alt = fields.text({
  label: 'Alt-tekst',
  description: 'Beschrijf wat er op de foto staat (verplicht).',
  validation: { isRequired: true, length: { min: 5 } },
});

const markdown = (directory: string, publicPath: string) =>
  fields.markdoc({
    label: 'Inhoud',
    extension: 'md',
    options: { image: { directory, publicPath } },
  });

export default config({
  storage:
    import.meta.env.PROD && import.meta.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
      ? { kind: 'github', repo: { owner: 'sebastien-maker', name: 'Flavory' }, branchPrefix: 'content/' }
      : { kind: 'local' },
  ui: {
    brand: { name: 'Flavory' },
    navigation: {
      Shop: ['products', 'categories'],
      Content: ['blog', 'pages', 'faq'],
      Vertrouwen: ['reviews', 'authors'],
    },
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({ name: { label: 'Titel (H1)' } }),
        seoTitle,
        description: seoDescription(),
        excerpt: fields.text({ label: 'Samenvatting (kaartjes)', multiline: true, validation: { isRequired: true } }),
        pubDate: fields.date({ label: 'Publicatiedatum', validation: { isRequired: true } }),
        updatedDate: fields.date({ label: 'Laatst bijgewerkt' }),
        author: fields.relationship({ label: 'Auteur', collection: 'authors', validation: { isRequired: true } }),
        heroImage: fields.image({
          label: 'Hoofdafbeelding',
          directory: 'src/assets/images/blog',
          publicPath: '../../assets/images/blog/',
          validation: { isRequired: true },
        }),
        heroAlt: alt,
        pillar: fields.select({ label: 'Pijler', options: PILLARS, defaultValue: 'wijnproeverij-thuis' }),
        relatedProduct: fields.relationship({ label: 'Gerelateerd product', collection: 'products' }),
        related: fields.array(fields.relationship({ label: 'Artikel', collection: 'blog' }), {
          label: 'Gerelateerde artikels (max. 4)',
          itemLabel: (props) => props.value ?? 'Kies een artikel',
          validation: { length: { max: 4 } },
        }),
        draft: fields.checkbox({ label: 'Concept (niet publiceren)', defaultValue: false }),
        content: markdown('src/assets/images/blog', '../../assets/images/blog/'),
      },
    }),

    products: collection({
      label: 'Producten',
      slugField: 'name',
      path: 'src/content/products/*',
      format: { contentField: 'content' },
      columns: ['name'],
      schema: {
        name: fields.slug({
          name: { label: 'Productnaam' },
          slug: {
            label: 'Handle',
            description: 'Moet gelijk zijn aan de Shopify-handle. Niet wijzigen zonder 301-redirect.',
          },
        }),
        h1: fields.text({ label: 'H1', validation: { isRequired: true } }),
        seoTitle,
        seoDescription: seoDescription(),
        duel: fields.text({
          label: 'Duel',
          description: 'Bv. "Merlot vs. Cabernet Sauvignon"',
          validation: { isRequired: true },
        }),
        cardTagline: fields.text({ label: 'Tekst op productkaart', validation: { isRequired: true } }),
        definition: fields.text({
          label: 'Definitieblok',
          description: 'Twee zinnen: wat is het, wat kost het, voor wie. Wordt ook gebruikt in schema.',
          multiline: true,
          validation: { isRequired: true },
        }),
        variants: fields.array(
          fields.object({
            id: fields.text({
              label: 'Code van de keuze',
              description: 'Kleine letters en koppeltekens, bv. merlot-cabernet-premium. Niet wijzigen.',
              validation: { isRequired: true },
            }),
            duel: fields.text({
              label: 'Duel',
              description: 'Bv. "Italië vs Spanje"',
              validation: { isRequired: true },
            }),
            formula: fields.select({
              label: 'Formule',
              options: [
                { label: 'Regular', value: 'Regular' },
                { label: 'Premium', value: 'Premium' },
              ],
              defaultValue: 'Regular',
            }),
            price: fields.number({ label: 'Prijs (€)', step: 0.01, validation: { isRequired: true, min: 0 } }),
            sku: fields.text({ label: 'SKU', validation: { isRequired: true } }),
            wooId: fields.integer({
              label: 'WooCommerce-product-ID',
              description: 'Het nummer in de adresbalk als je het product bewerkt (post=…). Nodig om te kunnen afrekenen.',
            }),
            gtin13: fields.text({
              label: 'GTIN-13 (EAN-barcode)',
              description: 'De 13 cijfers van de barcode op deze box. Leeg laten zolang er geen barcode is.',
            }),
            group: fields.text({
              label: 'Tekstgroep',
              description: 'Moet overeenkomen met een groep onder "Beschrijvingen".',
              validation: { isRequired: true },
            }),
            available: fields.checkbox({
              label: 'Op voorraad',
              description: 'Uitvinken om de keuze volledig te verbergen.',
              defaultValue: true,
            }),
          }),
          {
            label: 'Keuzes (volgorde = volgorde in de keuzelijst)',
            itemLabel: (props) =>
              `${props.fields.duel.value} · ${props.fields.formula.value} · €${props.fields.price.value ?? ''}${props.fields.available.value ? '' : ' (uitverkocht)'}`,
            validation: { length: { min: 1 } },
          },
        ),
        descriptions: fields.array(
          fields.object({
            group: fields.text({ label: 'Tekstgroep', validation: { isRequired: true } }),
            heading: fields.text({ label: 'Tussentitel', validation: { isRequired: true } }),
            text: fields.text({ label: 'Tekst (markdown)', multiline: true, validation: { isRequired: true } }),
          }),
          {
            label: 'Beschrijvingen (de eerste staat er tot de klant kiest)',
            itemLabel: (props) => props.fields.heading.value,
            validation: { length: { min: 1 } },
          },
        ),
        category: fields.relationship({
          label: 'Categorie',
          collection: 'categories',
          validation: { isRequired: true },
        }),
        playersMin: fields.integer({ label: 'Min. spelers', defaultValue: 2 }),
        playersMax: fields.integer({ label: 'Max. spelers', defaultValue: 6 }),
        images: fields.array(
          fields.object({
            src: fields.image({
              label: 'Foto',
              directory: 'src/assets/images/products',
              publicPath: '../../assets/images/products/',
              validation: { isRequired: true },
            }),
            alt,
          }),
          {
            label: "Foto's (eerste = hoofdfoto)",
            itemLabel: (props) => props.fields.alt.value || 'Foto',
            validation: { length: { min: 1 } },
          },
        ),
        usps: fields.array(fields.text({ label: 'USP' }), { label: 'USP-lijst', itemLabel: (props) => props.value }),
        highlights: fields.array(
          fields.object({
            title: fields.text({ label: 'Vet begin' }),
            text: fields.text({ label: 'Rest van de zin' }),
          }),
          { label: 'Highlights', itemLabel: (props) => props.fields.title.value },
        ),
        boxContents: fields.array(fields.text({ label: 'Item' }), {
          label: 'Wat zit er in de box?',
          itemLabel: (props) => props.value,
        }),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: 'Vraag' }),
            answer: fields.text({ label: 'Antwoord (markdown)', multiline: true }),
          }),
          { label: 'FAQ', itemLabel: (props) => props.fields.question.value },
        ),
        relatedPosts: fields.array(fields.relationship({ label: 'Artikel', collection: 'blog' }), {
          label: 'Gerelateerde artikels (max. 4)',
          itemLabel: (props) => props.value ?? 'Kies een artikel',
          validation: { length: { max: 4 } },
        }),
        order: fields.integer({ label: 'Volgorde', defaultValue: 0 }),
        draft: fields.checkbox({ label: 'Verbergen', defaultValue: false }),
        content: markdown('src/assets/images/products', '../../assets/images/products/'),
      },
    }),

    categories: collection({
      label: 'Categorieën',
      slugField: 'name',
      path: 'src/content/categories/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Naam' } }),
        h1: fields.text({ label: 'H1', validation: { isRequired: true } }),
        seoTitle,
        seoDescription: seoDescription(),
        order: fields.integer({ label: 'Volgorde', defaultValue: 0 }),
        content: markdown('src/assets/images/site', '../../assets/images/site/'),
      },
    }),

    pages: collection({
      label: 'Tekstpagina’s',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Titel (H1)' } }),
        seoTitle,
        description: seoDescription(),
        updatedDate: fields.date({ label: 'Laatst bijgewerkt' }),
        noindex: fields.checkbox({ label: 'Niet indexeren', defaultValue: false }),
        content: markdown('src/assets/images/site', '../../assets/images/site/'),
      },
    }),

    faq: collection({
      label: 'FAQ',
      slugField: 'question',
      path: 'src/content/faq/*',
      format: 'yaml',
      columns: ['question', 'group'],
      schema: {
        question: fields.slug({ name: { label: 'Vraag' } }),
        answer: fields.text({ label: 'Antwoord (markdown)', multiline: true, validation: { isRequired: true } }),
        group: fields.select({
          label: 'Groep',
          options: [
            { label: 'Kiezen en cadeau', value: 'kiezen' },
            { label: 'Het spel', value: 'spel' },
            { label: 'Bestellen en levering', value: 'bestellen' },
            { label: 'Bedrijven en winkels', value: 'zakelijk' },
          ],
          defaultValue: 'kiezen',
        }),
        order: fields.integer({ label: 'Volgorde', defaultValue: 0 }),
      },
    }),

    reviews: collection({
      label: 'Reviews',
      slugField: 'author',
      path: 'src/content/reviews/*',
      format: 'yaml',
      schema: {
        author: fields.slug({ name: { label: 'Naam' } }),
        rating: fields.integer({ label: 'Score (1-5)', validation: { min: 1, max: 5, isRequired: true } }),
        title: fields.text({ label: 'Titel' }),
        body: fields.text({ label: 'Review', multiline: true, validation: { isRequired: true } }),
        product: fields.relationship({ label: 'Product', collection: 'products' }),
        date: fields.date({ label: 'Datum' }),
        order: fields.integer({ label: 'Volgorde', defaultValue: 0 }),
      },
    }),

    stores: collection({
      label: 'Verkooppunten',
      slugField: 'name',
      path: 'src/content/stores/*',
      format: 'yaml',
      schema: {
        name: fields.slug({ name: { label: 'Winkel' } }),
        street: fields.text({ label: 'Straat en nummer', validation: { isRequired: true } }),
        postalCode: fields.text({ label: 'Postcode', validation: { isRequired: true } }),
        city: fields.text({ label: 'Gemeente', validation: { isRequired: true } }),
        country: fields.select({
          label: 'Land',
          options: [
            { label: 'België', value: 'BE' },
            { label: 'Nederland', value: 'NL' },
          ],
          defaultValue: 'BE',
        }),
        url: fields.url({ label: 'Website' }),
      },
    }),

    authors: collection({
      label: 'Auteurs',
      slugField: 'name',
      path: 'src/content/authors/*',
      format: 'yaml',
      schema: {
        name: fields.slug({ name: { label: 'Naam' } }),
        role: fields.text({ label: 'Rol', validation: { isRequired: true } }),
        bio: fields.text({ label: 'Bio', multiline: true, validation: { isRequired: true } }),
        image: fields.image({
          label: 'Portret',
          directory: 'src/assets/images/team',
          publicPath: '../../assets/images/team/',
        }),
        sameAs: fields.array(fields.url({ label: 'Profiel-URL' }), {
          label: 'Profielen (LinkedIn, Instagram)',
          itemLabel: (props) => props.value ?? '',
        }),
      },
    }),
  },
});
