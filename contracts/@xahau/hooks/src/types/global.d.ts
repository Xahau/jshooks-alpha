import type { log } from '../console'
import type { Transaction } from '@transia/xahau-models'

export type AnyJson = {
  [key: string]: AnyJson | boolean | string | number | string[] | boolean[] | number[] | AnyJson[]
}

declare global {

  /********************************************************************************************************************* */
  
  const console = {
    /**
    * Send logging to the Xahaud Trace log
    *
    * @param key   string containing a short description of what is being logged
    * @param value data being logged
    */
   log: log
  }

  /**
   * Write logging information to the trace log of nodes. Used for debugging purposes.
   *
   * @param message The 'logging key', message to output before the buffer (can be null)
   * @param data    The data to log
   * @param hex     (Optional) Should it log formatted in HEX?
   * @returns       int64_t, value is 0 if successful, If negative, an error: OUT_OF_BOUNDS
   */
  const trace: (
    message: string | null,
    data: string | number | Uint8Array | Transaction | boolean | AnyJson | string[] | boolean[] | number[] | AnyJson[],
    hex?: boolean,
 ) => number

  /********************************************************************************************************************* */

  /**
   * Definition of a Hook (smart contract) written in TS/JS.
   *
   * @param reserved uint32_t, Reserved for future use.
   * @returns        int64_t, An arbitrary return code you wish to return from your hook. This will
   *                 be present in the metadata of the originating transaction.
   */
  type Hook = (tx: Transaction, reserved?: number) => number

  /**
   * Definition of a Hook Callback - user defined function called in order to inform your hook about the
   * status of a previously emitted transaction. State changes and further emit calls can be made from
   * cbak but it cannot rollback a transaction. When Callback is executed the emitted transaction to
   * which the callback relates is now the originating transaction.
   *
   * @param emittedTxError uint32_t, If 0: the emittted transaction to which this callback
   *                       relates was successfully accepted into a ledger.
   *                       If 1: the emitted transaction to which the callback relates was NOT
   *                       successfully accepted into a ledger before it expired.
   * @returns              int64_t, An arbitrary return code you wish to return from your hook.
   *                       This will be present in the metadata of the originating transaction.
   */
  type Callback = (tx: Transaction, emittedTxError?: number) => number

/********************************************************************************************************************* */

  /**
   * Accept the originating transaction and commit any changes the hook made. End the execution of the hook
   * with status: success. Record a return string and return code in transaction metadata. Commit all state
   * changes. Submit all emit() transactions, allow originating transaction to continue.
   *
   * @param msg    String to be stored in execution metadata. This is any string the 
   *               hook-developer wishes to return with the acceptance. 
   * @param code   A return code specific to this hook to be stored in execution metadata.
   *               Similar to the return code of an application on a *nix system.
   *               By convention success is zero.
   * @returns      int64_t, accept ends the hook, therefore no value is returned to the
   *               caller. By convention all Hook APIs return int64_t, but in this
   *               case nothing is returned.
   */
  const accept: (
    msg: string,
    code: number,
 ) => number

/********************************************************************************************************************* */

  /**
   * Reject the originating transaction and discard any changes the hook made. End the execution of the
   * hook with status: reject. Record a return string and return code in transaction metadata. Discard all
   * state changes. Discard all emit() transactions. Disallow originating transaction to continue.
   * 
   * The originating transaction will fail with tecHOOK_REJECTED and a fee will be charged
   *
   * @param error_msg     String to be stored in execution metadata. This is any string the 
   *                      hook-developer wishes to return with the rollback. 
   * @param error_code    A return code specific to this hook to be stored in execution metadata.
   *                      Similar to the return code of an application on a *nix system.
   *                      By convention success is zero.
   * @returns             int64_t, rollback ends the hook, therefore no value is returned to
   *                      the caller. By convention all Hook APIs return int64_t, but in this
   *                      case nothing is returned.
   */
  const rollback: (
    error_msg: string,
    error_code: number,
 ) => number

/********************************************************************************************************************* */

  /**
   * Configure the amount of transactions this Hook is allowed to emit.
   *
   * @param txCount The max. amount of transactions this Hook is allowed to emit in its lifecycle
   */
  const etxn_reserve: (txCount: number) => undefined

  /**
  * Return the transaction that triggered this Hook execution as Object.
  */
  const otxn_json: () => Transaction // Triggering transaction

  /**
   * Format an Acocunt ID as r-address
   *
   * @param accountid The HEX accountid to return as r-address
   */
  const util_raddr: (accountid: string) => string

  /**
   * Format an r-address as Account ID
   *
   * @param raddress The r-address to format as HEX accountid
   */
  const util_accid: (raddress: string) => string
  
  /**
   * Prepare a JSON transaction for being Emitted
   *
   * @param txJson The transaction JSON, must be a complete transaction except for Account (always the Hook account)
   */
  const prepare: (txJson: Transaction | Omit<Transaction, 'Account'>) => Transaction
  
  /**
   * Emit a transaction, returns number on error, Uint8Array of emitted TX Hash in case of emit success
   *
   * @param txJson The TX JSON to emit
   */
  const emit: (txJson: Transaction) => number | Uint8Array

  /**
   * Verify a cryptographic signature. If the public key is prefixed with 0xED then use ED25519, otherwise assume SECP256k1
   *
   * @param signedData The signed data to verify
   * @param signature The signature (secp256k1 / ed25519)
   * @param pubkey The public key responsible for the signature
   * @returns Number 1: validation succeeded, the signature is valid, Number 0 if the signature is invalid
   */
  const util_verify: (signedData: string | Uint8Array, signature: string | Uint8Array, pubkey: string | Uint8Array) => number
  
  /**
   * Format an STO object (binary encoded ledger data) as JSON format
   *
   * @param blob The blob (e.g. serialized transaction)
   * @returns Decoded JSON
   */
  const sto_to_json: (blob: string | Uint8Array) => Uint8Array | number | string | AnyJson | Transaction

  /**
   * Validate an STO object (binary encoded ledger data)
   *
   * @param blob The blob (e.g. serialized transaction)
   * @returns Returns number 1 if the STObject pointed to by read_ptr is a valid STObject, 0 if it isn't.
   */
  const sto_validate: (blob: string | Uint8Array) => number

  /**
   * Format JSON as an STO object (binary encoded ledger data)
   *
   * @param jsonobj JSON object
   * @returns STO Object (binary encoded ledger data)
   */
  const sto_from_json: (jsonobj: AnyJson | Transaction) => string | Uint8Array

  /**
   * Compute an sha512-half over some data
   *
   * @param data The data to compute the hash over
   * @returns Sha512half hash
   */
  const util_sha512h: (data: Uint8Array | string) => Uint8Array | string

  /**
   * Search for a keylet within a specified range on the current ledger
   * Search the ledger for the first (lowest) Keylet of this type in this range
   *
   * @param low Pointer to the 34 byte serialised Keylet that represents the lower boundary of the Keylet range to search
   * @param high Pointer to the 34 byte serialised Keylet that represents the upper boundary of the Keylet range to search
   * @returns The number of bytes written (34 bytes) on success
   */
  const ledger_keylet: (low: Uint8Array | string, high: Uint8Array | string) => number

  /**
   * Retreive the 20 byte Account ID the Hook is executing on
   *
   * @returns Account ID the Hook is executing on
   */
  const hook_account: () => Uint8Array | string

  /**
   * Look up the hash of the hook installed on hook account at position hookno
   *
   * @param hookno The position in the hook chain the hook is located at, or -1 for the currently executing hook
   * @returns Namespace biased SHA512H of the currently executing Hook,
   */
  const hook_hash: (hookno: number) => Uint8Array | string

  /**
   * Look up the value for a named parameter specified on the originating transaction (ttINVOKE only)
   *
   * @param paramname Parameter's name
   * @returns Param's value
   */
  const otxn_param: (paramname: Uint8Array | string) => Uint8Array | string

  /**
   * Return the Transaction Type of the originating transaction
   *
   * @returns Transaction Type:
   *                  ttPAYMENT:	0
   *                  ttESCROW_CREATE:	1
   *                  ttESCROW_FINISH:	2
   *                  ttACCOUNT_SET:	3
   *                  ttESCROW_CANCEL:	4
   *                  ttREGULAR_KEY_SET:	5
   *                  ttOFFER_CREATE:	7
   *                  ttOFFER_CANCEL:	8
   *                  ttTICKET_CREATE:	10
   *                  ttTICKET_CANCEL:	11
   *                  ttSIGNER_LIST_SET:	12
   *                  ttPAYCHAN_CREATE:	13
   *                  ttPAYCHAN_FUND:	14
   *                  ttPAYCHAN_CLAIM:	15
   *                  ttCHECK_CREATE:	16
   *                  ttCHECK_CASH:	17
   *                  ttCHECK_CANCEL:	18
   *                  ttDEPOSIT_PREAUTH:	19
   *                  ttTRUST_SET:	20
   *                  ttACCOUNT_DELETE:	21
   *                  ttHOOK_SET:	22
   *                  ttURITOKEN_MINT:	45
   *                  ttURITOKEN_BURN:	46
   *                  ttURITOKEN_BUY:	47
   *                  ttURITOKEN_CREATE_SELL_OFFER:	48
   *                  ttURITOKEN_CANCEL_SELL_OFFER:	49
   *                  ttGENESIS_MINT:	96
   *                  ttIMPORT:	97
   *                  ttCLAIM_REWARD:	98
   *                  ttINVOKE:	99
   *                  ttAMENDMENT:	100
   *                  ttFEE:	101
   *                  ttUNL_MODIFY:	102
   *                  ttEMIT_FAILURE:	103
   *                  ttUNL_REPORT:	104
   */
  const otxn_type: () => number

  /**
   * Get Hook State
   *
   * @param key Key of the Hook State
   * @returns Hook State value for key
   */
  const state: (key: string | Uint8Array) => string | number | undefined | null

  /**
   * Set Hook State
   *
   * @param value The value of data to persist
   * @param key Key of the Hook State
   * @returns The number of bytes written to Hook State (the length of the data), negative on error.
   */
  const state_set: (value: string | Uint8Array | undefined, key: string | Uint8Array) => number

  /**
   * Get Foreign Hook State (belonging to another account)
   *
   * @param key Key of the Hook State
   * @param namespace The Hook namespace to look in
   * @param accountid The owner of the state
   * @returns Hook State value for key
   */
  const state_foreign: (key: string | Uint8Array, namespace: string, accountid: string) => string | number | undefined | null

  /**
   * Set Foreign Hook State - Authorized, needs a Grant to allows this
   *
   * @param value The value of data to persist
   * @param key Key of the Hook State
   * @param namespace The Hook namespace to look in
   * @param accountid The owner of the state
   * @returns The number of bytes written to Hook State (the length of the data), negative on error.
   */
  const state_foreign_set: (value: string | Uint8Array | undefined, key: string | Uint8Array, namespace: string, accountid: string) => number

  /**
   * Output the canonical hash of the originating transaction
   *
   * @param flag 0 = hash of the originating transaction, flag 1 & emit_failure = hash of emitting tx
   * @returns TX Hash
   */
  const otxn_id: (flag: number) => Uint8Array | string

  /********************************************************************************************************************* */
  /***                                   LOTS TO DO BELOW - NEEDS MORE TYPES                                         *** */
  /********************************************************************************************************************* */

  const sto_subfield: (sto: string | Uint8Array, field_id: string | Uint8Array) => Uint8Array | number | string
  const sto_subarray: (sto: string | Uint8Array, array_id: string | Uint8Array) => Uint8Array | number | string
  const sto_emplace: (sto: string | Uint8Array, field_bytes: string | Uint8Array, field_id: string | Uint8Array) => Uint8Array | number | string
  const sto_erase: (sto: string | Uint8Array, field_id: string | Uint8Array) => Uint8Array | number | string
  const util_keylet: (keylet_type: number, keylet_data_a: string | Uint8Array, keylet_data_b: string | Uint8Array, keylet_data_c: string | Uint8Array, keylet_data_d: string | Uint8Array, keylet_data_e: string | Uint8Array, keylet_data_f: string | Uint8Array) => Uint8Array | number | string
  const etxn_fee_base: (txblob: Uint8Array | string) => Uint8Array | number | string

  const slot_json: (slotno: number) => Uint8Array | number | string
  const slot: (slotno: number) => Uint8Array | number | string
  const slot_clear: (slotno: number) => Uint8Array | number | string
  const slot_count: (slotno: number) => Uint8Array | number | string
  const slot_set: (kl, slotno: number) => Uint8Array | number | string
  const slot_size: (slotno: number) => Uint8Array | number | string
  const slot_subarray: (parent_slotno: number, array_id: string | Uint8Array, new_slotno: number) => Uint8Array | number | string
  const slot_subfield: (parent_slotno: number, field_id: string | Uint8Array, new_slotno: number) => Uint8Array | number | string
  const slot_type: (slotno: number, flags: Uint8Array | string) => Uint8Array | number | string
  const slot_float: (slotno: number) => Uint8Array | number | string

  const meta_slot: (slotno: number) => Uint8Array | number | string
  const xpop_slot: (slotno_tx: number, slotno_meta:number) => Uint8Array | number | string

  const otxn_slot: (slotno: number) => Uint8Array | number | string
  const otxn_field: (field_id: string | Uint8Array) => Uint8Array | number | string

  const float_set: (exponent: number, mantissa: number) => Uint8Array | number | string
  const float_multiply: (f1: number, f2: number) => Uint8Array | number | string
  const float_mulratio: (f1: number, round_up: number, numerator: number, denominator: number) => Uint8Array | number | string
  const float_negate: (f1: number) => Uint8Array | number | string
  const float_compare: (f1: number, f2: number, mode: number) => Uint8Array | number | string
  const float_sum: (f1: number, f2: number) => Uint8Array | number | string
  const float_sto: (cur, isu, f1: number, field_code: number) => Uint8Array | number | string
  const float_sto_set: (buf: Uint8Array | string) => Uint8Array | number | string
  const float_invert: (f1: number) => Uint8Array | number | string
  const float_divide: (f1: number, f2: number) => Uint8Array | number | string
  const float_mantissa: (f1: number) => Uint8Array | number | string
  const float_sign: (f1: number) => Uint8Array | number | string
  const float_int: (f1: number, decimal_places: number, abs: number) => Uint8Array | number | string
  const float_log: (f1: number) => Uint8Array | number | string
  const float_root: (f1: number, n: number) => Uint8Array | number | string

  const hook_param_set: (val: Uint8Array | string, key: Uint8Array | string, hhash: Uint8Array | string) => number
  const hook_param: (key: Uint8Array | string) => Uint8Array | string
  const hook_skip: (hhash: Uint8Array | string, flag: number) => number
  
/********************************************************************************************************************* */

}

export {}
