/**
 * Created by vahid on 7/11/17.
 */

export function encodeQueryString (obj) {
  if (Array.isArray(obj)) {
    return obj.map(k => `${encodeURIComponent(k[0])}=${encodeURIComponent(k[1])}`).join('&')
  } else {
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.getHashCode = function () {
  let hash = 0
  if (this.length === 0) {
    return hash
  }
  for (let i = 0; i < this.length; i++) {
    hash = ((hash << 5) - hash) + this.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export function getObjectHashCode (obj) {
  let items = Object.keys(obj).map(k => [k, (obj[k] || '').toString()])
  items.sort()
  return encodeQueryString(items).getHashCode()
}
