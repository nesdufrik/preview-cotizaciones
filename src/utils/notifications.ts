type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationOptions {
  title: string
  message: string
  type: NotificationType
  duration?: number
}

export function showNotification({ title, message, type, duration = 3000 }: NotificationOptions) {
  // In a real app, this would integrate with a notification system
  console.log(`[${type.toUpperCase()}] ${title}: ${message}`)
}