# Structured Data / Schema.org Audit — flavory.wine

Audited via crawl.json (209 URLs, jsonld_raw + schema_types), product.html (raw HTML of
`/shop/wijnproeverij-thuis-rood/`), and homepage_render.json. Live re-fetching was not
required beyond the supplied captures; all findings below are evidenced directly from
the provided data. Anything not directly observable (e.g., whether a reviews plugin
stores ratings server-side) is explicitly marked "unverified."

## Score

**42 / 100**

Rationale: The site has a technically valid, consistent Yoast SEO `@graph` foundation
(WebSite/WebPage/Organization/BreadcrumbList/ImageObject) on all 209 pages with no
malformed JSON and correct `https://schema.org` context — that's a solid base. But it is
missing the single highest-commercial-value schema for a D2C WooCommerce store
(Product/Offer/AggregateRating on ~180 shop pages), has no Review/LocalBusiness schema
for its two custom post types built specifically to showcase social proof (customer
reviews, partner stores), and the Organization node is too thin to support Knowledge
Panel or trust signals. FAQPage is technically well-implemented (genuine on-page Q&A,
content matches visible text) but per current Google policy carries no SERP benefit
project-wide as of May 2026, so it does not raise the score. One minor data-integrity
bug (`Person.url: "#"`) is also present at scale (56 Person nodes, i.e. every blog
author).

## Inventory table

| Page type | Example URL | Schema present (@graph nodes) | Product/Offer | Review/Rating | FAQPage | Notes |
|---|---|---|---|---|---|---|
| Homepage | `/` | WebPage, WebSite, Organization, BreadcrumbList, ImageObject | — | — | — | Organization has only Instagram `sameAs` |
| Product (NL) | `/shop/wijnproeverij-thuis-rood/` | WebPage+ItemPage, WebSite, Organization, BreadcrumbList, ImageObject | ❌ None | ❌ None | — | `potentialAction: BuyAction` present but no Product/Offer node; og:product meta has real price (€24.90 EUR, instock) that is never mirrored into JSON-LD |
| Product (DE) | `/de/shop/merlot-oder-cabernet-sauvignon/` | Same as NL product | ❌ None | ❌ None | — | Identical gap in German section |
| Product w/ on-page FAQ | `/shop/bubbelbox/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/` | WebPage+ItemPage, ... | ❌ None | ❌ None | ✅ FAQPage | FAQ block is genuine (Qs match visible "FAQ" section on page) but still no Product schema |
| Blog post | `/blog/natuurwijn-kopen/` | **Article**, WebPage, WebSite, Organization, BreadcrumbList, ImageObject, Person | n/a | n/a | — | `Person.url` = `"#"` (invalid/placeholder) |
| Blog post (2 of 29) | unidentified 2 URLs | **BlogPosting** (not Article) | n/a | n/a | — | Inconsistent `@type` across the blog: 54 pages use Article, only 2 use BlogPosting — likely template/plugin inconsistency, not a hard error but worth normalizing |
| FAQ page (NL) | `/faq/` | WebPage, WebSite, Organization, BreadcrumbList, ImageObject, **FAQPage** | n/a | n/a | ✅ | 15 genuine Q&A pairs matching visible FAQ accordion; content is not spammy/hidden |
| FAQ page (DE) | `/de/faq/` | Same structure | n/a | n/a | ✅ | Mirrors NL |
| Contact page | `/contact/` | WebPage, ... , **FAQPage** | n/a | n/a | ✅ | FAQ block also genuinely present on-page ("FAQ" heading + matching Qs) — not spam, but off-topic for a Contact page |
| Contact page (DE) | `/de/kontakt/` | Same | n/a | n/a | ✅ | Mirrors NL |
| Partner store CPT | `/?store=huis-manendonckx` (10 URLs) | WebPage, WebSite, Organization, BreadcrumbList | ❌ | ❌ **No LocalBusiness/Store** | — | Page is a physical retail partner listing — ideal LocalBusiness candidate, currently generic WebPage only |
| Customer review CPT | `/?reviews=karolien` (12 URLs) | WebPage, WebSite, Organization, BreadcrumbList | n/a | ❌ **No Review schema** | — | Page IS a customer review but carries zero Review/Rating markup |
| All 209 pages | — | BreadcrumbList (208), WebSite (208), Organization (208), ImageObject (165) | — | — | — | Consistently well-formed; no duplicate `@id` collisions observed within a page |

## What works

