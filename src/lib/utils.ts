export function shortAddress(address?: string): string {
  if (!address) {
    return ''
  }

  return `${address.substr(0, 6)}...${address.substr(
    address.length - 4,
    address.length,
  )}`
}
