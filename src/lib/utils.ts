export function shortAddress(address?: string): string {
  if (!address) {
    return ''
  }

  return `${address.substr(0, 6)}...${address.substr(
    address.length - 4,
    address.length,
  )}`
}

export const roundBalance = (num: string) => {
  const number = parseFloat(num)
  return Math.round(number * 10000) / 10000
}
