export function formatCurrency(value, options = {}) {
    const num = Number(value) || 0
    const locale = options.locale || 'en-US'
    const minimumFractionDigits = typeof options.minimumFractionDigits === 'number' ? options.minimumFractionDigits : 2
    const maximumFractionDigits = typeof options.maximumFractionDigits === 'number' ? options.maximumFractionDigits : 2
    return new Intl.NumberFormat(locale, { minimumFractionDigits, maximumFractionDigits }).format(num)
}

export function normalizePhoneNumber(phone) {
    if (!phone) return ''
    let digits = String(phone).replace(/\D/g, '')
    if (digits.startsWith('0')) digits = digits.replace(/^0+/, '')
    return digits
}

export function buildWhatsAppUrl(phone, message) {
    const normalized = normalizePhoneNumber(phone)
    if (!normalized) return null
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
