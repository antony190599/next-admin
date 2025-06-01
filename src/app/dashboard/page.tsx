'use client';

import ProtectedRoute from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-contexts';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Bienvenido, {user?.name}!</p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-medium">Analytics</h2>
            <p className="text-sm text-muted-foreground">Ver datos analíticos</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-medium">Usuarios</h2>
            <p className="text-sm text-muted-foreground">Gestionar usuarios</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-medium">Contenido</h2>
            <p className="text-sm text-muted-foreground">Editar contenido</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-medium">Configuración</h2>
            <p className="text-sm text-muted-foreground">Ajustes del sistema</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}