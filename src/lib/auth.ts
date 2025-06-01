import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Tipos
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Obtener el usuario a partir de la cookie de la solicitud
export function getUserFromRequest(request: NextRequest): User | null {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as User;
    
    return decoded;
  } catch (error) {
    console.error('Error al obtener usuario de la solicitud:', error);
    return null;
  }
}