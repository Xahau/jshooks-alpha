import { derive, signAndSubmit, utils, } from "xrpl-accountlib"
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

// console.log(process.env.HOOK)
// console.log(process.env.ACCOUNT)

const wss = 'ws://localhost:9006'
const account = derive.passphrase('masterpassphrase')
account.address = process.env.ACCOUNT

const networkInfo = await utils.txNetworkAndAccountValues(wss, account)

if (networkInfo.networkInfo.accountSequence === null) {
  const fundingAccountInfo = await utils.txNetworkAndAccountValues(wss, derive.passphrase('masterpassphrase'))
  // Account not funded yet
  console.log('Funding account', process.env.ACCOUNT)
  const funding = await signAndSubmit({
    TransactionType: 'Payment',
    Destination: account.address,
    Amount: String(10_000_000_000),
    ...fundingAccountInfo.txValues
  }, wss, account)

  console.log(funding.response.engine_result, Number(funding.response.tx_json.Amount) / 1_000_000)
  console.log(`   ---> TX URL:\n        http://localhost:9007/ws:127.0.0.1:9006/${funding.response.tx_json.hash}`)

  // This is where we close the ledger to apply the account activation
  await fetch('http://localhost:9005', { method: 'POST', body: JSON.stringify({ method: 'ledger_accept' }) })

  // Re-do
  Object.assign(networkInfo, await utils.txNetworkAndAccountValues(wss, account))
}

// console.log('Network info', networkInfo.txValues)
console.log()
console.log('Setting Hook...')

const tx = {
  TransactionType: "SetHook",
  Hooks: [ { Hook: {
    CreateCode: fs.readFileSync(path.dirname(process.argv[1])+ '/../build/' + process.env.HOOK + '.bc').toString('hex'),
    Flags: process.env.FLAGS,
    HookApiVersion: 1,
    Fee: "1000000",
    HookNamespace: process.env.NAMESPACE,
    HookOn: process.env.HOOKON,
  }
  }],
  ...networkInfo.txValues,
 Account: process.env.ACCOUNT,
};

const submitted = await signAndSubmit(tx, wss, account)

console.dir(submitted.response, { depth: 10, colors: true, })
console.log()
console.log(`   ---> TX URL:\n        http://localhost:9007/ws:127.0.0.1:9006/${submitted.response.tx_json.hash}`)

console.log()
