import type { Transaction } from '@transia/xahau-models'

/**
* Send logging to the Xahaud Trace log
*
* @param {string}                                                       key   - string containing a short description of what is being logged
* @param {string|number|Uint8Array|Transaction|null|undefined|AnyJson}  value - data being logged
* @returns {undefined}
*/
export const log = (key: string, value: string | number | Uint8Array | Transaction | null | undefined | boolean | AnyJson) => {
  // If Uint8 array: always force HEX
  const asHex = Array.isArray(value) && value.filter(a => typeof a !== 'number' || a < 0 || a > 255).length === 0
  if (typeof value === 'boolean') return trace(key || '', value ? 'Bool: true' : 'Bool: false', false)
  if (typeof value === 'number') return trace(key || '', value, false)
  if (value) return trace(key || '', value, !!asHex)
  return trace(key || '', 'Empty: ' + ((value === null) ? 'null' : typeof value), false)
}

Object.assign(globalThis, { console: { log, } })
