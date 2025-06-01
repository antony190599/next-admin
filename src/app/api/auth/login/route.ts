import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// En una aplicación real, verificarías contra una base de datos
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123', // En producción: nunca almacenes contraseñas en texto plano
    name: 'Admin User',
    role: 'admin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar los datos de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario (simulado)
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Configurar cookie con el token
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 día
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error en la ruta de login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}