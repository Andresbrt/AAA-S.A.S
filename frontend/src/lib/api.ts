const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

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
    const res = await fetch(`${API_URL}/public/projects/featured`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
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
