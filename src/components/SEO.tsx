import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
}

const DEFAULT_TITLE = 'Brush n Blends - Handcrafted Indian Art | Fabric & Oil Paintings';
const DEFAULT_DESCRIPTION = 'Brush n Blends creates exquisite hand-painted fabrics, original oil paintings, and unique handcrafts. Commission custom artwork and shop one-of-a-kind pieces.';
const DEFAULT_IMAGE = '/brushnblends-logo.png';
const SITE_NAME = 'Brush n Blends';

export function SEO({ title, description, path = '/', image = DEFAULT_IMAGE, type = 'website' }: SEOProps) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = origin + path;
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const imageUrl = image.startsWith('http') ? image : origin + image;

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: origin,
    logo: origin + '/brushnblends-logo.png',
  };

  const webSiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(organizationLd)}</script>
      <script type="application/ld+json">{JSON.stringify(webSiteLd)}</script>
    </Helmet>
  );
}

export default SEO; 