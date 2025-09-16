export const useFormatCurrency = () => {
  const formatCurrency = (value: number | undefined, currency: string = 'NGN'): string => {
    if (value === undefined || value === null) {
      return '₦0.00'
    }

    let country: string
    if (currency === 'NGN') {
      country = 'NG'
    } else if (currency === 'GHS') {
      country = 'GH'
    } else if (currency === 'USD') {
      country = 'US'
    } else {
      country = 'NG' // Default to Nigeria
    }

    const formatter = new Intl.NumberFormat(`en-${country}`, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    })

    return formatter.format(value)
  }

  const formatPrice = (price: number | undefined): string => {
    if (!price) return '₦0.00'
    // Convert from kobo to naira (divide by 100)
    return formatCurrency(price / 100)
  }

  const formatPriceWithoutSymbol = (price: number | undefined): string => {
    if (!price) return '0.00'
    // Convert from kobo to naira and format without currency symbol
    const value = price / 100
    return new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return {
    formatCurrency,
    formatPrice,
    formatPriceWithoutSymbol,
  }
}
