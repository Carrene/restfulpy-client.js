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
