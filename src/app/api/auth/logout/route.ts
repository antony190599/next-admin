/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Crear respuesta para eliminar la cookie
    const response = NextResponse.json({ success: true });
    
    // Eliminar la cookie de autenticación
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error en la ruta de logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}