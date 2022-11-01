function encode (name) {
  return name.replaceAll(/\s/g, '-').toLowerCase()
}

export { encode }
