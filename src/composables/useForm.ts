import { ref, computed } from 'vue'
import type { ZodSchema, ZodError } from 'zod'
import { showNotification } from '@/utils/notifications'

export function useForm<T extends object>(schema: ZodSchema, initialData?: Partial<T>) {
  const data = ref(initialData || {}) as { value: Partial<T> }
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref(false)

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  function validate(): boolean {
    try {
      schema.parse(data.value)
      errors.value = {}
      return true
    } catch (error) {
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as ZodError
        errors.value = zodError.errors.reduce((acc: Record<string, string>, curr) => {
          acc[curr.path.join('.')] = curr.message
          return acc
        }, {})
      } else {
        errors.value = { form: 'Error de validación desconocido' }
      }
      return false
    }
  }

  async function handleSubmit(onSubmit: (data: T) => Promise<void>) {
    if (!validate()) {
      showNotification({
        title: 'Error de validación',
        message: 'Por favor, corrija los errores en el formulario',
        type: 'error'
      })
      return
    }

    isSubmitting.value = true
    try {
      await onSubmit(data.value as T)
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Error al procesar el formulario',
        type: 'error'
      })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    data,
    errors,
    isValid,
    isSubmitting,
    validate,
    handleSubmit,
    setData: (newData: Partial<T>) => {
      data.value = { ...data.value, ...newData }
    }
  }
}