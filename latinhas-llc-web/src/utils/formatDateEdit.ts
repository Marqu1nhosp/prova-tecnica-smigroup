// recebe 2025-11-05T15:30:00.000Z 
// saída 2025-11-05
export function formatDateEdit(dateString: string) {
  return dateString.split('T')[0] 
}