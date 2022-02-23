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

export const formatTimestamp = (timestamp: any) => {
  var a = new Date(timestamp * 1000)
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = a.getDate()
  var hour = a.getHours()
  var min = a.getMinutes()
  var sec = a.getSeconds()
  var time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}

export const convertTokenToUSD = (
  balance: number,
  quote: number,
  round?: boolean,
) => (round ? Math.round(balance * quote * 10000) / 10000 : balance * quote)

export const convertUSDtoToken = (
  balance: number,
  quote: number,
  round?: boolean,
) => (round ? Math.round((balance / quote) * 10000) / 10000 : balance / quote)
