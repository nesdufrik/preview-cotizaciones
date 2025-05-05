export function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'approved':
      return 'success'
    case 'sent':
      return 'info'
    case 'rejected':
      return 'error'
    default:
      return 'warning'
  }
}

export function getStatusButtonVariant(status: string): 'primary' | 'secondary' | 'danger' {
  switch (status) {
    case 'approved':
      return 'primary'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

export function getStatusActionLabel(status: string): string {
  switch (status) {
    case 'sent':
      return 'Enviar'
    case 'approved':
      return 'Aprobar'
    case 'rejected':
      return 'Rechazar'
    case 'draft':
      return 'Volver a borrador'
    default:
      return 'Cambiar estado'
  }
}