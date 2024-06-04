import type { Transaction } from '@transia/xahau-models'
import type { AnyJson } from './index'

/**
* Send logging to the Xahaud Trace log
*
* @param key   string containing a short description of what is being logged
* @param value data being logged
*/
export const log = (key: string, value: string | number | Uint8Array | Transaction | null | undefined | boolean | AnyJson | string[] | boolean[] | number[] | AnyJson[]) => {
  // If Uint8 array: always force HEX
  const asHex = Array.isArray(value) && value.filter(a => typeof a !== 'number' || a < 0 || a > 255).length === 0
  if (typeof value === 'boolean') return trace(key || '', value ? 'Bool: true' : 'Bool: false', false)
  if (typeof value === 'number') return trace(key || '', value, false)
  if (value) return trace(key || '', value, !!asHex)
  return trace(key || '', 'Empty: ' + ((value === null) ? 'null' : typeof value), false)
}

Object.assign(globalThis, { console: { log, } })
