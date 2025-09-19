export interface Toast {
  id: string
  title: string
  description?: string
  duration?: number
  type?: "success" | "error" | "warning" | "info"
}