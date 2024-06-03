//                  _                    #    ▐▄▄▄.▄▄ ·      ▄ .▄            ▄ •▄ .▄▄ ·                
//       __  ____ _| |__   __ _ _   _    #     ·██▐█ ▀.     ██▪▐█▪     ▪     █▌▄▌▪▐█ ▀.                
//       \ \/ / _` | "_ \ / _` | | | |   #   ▪▄ ██▄▀▀▀█▄    ██▀▐█ ▄█▀▄  ▄█▀▄ ▐▀▀▄·▄▀▀▀█▄               
//        >  < (_| | | | | (_| | |_| |   #   ▐▌▐█▌▐█▄▪▐█    ██▌▐▀▐█▌.▐▌▐█▌.▐▌▐█.█▌▐█▄▪▐█               
//       /_/\_\__,_|_| |_|\__,_|\__,_|   #    ▀▀▀• ▀▀▀▀     ▀▀▀ · ▀█▄▀▪ ▀█▄▀▪·▀  ▀ ▀▀▀▀                
//       

import './console'
import './localStorage'

import type { Transaction } from '@transia/xahau-models'

// cache
let $otxn_json: Transaction;

/**
* Configure the max. Emitted transactions this Hook is allowed to send in one execution
*
* @param {number} maxEmittedTransactions - Max. amount of transactions this Hook is allowed to emit.
* @returns {undefined}
*/
export const enableEmit = (maxEmittedTransactions = 1) => {
  etxn_reserve(maxEmittedTransactions)
}

/**
* Return the transaction that triggered this Hook execution as Object.
*
* @returns {object}
*/
export const getTriggerTx = (): Transaction => {
  if (!$otxn_json) $otxn_json = otxn_json()
  return $otxn_json
}

/********************************************************************************************************************* */

/**
* Take a uint8 array and turn it into a UTF-8 string
*
* @param {Uint8Array} ui8arr - The uint8 array to turn into a string
* @returns {string}
*/
export const uint8ArrayToString = (ui8arr: Uint8Array) => {
  return Array.from(ui8arr)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
* Compute a Slot field ID as per slot_ fns, to retrieve a specific slot field from a slotted object
*
* @param {number} serializedType - The serialized type of the field value, can be retrieved from server_definitions
* @param {number} fieldNumber - The field nubmer in the object, can be retrieved from server_definitions (nth)
* @param {boolean} [asHex] - The uint8 array to turn into a string
* @returns {number | string}
*/
export const computeSlotFieldId = (serializedType: number, fieldNumber: number, asHex = false) => {
  const shiftedType = serializedType << 16
  const fieldId = shiftedType | fieldNumber
  
  if (asHex) return `0x${fieldId.toString(16).toUpperCase()}`

  return fieldId
}

/**
* Turn an UTF-8 string into a hexadecimal string
*
* @param {str} string - UTF-8 formatted string
* @returns {string}
*/
export const utf8ToHex = (str: string) => {
  let hex = ''
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code < 0x80) {
      hex += code.toString(16).padStart(2, '0')
    } else if (code < 0x800) {
      hex += (0xc0 | (code >> 6)).toString(16).padStart(2, '0')
      hex += (0x80 | (code & 0x3f)).toString(16).padStart(2, '0')
    } else if (code < 0x10000) {
      hex += (0xe0 | (code >> 12)).toString(16).padStart(2, '0')
      hex += (0x80 | ((code >> 6) & 0x3f)).toString(16).padStart(2, '0')
      hex += (0x80 | (code & 0x3f)).toString(16).padStart(2, '0')
    } else if (code < 0x110000) {
      hex += (0xf0 | (code >> 18)).toString(16).padStart(2, '0')
      hex += (0x80 | ((code >> 12) & 0x3f)).toString(16).padStart(2, '0')
      hex += (0x80 | ((code >> 6) & 0x3f)).toString(16).padStart(2, '0')
      hex += (0x80 | (code & 0x3f)).toString(16).padStart(2, '0')
    }
  }

  return hex
}

/**
* Turn a HEX encoded string into the decoded UTF-8 string
*
* @param {hex} string - HEX formatted string
* @returns {string}
*/
export const hexToUtf8 = (hex: string) => {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byte1 = parseInt(hex.substr(i, 2), 16);

    if (byte1 < 0x80) {
      // 1 byte
      str += String.fromCharCode(byte1);
    } else if (byte1 >= 0xc0 && byte1 < 0xe0) {
      // 2 bytes
      const byte2 = parseInt(hex.substr(i + 2, 2), 16)
      const charCode = ((byte1 & 0x1f) << 6) | (byte2 & 0x3f)
      str += String.fromCharCode(charCode)
      i += 2;
    } else if (byte1 >= 0xe0 && byte1 < 0xf0) {
      // 3 bytes
      const byte2 = parseInt(hex.substr(i + 2, 2), 16)
      const byte3 = parseInt(hex.substr(i + 4, 2), 16)
      const charCode = ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f)
      str += String.fromCharCode(charCode)
      i += 4
    } else if (byte1 >= 0xf0 && byte1 < 0xf8) {
      // 4 bytes
      const byte2 = parseInt(hex.substr(i + 2, 2), 16)
      const byte3 = parseInt(hex.substr(i + 4, 2), 16)
      const byte4 = parseInt(hex.substr(i + 6, 2), 16)
      let charCode = ((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f)
      // Convert the charCode to surrogate pairs
      charCode -= 0x10000
      str += String.fromCharCode((charCode >> 10) + 0xd800)
      str += String.fromCharCode((charCode & 0x3ff) + 0xdc00)
      i += 6
    }
  }
  return str
}
