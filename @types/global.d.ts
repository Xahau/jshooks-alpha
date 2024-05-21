declare global {

/********************************************************************************************************************* */

  /**
   * Definition of a Hook (smart contract) written in TS/JS.
   *
   * @param {number} reserved - uint32_t, Reserved for future use.
   * @returns {number}        - int64_t, An arbitrary return code you wish to return from your hook. This will
   *                            be present in the metadata of the originating transaction.
   */
  export type Hook = (reserved?: number) => number

  /**
   * Definition of a Hook Callback - user defined function called in order to inform your hook about the
   * status of a previously emitted transaction. State changes and further emit calls can be made from
   * cbak but it cannot rollback a transaction. When Callback is executed the emitted transaction to
   * which the callback relates is now the originating transaction.
   *
   * @param {number} emittedTxError - uint32_t, If 0: the emittted transaction to which this callback
   *                                  relates was successfully accepted into a ledger.
   *                                  If 1: the emitted transaction to which the callback relates was NOT
   *                                  successfully accepted into a ledger before it expired.
   * @returns {number}              - int64_t, An arbitrary return code you wish to return from your hook.
   *                                  This will be present in the metadata of the originating transaction.
   */
  export type Callback = (emittedTxError?: number) => number

/********************************************************************************************************************* */

  /**
   * Write logging information to the trace log of nodes. Used for debugging purposes.
   *
   * @param {string | null}  message - The 'logging key', message to output before the buffer (can be null)
   * @param {any}            data    - The data to log
   * @param {boolean}        [hex]   - Should it log formatted in HEX?
   * @returns {number}               - int64_t, value is 0 if successful, If negative, an error: OUT_OF_BOUNDS
   */
  const trace: (
    message: string | null,
    data: any,
    hex?: boolean,  
  ) => number

/********************************************************************************************************************* */

  /**
   * Accept the originating transaction and commit any changes the hook made. End the execution of the hook
   * with status: success. Record a return string and return code in transaction metadata. Commit all state
   * changes. Submit all emit() transactions, allow originating transaction to continue.
   *
   * @param {string}         msg     - String to be stored in execution metadata. This is any string the 
   *                                   hook-developer wishes to return with the acceptance. 
   * @param {number}         code    - A return code specific to this hook to be stored in execution metadata.
   *                                   Similar to the return code of an application on a *nix system.
   *                                   By convention success is zero.
   * @returns {number}               - int64_t, accept ends the hook, therefore no value is returned to the
   *                                   caller. By convention all Hook APIs return int64_t, but in this
   *                                   case nothing is returned.
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
   * @param {string}         error_msg     - String to be stored in execution metadata. This is any string the 
   *                                         hook-developer wishes to return with the rollback. 
   * @param {number}         error_code    - A return code specific to this hook to be stored in execution metadata.
   *                                         Similar to the return code of an application on a *nix system.
   *                                         By convention success is zero.
   * @returns {number}                     - int64_t, rollback ends the hook, therefore no value is returned to
   *                                         the caller. By convention all Hook APIs return int64_t, but in this
   *                                         case nothing is returned.
   */
  const rollback: (
    error_msg: string,
    error_code: number,
  ) => number

/********************************************************************************************************************* */

  // TODO

  const util_raddr = (arg: any) => any
  const util_accid = (arg: any) => any
  const util_sha512h = (arg: any) => any
  const hook_account = (arg?: any) => any
  const state = (arg: any) => any
  const hook_hash = (arg: any) => any
  const state_set = (arg: any, arg: any) => any

/********************************************************************************************************************* */

}

export {}
