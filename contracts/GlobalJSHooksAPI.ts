const console = {
  log (logkey: string, logvalue: string | number, hex = false) {
    return trace(logkey, logvalue, hex);
  }
}

export {
  console,
}