- **Valid JSON-LD, correct context**: every block sampled uses `"@context": "https://schema.org"` (not `http`), single `@graph` per page, and parses as valid JSON — no syntax errors found in any sampled block.
- **Consistent `@id` graph-stitching**: Yoast's interlinked `@id` pattern (`#website`, `#organization`, `#breadcrumb`, `#primaryimage`) is applied uniformly, which is good practice and avoids duplicate entity definitions within a page.
- **BreadcrumbList is accurate**: verified on the product page — `Flavory > Shop > Rode Wijnspel – Het ultieme duel` matches the actual site IA and the visible breadcrumb trail, with absolute `item` URLs on all non-terminal entries (terminal entry correctly omits `item` per spec).
- **Article has core required fields**: `headline`, `datePublished`, `dateModified`, `author`, `image`, `publisher` are all present and correctly typed on blog posts (verified on `/blog/natuurwijn-kopen/`).
- **FAQPage content is genuine, not spammy**: on all 7 pages carrying FAQPage, the question text in the JSON-LD matches an actual visible "FAQ" accordion/section in `text_sample` — this is not a manipulative/hidden-FAQ pattern, it's simply a schema type that lost its Google rich-result surface.
- **No HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, or LearningVideo schema found anywhere** — the site is not carrying any deprecated schema debt.
- **Images referenced in schema are real, sized, absolute URLs** (e.g., product ImageObject 1620×1620 webp) — no placeholder or relative image URLs.

## Findings

### 1. No Product/Offer schema on any of ~180 WooCommerce product pages
- **Severity:** Critical
- **Evidence:** `schema_types` for `/shop/wijnproeverij-thuis-rood/` = `['WebPage,ItemPage', 'ImageObject', 'BreadcrumbList', 'WebSite', 'Organization']` — no `Product` or `Offer` type anywhere in the 209-URL crawl. Confirmed in raw JSON-LD dump: the ItemPage node only carries a `BuyAction` potentialAction, not a Product entity. Meanwhile `product.html` <head> carries real, usable commerce data via Open Graph: `product:price:amount=24.90`, `product:price:currency=EUR`, `product:availability=instock`, and a SKU string embedded in a data layer script (`"B001L Merlot/CS (05430004293071)-2"`), proving the underlying WooCommerce data exists but is not being surfaced as Product schema.
- **Recommendation:** Add Product + Offer (+ AggregateRating once review data is wired up) JSON-LD to every WooCommerce product template. See ## Generated JSON-LD below. This is the single highest-impact fix on the site: it enables Merchant Listing eligibility (price, availability, image in Google Search/Shopping) which no other schema on the site currently supports.

### 2. No AggregateRating/Review schema despite an on-page "4.5 stars / +5000 tevreden klanten" trust widget
- **Severity:** Critical
- **Evidence:** Homepage `text_sample` explicitly contains "+5000 tevreden klanten" and the homepage design references a star-rating widget (per task brief); crawl shows zero `AggregateRating` or `Review` types across all 209 pages, including the 12 dedicated `?reviews=<slug>` customer-review pages (e.g. `/?reviews=karolien` → schema_types = `['WebPage','BreadcrumbList','WebSite','Organization']` only, despite the page's entire purpose being to display one customer's review).
- **Recommendation:** (a) Add `AggregateRating` to Product schema once real per-product rating data is available (unverified whether current rating widget is product-specific or site-wide — if site-wide only, use an Organization/Product-level aggregate cautiously and ensure it reflects real values, not fabricated ones); (b) mark up each `?reviews=` CPT page as a `Review` node (see Quick wins) with `itemReviewed` pointing to the Organization or specific product, `author`, `reviewRating`, `reviewBody`.

### 3. Partner store pages (`?store=<slug>`) carry no LocalBusiness/Store schema
- **Severity:** High
- **Evidence:** `/?store=huis-manendonckx` schema_types = `['WebPage','BreadcrumbList','WebSite','Organization']`. The page title ("Huis Manendonckx - Flavory") and breadcrumb ("Flavory > Huis Manendonckx") confirm this is a physical retail-partner listing, yet there is no address, geo, or LocalBusiness entity — a clear missed opportunity for local pack / "near me" visibility for 10 partner-store pages.
- **Recommendation:** Add `LocalBusiness` (or `Store`) schema per partner page with `name`, `address` (PostalAddress), and ideally `geo`, `telephone`, `openingHoursSpecification` if that data exists in the CPT fields (unverified whether address/geo data is captured in the CMS — confirm with the client before publishing placeholder addresses).

