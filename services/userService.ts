// Servicio para consumir los endpoints de perfil de usuario del backend

export interface UserProfileUpdate {
  nombre?: string;
  apellido?: string;
  correo_electronico?: string;
  fecha_nacimiento?: string;
  id_color_tema?: number;
}

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  fecha_nacimiento: string;
  fotografia?: string;
  id_color_tema?: number;
  fecha_registro?: string;
  ultimo_acceso?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getUserProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener el perfil');
  const data = await res.json();
  return data.data;
}

export async function updateUserProfile(token: string, update: UserProfileUpdate): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el perfil');
  const data = await res.json();
  return data.data;
}
