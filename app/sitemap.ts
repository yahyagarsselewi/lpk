import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://kairouan-connect.lovable.app/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://kairouan-connect.lovable.app/guide', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