### 4. `Person.url` set to invalid placeholder `"#"` on every blog post author
- **Severity:** Medium
- **Evidence:** `/blog/natuurwijn-kopen/` Person node: `{"@type":"Person","@id":"...#/schema/person/...","name":"Bart","url":"#"}`. `"#"` is not a resolvable absolute URL and fails schema validation best practice (Google's Rich Results Test flags this as a non-fatal warning for `url` on Person, but it is a data-quality issue since Bart likely has no author bio page configured in Yoast). This affects all 56 Person nodes (author bylines) across the 54 Article + 2 BlogPosting pages.
- **Recommendation:** Either configure a real author archive/bio URL in WordPress user profiles (Yoast will auto-populate it) or remove the `url` property entirely rather than emitting a placeholder `#`.

### 5. Inconsistent Article vs. BlogPosting `@type` across ~29 blog posts
- **Severity:** Info
- **Evidence:** Site-wide schema_types tally shows 54 `Article` vs only 2 `BlogPosting` nodes. Google treats Article, NewsArticle, and BlogPosting equivalently for Article rich-result eligibility, so this is not a rich-result blocker, but the inconsistency suggests two different templates/snippets are in play (e.g., one post type manually edited, or a plugin conflict) and complicates future maintenance/auditing.
- **Recommendation:** Standardize all blog posts on `BlogPosting` (or `Article`, whichever matches Yoast's default) via the theme/CPT settings so future audits and any custom schema tooling don't need to special-case two types.

### 6. FAQPage schema present on 7 pages — no Google rich-result benefit, and 3 uses are off-purpose
- **Severity:** Info
- **Evidence:** FAQPage found on `/faq/`, `/de/faq/` (on-topic), plus `/contact/`, `/de/kontakt/`, and 3 product pages (`/shop/bubbelbox/`, `/shop/wijnproeverij-thuis-wit/`, `/shop/witte-wijnspel-chardonnay-of-sauvignon-blanc/`). All Q&A content genuinely matches visible page text (verified against `text_sample`), so this is not spam — but per current Google policy (FAQ rich results retired for all sites as of May 7, 2026), none of these 7 pages will earn a SERP rich result regardless of markup correctness. Any AI/GEO citation benefit is unconfirmed.
- **Recommendation:** No urgent action required; existing markup is technically valid and harmless. Do not invest further engineering effort adding FAQPage to more pages expecting a Google SERP benefit. If genuine user-submitted Q&A exists anywhere (it does not appear to on this site), use `QAPage` instead, never `FAQPage`, going forward.

### 7. Organization schema is minimal — no address, contactPoint, or VAT/legal identifiers
- **Severity:** Medium
- **Evidence:** Organization node (identical on all 208 pages) contains only `name`, `url`, `logo`, and a single `sameAs` (Instagram). No `address`, `contactPoint`, `email`, `telephone`, `vatID`, or additional `sameAs` (e.g., Facebook, TikTok, LinkedIn — unverified which of these exist for Flavory).
- **Recommendation:** Enrich Organization with `address` (PostalAddress — placeholder must be replaced with real registered business address before publishing), `contactPoint` (customer service, using the `info@flavory.wine` address seen in FAQ text), and any additional verified social profiles. See ## Generated JSON-LD.

### 8. No hreflang despite bilingual nl-NL/de site structure (cross-cutting with international SEO, flagged here for context)
- **Severity:** High
- **Evidence:** Crawl confirms `"hreflang": []` on every sampled page including `/` and its `/de/` counterparts, which exist as parallel URL trees (`/de/shop/...`, `/de/blog/...`, `/de/faq/`).
- **Recommendation:** This is primarily an international-SEO/technical-SEO fix (add `hreflang` link tags or an `hreflang` XML sitemap), not a schema.org fix — flagged here only because `inLanguage` is correctly set inside JSON-LD (`nl-NL` / presumably `de-DE`) but that alone does not substitute for `hreflang` annotations. Cross-reference with the technical SEO findings for this site.

### 9. Duplicate/near-duplicate product slugs multiply the missing-Product-schema problem
- **Severity:** Info
- **Evidence:** The DE shop alone contains 11 near-identical slugs for the same product concept (`merlot-oder-cabernet-sauvignon`, `-copy`, `-copy-2`, `-kopie`, `-premium-edition`, etc.). Each of these pages independently lacks Product schema, so the fix in Finding #1 must be applied at the template level (not per-URL) to cover all variants, and the duplicate-slug proliferation itself should be flagged to whoever owns content/duplicate-content cleanup (likely already covered elsewhere in this audit).
- **Recommendation:** Apply the Product/Offer JSON-LD via the WooCommerce single-product template (see Quick wins #1) so it automatically covers all current and future duplicate/variant slugs without manual per-page work.

## Generated JSON-LD

### A. Product + Offer (+ AggregateRating placeholder) for `/shop/wijnproeverij-thuis-rood/`

Values below (`name`, `image`, `price`, `priceCurrency`, `availability`, `description`, `sku`) are taken directly from `product.html` (og:product meta tags and the WooCommerce data layer). **`aggregateRating` is commented out** because no per-product rating count/value could be verified from the supplied data — do not publish a fabricated rating; wire this to real review data first (see Finding #2).

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://flavory.wine/shop/wijnproeverij-thuis-rood/#product",
  "name": "Rode Wijnspel - Het ultieme duel",
  "description": "Organiseer een wijnproeverij bij je thuis. Met dit rode wijnspel (zonder wijnen) regelen wij de beleving en gidsen we je door de avond. Hét ideale cadeau!",
  "sku": "05430004293071",
  "image": [
    "https://flavory.wine/wp-content/uploads/2026/02/8-1.webp",
    "https://flavory.wine/wp-content/uploads/2026/02/6.webp",
    "https://flavory.wine/wp-content/uploads/2025/10/Flavory-PDP-2.webp"
  ],
  "brand": {
    "@type": "Brand",
    "name": "Flavory"
  },
  "url": "https://flavory.wine/shop/wijnproeverij-thuis-rood/",
  "offers": {
    "@type": "Offer",
    "url": "https://flavory.wine/shop/wijnproeverij-thuis-rood/",
    "priceCurrency": "EUR",
    "price": "24.90",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "EUR"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": ["NL", "BE"]
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "businessDays": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"]
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 3,
          "unitCode": "DAY"
        }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": ["NL","BE"],
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn"
    }
  }
  /* Add once real per-product rating data exists — do NOT populate with the
     site-wide "+5000 tevreden klanten" figure, which is not a per-product rating:
  ,"aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "REPLACE_WITH_REAL_VALUE",
    "reviewCount": "REPLACE_WITH_REAL_COUNT"
  }
  */
}
```

Notes:
- `shippingDetails` and `hasMerchantReturnPolicy` are now required by Google for the Merchant Listing experience (as of the 2023+ structured data guidelines) — the values above (free shipping over 2 boxes per homepage banner, 1–3 day delivery per FAQ text, and the "niet-tevreden geld-terug-garantie" per FAQ) should be confirmed against the actual store policy before publishing; the FAQ text does not state an exact return-window day count, so `merchantReturnDays: 30` is a placeholder that must be corrected.
- SKU shown in the raw data layer is `"B001L Merlot/CS (05430004293071)-2"`; the clean GTIN-looking segment `05430004293071` was extracted for `sku` — confirm with the client whether this is actually a GTIN/EAN (if so, use `gtin` instead of/alongside `sku` for stronger Merchant Listing eligibility).

### B. Enhanced Organization (replace the existing `#organization` node sitewide)

Address and phone are **placeholders** — do not publish until the client confirms real registered business details (unverified from crawl data).

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://flavory.wine/#organization",
  "name": "Flavory",
  "url": "https://flavory.wine/",
  "logo": {
    "@type": "ImageObject",
    "@id": "https://flavory.wine/#/schema/logo/image/",
    "url": "https://flavory.wine/wp-content/uploads/2020/12/Flavory-Logo-1.png",
    "contentUrl": "https://flavory.wine/wp-content/uploads/2020/12/Flavory-Logo-1.png",
    "width": 843,
    "height": 267,
    "caption": "Flavory"
  },
  "image": { "@id": "https://flavory.wine/#/schema/logo/image/" },
  "email": "info@flavory.wine",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "REPLACE_WITH_REAL_STREET_ADDRESS",
    "addressLocality": "REPLACE_WITH_CITY",
    "postalCode": "REPLACE_WITH_POSTAL_CODE",
    "addressCountry": "BE"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@flavory.wine",
      "areaServed": ["NL", "BE", "DE"],
      "availableLanguage": ["nl", "de", "en"]
    }
  ],
  "sameAs": [
    "https://www.instagram.com/flavory.wine/?hl=en"
    /* Add any additional verified profiles, e.g. Facebook/TikTok/LinkedIn — unverified from crawl data */
  ]
}
```

### C. Review node for a customer-review CPT page (example: `/?reviews=karolien`)

Only a structural template — actual `reviewRating` value and `reviewBody` text must be pulled from the real CPT field content (not visible in the supplied `text_sample` truncation) before publishing.

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "@id": "https://flavory.wine/?reviews=karolien#review",
  "itemReviewed": {
    "@type": "Product",
    "name": "REPLACE_WITH_PRODUCT_REVIEWED"
  },
  "author": {
    "@type": "Person",
    "name": "Karolien"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "REPLACE_WITH_REAL_VALUE",
    "bestRating": "5"
  },
  "reviewBody": "REPLACE_WITH_REAL_REVIEW_TEXT",
  "datePublished": "2024-11-29"
}
```

