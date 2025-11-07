export function formatDate(startDate: string, endDate: string): string {
  try {
    // Ajusta para timezone local
    const start = new Date(new Date(startDate).getTime() + new Date(startDate).getTimezoneOffset() * 60000)
    const end = new Date(new Date(endDate).getTime() + new Date(endDate).getTimezoneOffset() * 60000)

    const startFormatted = start.toLocaleDateString('pt-BR')
    const endFormatted = end.toLocaleDateString('pt-BR')

    return `${startFormatted} - ${endFormatted}`
  } catch (e) {
    console.error("Erro ao formatar data:", e)
    return 'Datas inválidas'
  }
}
