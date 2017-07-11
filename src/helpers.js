/**
 * Created by vahid on 7/11/17.
 */

export function encodeQueryString (array) {
  return array.map(k => `${encodeURIComponent(k[0])}=${encodeURIComponent(k[1])}`).join('&')
}
