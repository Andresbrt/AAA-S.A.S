import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ProjectRequest {
  name: string;
  shortDescription?: string;
  longDescription?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  estimatedDelivery?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  cityId?: string;
  neighborhoodId?: string;
  metaTitle?: string;
  metaDescription?: string;
  amenityIds?: string[];
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}

export interface PropertyRequest {
  projectId: string;
  name?: string;
  type: string;
  builtArea?: number | null;
  privateArea?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpots?: number | null;
  stratum?: number | null;
  price?: number | null;
  status?: string;
  floorOrTower?: string;
}

export interface LeadRequest {
  projectId?: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  source?: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3500): Promise<Response> {
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.IS_BUILD_TIME === 'true') {
    throw new Error('Build-phase: skipping remote fetch to avoid CI/CD timeout');
  }
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export const DEFAULT_COMPANY_INFO = {
  company: {
    id: "c1000000-0000-0000-0000-000000000001",
    name: "GRUPO AAA S.A.S.",
    aboutUs: "Somos una empresa inmobiliaria comprometida con el desarrollo de proyectos campestres y costeros en el Caribe colombiano.",
    mission: "Desarrollar y comercializar proyectos inmobiliarios que generen valor y bienestar para nuestros clientes, ofreciendo inmuebles con potencial de crecimiento, calidad y ubicación estratégica. Trabajamos con compromiso, transparencia y responsabilidad, acompañando a nuestros clientes durante el proceso de adquisición y construyendo relaciones basadas en la confianza.",
    vision: "Consolidarnos como una empresa referente en el sector inmobiliario, reconocida por la calidad de nuestros proyectos, la confianza de nuestros clientes y nuestra capacidad para identificar y desarrollar oportunidades de inversión. Buscamos crecer de manera sostenible, ampliando nuestro portafolio y contribuyendo al desarrollo de espacios que mejoren la calidad de vida y generen valor a largo plazo.",
    contactEmail: "aaagrupo.med@gmail.com",

    contactPhone: "+57 312 238 4172",
    contactAddress: "",
    whatsappNumber: "573122384172",
    whatsappMessage: "Hola, me interesa conocer más sobre el Portafolio de Proyectos de Grupo AAA.",
    instagramUrl: "https://www.instagram.com/grupoaaa_inversiones?stkn=M204eDJoaWJuZXRs",
    facebookUrl: "https://www.facebook.com/share/1CYRi2nCtT/?mibextid=wwXIfr",
    tiktokUrl: "https://www.tiktok.com/@grupo.aaa?_r=1&_t=ZS-9A6rSjywCjl",
    youtubeUrl: "",
    heroVideoUrl: "/videos/hero-background.mp4",
    heroTitle: "Vive el lujo en\ntu lugar ideal",
    heroSubtitle: "Descubre nuestros condominios y proyectos costeros diseñados para un estilo de vida excepcional."
  },

  team: []
};

export const getCompanyInfo = cache(async () => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/public/company`, { next: { revalidate: 60 } }, 3500);
    if (!res.ok) return DEFAULT_COMPANY_INFO;
    return await res.json();
  } catch (error) {
    return DEFAULT_COMPANY_INFO;
  }
});

export const getFeaturedProjects = cache(async () => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/public/projects/featured`, { next: { revalidate: 60 } }, 3500);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
});

export const getAllPublicProjects = cache(async (page = 0, size = 12) => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/public/projects?page=${page}&size=${size}`, { next: { revalidate: 60 } }, 3500);
    if (!res.ok) return { content: [] };
    return await res.json();
  } catch (error) {
    return { content: [] };
  }
});

export const getProjectBySlug = cache(async (slug: string) => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/public/projects/${slug}`, { next: { revalidate: 60 } }, 3500);
    if (res.ok) return await res.json();

    // Soporte transparente para slugs alternativos de Corales del Viento
    if (slug === 'corales-del-viento') {
      const altRes = await fetchWithTimeout(`${API_URL}/public/projects/condominio-campestre-corales-del-viento`, { next: { revalidate: 60 } }, 3500);
      if (altRes.ok) return await altRes.json();
    } else if (slug === 'condominio-campestre-corales-del-viento') {
      const altRes = await fetchWithTimeout(`${API_URL}/public/projects/corales-del-viento`, { next: { revalidate: 60 } }, 3500);
      if (altRes.ok) return await altRes.json();
    }
    return null;
  } catch (error) {
    return null;
  }
});

export async function createLead(data: LeadRequest) {
  try {
    const res = await fetch(`${API_URL}/public/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al enviar el formulario');
    }
    return await res.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

// ---------------- ADMIN API ----------------

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
}

export async function verifyMfa(mfaToken: string, code: string) {
  const res = await fetch(`${API_URL}/auth/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mfaToken, code }),
  });
  if (!res.ok) throw new Error('Código MFA inválido o expirado');
  return res.json();
}

