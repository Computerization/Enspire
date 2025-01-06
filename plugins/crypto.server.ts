// TODO: this is a temporary solution to the error
// of occurrence of 'crypto not defined' in prod

export default defineNuxtPlugin(() => {
  const crypto = require('uncrypto')
  global.crypto = crypto
})
