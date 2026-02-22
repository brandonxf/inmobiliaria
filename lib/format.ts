export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export function getEstadoLabel(estado: string): string {
  const labels: Record<string, string> = {
    disponible: 'Disponible',
    reservado: 'Reservado',
    vendido: 'Vendido',
    activa: 'Activa',
    completada: 'Completada',
    cancelada: 'Cancelada',
    pendiente: 'Pendiente',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    en_proceso: 'En Proceso',
    resuelto: 'Resuelto',
    cerrado: 'Cerrado',
  }
  return labels[estado] || estado
}

export function getEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    disponible: 'bg-accent text-accent-foreground',
    reservado: 'bg-chart-4/20 text-chart-4',
    vendido: 'bg-destructive/10 text-destructive',
    activa: 'bg-accent text-accent-foreground',
    completada: 'bg-accent text-accent-foreground',
    cancelada: 'bg-destructive/10 text-destructive',
    pendiente: 'bg-chart-4/20 text-chart-4',
    aprobado: 'bg-accent text-accent-foreground',
    rechazado: 'bg-destructive/10 text-destructive',
    en_proceso: 'bg-chart-3/20 text-chart-3',
    resuelto: 'bg-accent text-accent-foreground',
    cerrado: 'bg-muted text-muted-foreground',
  }
  return colors[estado] || 'bg-muted text-muted-foreground'
}

export function getPqrsTypeLabel(tipo: string): string {
  const labels: Record<string, string> = {
    peticion: 'Peticion',
    queja: 'Queja',
    reclamo: 'Reclamo',
    sugerencia: 'Sugerencia',
  }
  return labels[tipo] || tipo
}
