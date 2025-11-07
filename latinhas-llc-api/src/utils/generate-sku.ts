export function generateSKU(prefix = 'LAT'): string {
  const date = new Date()
  const datePart = date.getFullYear().toString().slice(2) + (date.getMonth() + 1).toString().padStart(2, '0')
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${datePart}${randomPart}`
}