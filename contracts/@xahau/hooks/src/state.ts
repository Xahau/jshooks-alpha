import { utf8ToHex, uint8ArrayToString, hexToUtf8 } from './index'
import type { Transaction, AnyJson } from './index'

const encode = (stringHexOrUtf8: string | Uint8Array) => {
  if (stringHexOrUtf8 instanceof Uint8Array || stringHexOrUtf8.match(/^[a-f0-9]+$/) && stringHexOrUtf8.length % 2 === 0) {
    // Already hex
    return stringHexOrUtf8
  } else {
    return utf8ToHex(stringHexOrUtf8)
  }
}

interface foreignState {
  namespace: string
  accountid: string
}

const foreignStateFormatter = (foreign: foreignState): [ string, string ] => {
  return [
    foreign.namespace,
    foreign.accountid.match(/^r/) ? util_accid(foreign.accountid) : foreign.accountid,
  ]
}

/**
* Store key/value pair, returns true if stored, false on error storing the data
*
* @param key   string containing a short description of what is being logged
* @param value data being logged
*/
export const setState = (key: string | Uint8Array, value: string | number | boolean | AnyJson | Uint8Array | string[] | number[] | boolean[], foreign?: foreignState): boolean => {
  // TODO: check key and value length
  if (typeof key === 'string' && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'object')) {
    if (typeof value === 'string' && value.match(/^[a-f0-9]+$/) && value.length % 2 === 0) {
      // hex, store as hex
      return foreign
        ? !!state_foreign_set(encode(value), key, ...foreignStateFormatter(foreign))
        : !!state_set(encode(value), key)
    }
    // Else store as JSON encoded to retain type
    return foreign
      ? !!state_foreign_set(encode(JSON.stringify({ '$': value })), encode(key), ...foreignStateFormatter(foreign))
      : !!state_set(encode(JSON.stringify({ '$': value })), encode(key))
  }

  // throw new Error('localStorage.setItem: key must be string, value must be string / number / bool')
  return false
}



/**
* Retrieve key/value pair by key, returns null if not found.
*
* @param key string containing a short description of what is to be retrieved
*/
export const getState = (key: string, foreign?: foreignState): string | number | Uint8Array | Transaction | null | undefined | AnyJson => {
  const s = foreign
    ? state_foreign(encode(key), ...foreignStateFormatter(foreign))
    : state(encode(key))

  if (!s || (typeof s === 'number' && s <= 0)) {
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
* @param key string containing a short description of what is to be retrieved
*/
export const removeState = (key: string, foreign?: foreignState): number | null | undefined => {
  return foreign
    ? state_foreign_set(undefined, encode(key), ...foreignStateFormatter(foreign))
    : state_set(undefined, encode(key))
}