### D. LocalBusiness for a partner-store CPT page (example: `/?store=huis-manendonckx`)

Address fields are placeholders — confirm real data exists in the CPT before publishing.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://flavory.wine/?store=huis-manendonckx#localbusiness",
  "name": "Huis Manendonckx",
  "url": "https://flavory.wine/?store=huis-manendonckx",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "REPLACE_WITH_REAL_STREET_ADDRESS",
    "addressLocality": "REPLACE_WITH_CITY",
    "postalCode": "REPLACE_WITH_POSTAL_CODE",
    "addressCountry": "BE"
  },
  "parentOrganization": { "@id": "https://flavory.wine/#organization" }
}
```

## How to enable Product schema without hand-coding every page

Since this is WooCommerce + Yoast SEO 28.4, the recommended paths (in order of effort):

1. **Yoast WooCommerce SEO add-on** — this paid add-on automatically injects `Product`/`Offer`/`AggregateRating` (when WooCommerce Product Reviews are enabled) into the same `@graph` Yoast already outputs, keeping `@id` references consistent with the existing WebPage/Organization nodes. This is the lowest-effort, most maintainable fix and should be evaluated first (unverified whether it's already licensed/installed — the current absence of Product schema suggests it is either not installed or disabled).
2. **WooCommerce core structured data (`wc-structured-data.js` / `WC_Structured_Data` class)** — WooCommerce ships built-in Product schema output by default, hooked into `wp_footer`. Its total absence from every product page here strongly suggests it has been **disabled by the active theme/page builder** (the site uses Elementor-style class names per `product.html`, e.g. `elementor-2897...`) or removed via a `woocommerce_structured_data_type_for_page` / `wc_structured_data` filter, or the theme's `single-product.php` template override doesn't call `wc_get_template_part` hooks that trigger it. Ask the developer to check for a filter unhooking `WC_Structured_Data::generate_product_data()` or a caching layer stripping the footer JSON-LD block.
3. **If neither (1) nor (2) is feasible**, template-level custom JSON-LD (as generated in section A above) can be injected via a small theme function pulling `$product->get_price()`, `get_stock_status()`, `get_sku()`, and `get_image_id()` dynamically — this avoids the risk of stale hardcoded prices.

## Quick wins

1. **Install/enable Yoast WooCommerce SEO or restore WooCommerce core structured data output** on the single-product template — single highest-impact fix, covers ~180 URLs at once (Finding #1).
2. **Fix `Person.url: "#"`** in the Yoast author schema settings (add a real author URL or omit the property) — one settings change fixes all 56 instances (Finding #4).
3. **Add `LocalBusiness` schema to the 10 `?store=` partner pages** using existing CPT fields (name is already there; confirm if address/geo fields exist in the CMS) (Finding #3).
4. **Add `Review` schema to the 12 `?reviews=` customer-review CPT pages** — the content already exists on-page, it just needs schema wrapping (Finding #2).
5. **Enrich the sitewide Organization node** with `address`, `contactPoint` (using the already-public `info@flavory.wine`), and any additional verified `sameAs` profiles (Finding #7) — one template edit, applies to all 208 pages.
6. **Standardize blog post `@type` to one value** (Article or BlogPosting) across all 29 posts for consistency (Finding #5) — low priority, no rich-result impact.
7. **Do not spend further effort adding FAQPage to more pages** expecting Google SERP benefit; treat existing 7 instances as Info-only, harmless (Finding #6).
