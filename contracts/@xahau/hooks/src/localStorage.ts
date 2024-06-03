import { utf8ToHex, uint8ArrayToString, hexToUtf8 } from './index'

const encode = (stringHexOrUtf8: string) => {
  if (stringHexOrUtf8.match(/^[a-f0-9]+$/) && stringHexOrUtf8.length % 2 === 0) {
    // Already hex
    return stringHexOrUtf8
  } else {
    return utf8ToHex(stringHexOrUtf8)
  }
}

/**
* Store key/value pair, returns true if stored, false on error storing the data
*
* @param {string}                                                       key   - string containing a short description of what is being logged
* @param {string|number|Uint8Array|Transaction|null|undefined|AnyJSON}  value - data being logged
* @returns {boolean}
*/
export const setItem = (key: string, value: string | number | boolean | AnyJson): boolean => {
  // TODO: check key and value length
  if (typeof key === 'string' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'object')) {
    if (typeof value === 'string' && value.match(/^[a-f0-9]+$/) && value.length % 2 === 0) {
      // hex, store as hex
      return !!state_set(encode(value), key)
    }
    // Else store as JSON encoded to retain type
    return !!state_set(encode(JSON.stringify({ '$': value })), encode(key))
  }

  // throw new Error('localStorage.setItem: key must be string, value must be string / number / bool')
  return false
}

/**
* Retrieve key/value pair by key, returns null if not found.
*
* @param {string}                                                       key   - string containing a short description of what is to be retrieved
* @returns {string|number|Uint8Array|Transaction|null|undefined|AnyJSON}
*/
export const getItem = (key: string) => {
  const s = state(encode(key))
  if (s <= 0) {
    // Doesnt't exist
    return null
  }

  const r = hexToUtf8(uint8ArrayToString(new Uint8Array(String(s).split(',').map(r => Number(r)))))

  try {
    if (r.slice(0, 5) === '{"$":' && r.slice(-1) === '}') {
      const j = JSON.parse(r)
      return j['$']
    }
  } catch (e) {
    // trace('eeeeeee', (e as Error).message, false)
  }

  return r
}

/**
* Remove key/value pair by key
*
* @param {string}  key   - string containing a short description of what is to be retrieved
* @returns {undefined}
*/
export const removeItem = (key: string) => {
  state_set(undefined, encode(key))
  return // void, undefined
}

Object.assign(globalThis, { localStorage: { setItem, getItem, removeItem, } })
