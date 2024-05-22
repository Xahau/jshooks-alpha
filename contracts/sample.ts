/**
 * Sample just doing some logging...
 */

const Hook: Hook = () => {
  const obj = {
    somekey: [0xde, 0xad, 0xbe, 0xef],
    anotherkey: "some value",
  }

  trace("Some message", obj, false)

  const accid = [
    0x09, 0x61, 0xA4, 0xA0, 0xAF, 0xBB, 0xCA, 0xE6,
    0x14, 0x90, 0x8F, 0x6E, 0x8E, 0x6D, 0x76, 0xAE,
    0xFB, 0x55, 0x80, 0x0C,
  ]

  let raddr
  trace("R-addr", raddr = util_raddr(accid), false)
  trace("Accid", util_accid(raddr), false)
  trace("hash1", util_sha512h([0xde,0xad,0xbe,0xef]), false)
  trace("hash2", util_sha512h("cafebabe12"), false)
  trace("hash3", util_sha512h("caFEbAbe12"), false)

  trace("hookacc", hook_account(), false)
  trace("hook_hash", hook_hash(0), false)
  trace("state_set", state_set(undefined, 'cafebabe'), false) // Undefined removes state
  trace("state_set", state_set('deedd00d', 'deadbeef'), false)
  trace("statehex ex", state('deadbeef'), false)
  trace("statehex ex", state('cafebabe'), false)
  trace("state-aa", state('bb'), false)

  trace("aaaa", Number(1233).toString(16), false)
  trace("aaaa", parseInt('4d1', 16), false)
  trace("aaaa", ['a','b','c','d','qqqqqqqqqqe'].map(a => `${a}/`).join('-'), false)

  return accept("hello world", 123)
}

const Callback: Callback = () => {
  return accept("", 1)
}

export {
  Hook,
  Callback,
}
