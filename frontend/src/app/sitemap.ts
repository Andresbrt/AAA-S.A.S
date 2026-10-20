import { MetadataRoute } from 'next';
import { getAllPublicProjects } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupoaaasas.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/proyectos/corales-del-viento`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/legal/politica-de-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/terminos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic project routes from API
  try {
    const projectsData = await getAllPublicProjects(0, 100);
    if (projectsData && projectsData.content && Array.isArray(projectsData.content)) {
      const dynamicProjectRoutes: MetadataRoute.Sitemap = projectsData.content.map((p: any) => ({
        url: `${SITE_URL}/proyectos/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));

      // Deduplicate in case corales-del-viento is already in staticRoutes
      const urls = new Set(staticRoutes.map(r => r.url));
      for (const route of dynamicProjectRoutes) {
        if (!urls.has(route.url)) {
          staticRoutes.push(route);
          urls.add(route.url);
        }
      }
    }
  } catch (e) {
    // Graceful fallback to static routes if backend is asleep
  }

  return staticRoutes;
}