// Interceptor para redireccionar en caso de token expirado (401)
async function handleResponse(res: Response, errorMessage: string) {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/portal-asesores';
    }
    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
  }
  if (!res.ok) {
    let msg = errorMessage;
    try {
      const errorData = await res.json();
      if (errorData.message) msg = errorData.message;
      else if (errorData.detail) msg = errorData.detail;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getDashboardStats(token: string) {
  try {
    const res = await fetch(`${API_URL}/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export async function updateCompanySettings(token: string, id: string, data: any) {
  const res = await fetch(`${API_URL}/admin/company/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Error al actualizar los ajustes de la empresa');
}

export async function getAdminLeads(token: string) {
  try {
    const res = await fetch(`${API_URL}/admin/leads?page=0&size=10`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    return null;
  }
}

export async function updateLeadStatus(token: string, id: string, status: string) {
  const res = await fetch(`${API_URL}/admin/leads/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al actualizar estado del lead');
}

export async function getAdminProjects(token: string) {
  try {
    const res = await fetch(`${API_URL}/admin/projects?page=0&size=50`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}

export async function createProject(token: string, data: ProjectRequest) {
  const res = await fetch(`${API_URL}/admin/projects`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Error al crear el proyecto');
}

export async function updateProject(token: string, id: string, data: Partial<ProjectRequest>) {
  const res = await fetch(`${API_URL}/admin/projects/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Error al actualizar el proyecto');
}

export async function deleteProject(token: string, id: string) {
  const res = await fetch(`${API_URL}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al eliminar el proyecto');
}

export interface PresignedUploadResponse {
  fileKey: string;
  uploadUrl: string;
  publicUrl: string;
  httpMethod: string;
  headers?: Record<string, string>;
}

export async function uploadMedia(
  token: string,
  file: File,
  mediaType: string,
  entityType: string,
  entityId: string,
  altText: string = '',
  displayOrder: number = 0
): Promise<MediaFile> {
  // 1. Intento de subida directa con Presigned URL (cero consumo de CPU/RAM en el backend de Render)
  try {
    const presignRes = await fetch(`${API_URL}/admin/media/presign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        mediaType,
        entityType,
        entityId,
        fileSize: file.size
      })
    });

    if (presignRes.ok) {
      const presignData: PresignedUploadResponse = await presignRes.json();
      
      const uploadHeaders: Record<string, string> = {
        'Content-Type': file.type || 'application/octet-stream',
        ...(presignData.headers || {})
      };

      const directRes = await fetch(presignData.uploadUrl, {
        method: presignData.httpMethod || 'PUT',
        headers: uploadHeaders,
        body: file
      });

      if (directRes.ok) {
        // Confirmar en el backend y persistir metadatos
        const confirmRes = await fetch(`${API_URL}/admin/media/complete-direct-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileKey: presignData.fileKey,
            url: presignData.publicUrl,
            originalName: file.name,
            contentType: file.type || 'application/octet-stream',
            fileSize: file.size,
            mediaType,
            entityType,
            entityId,
            altText,
            displayOrder
          })
        });

        if (confirmRes.ok) {
          return await confirmRes.json();
        }
      }
    }
  } catch (err) {
    console.warn('Subida directa con URL prefirmada no disponible, usando fallback multipart:', err);
  }

  // 2. Fallback estándar multipart/form-data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mediaType', mediaType);
  formData.append('entityType', entityType);
  formData.append('entityId', entityId);
  formData.append('altText', altText);
  formData.append('displayOrder', String(displayOrder));

  const res = await fetch(`${API_URL}/admin/media`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  return handleResponse(res, 'Error al subir el archivo');
}


export interface MediaFile {
  id: string;
  url: string;
  originalName: string;
  contentType: string;
  fileSize: number;
  mediaType: string;
  displayOrder: number;
  altText?: string;
  entityType: string;
  entityId: string;
}

export async function getMedia(token: string, entityType: string, entityId: string): Promise<MediaFile[]> {
  const res = await fetch(`${API_URL}/admin/media?entityType=${entityType}&entityId=${entityId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });
  return handleResponse(res, 'Error al cargar los archivos');
}

export async function deleteMedia(token: string, id: string) {
  const res = await fetch(`${API_URL}/admin/media/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al eliminar el archivo');
}

// ---------------- PROPERTIES API ----------------

export const getProperties = cache(async (projectId: string) => {
  try {
    const res = await fetchWithTimeout(`${API_URL}/public/properties?projectId=${projectId}&page=0&size=100`, { next: { revalidate: 60 } }, 3500);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
});

export async function createProperty(token: string, data: PropertyRequest) {
  const res = await fetch(`${API_URL}/admin/properties`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Error al crear el inmueble');
}

export async function updateProperty(token: string, id: string, data: Partial<PropertyRequest>) {
  const res = await fetch(`${API_URL}/admin/properties/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, 'Error al actualizar el inmueble');
}

export async function deleteProperty(token: string, id: string) {
  const res = await fetch(`${API_URL}/admin/properties/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al eliminar el inmueble');
}
