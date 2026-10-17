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

export async function getCompanyInfo() {
  try {
    const res = await fetch(`${API_URL}/public/company`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}

export async function getFeaturedProjects() {
  try {
    const res = await fetch(`${API_URL}/public/projects/featured`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getAllPublicProjects(page = 0, size = 12) {
  try {
    const res = await fetch(`${API_URL}/public/projects?page=${page}&size=${size}`, { next: { revalidate: 0 } });
    if (!res.ok) return { content: [] };
    return await res.json();
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return { content: [] };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/public/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching project ${slug}:`, error);
    return null;
  }
}

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

export async function uploadMedia(token: string, file: File, mediaType: string, entityType: string, entityId: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mediaType', mediaType);
  formData.append('entityType', entityType);
  formData.append('entityId', entityId);

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

export async function getProperties(projectId: string) {
  try {
    const res = await fetch(`${API_URL}/public/properties?projectId=${projectId}&page=0&size=100`, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return null;
  }
}

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
