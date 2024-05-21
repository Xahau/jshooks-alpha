import fetch from 'node-fetch'

const source_header = await (await fetch('https://raw.githubusercontent.com/RichardAH/xahaud/dev/src/ripple/app/hook/applyHook.h')).text()
const fns = source_header.match(/DECLARE_JS_FUNCTION.*?\(.+?\)/gmsi)

const source_impl = await (await fetch('https://raw.githubusercontent.com/RichardAH/xahaud/dev/src/ripple/app/hook/impl/applyHook.cpp')).text()

const callables = source_impl.match(/DEFINE_JS_FUNCTION.*?\(.+?JS_HOOK_TEARDOWN.+?\}/gmsi)

fns.forEach(fn => {
  const fnContents = fn.split('(')[1].split(')')[0]
  const fnDef = fnContents.replace(/[ \t\r\n]+/msgi, ' ').trim().split(',').map(t => t.trim())
  const fnName = fnDef[1]
  const fnArgs = fnDef.slice(2).map(t => t.replace(/^JSValue /, ''))

  console.log(fnName, fnArgs)
})
