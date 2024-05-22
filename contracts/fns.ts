import { console } from './GlobalJSHooksAPI'

export const someLogging = () => {
  console.log("someLogging/hash1", util_sha512h([0xde,0xad,0xbe,0xef]))
  console.log("someLogging/hash2", util_sha512h("cafebabe12"))
  console.log("someLogging/hash3", util_sha512h("caFEbAbe12"))
  // console.log('x')
}
