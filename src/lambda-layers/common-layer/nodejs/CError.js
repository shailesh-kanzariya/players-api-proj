// constants
const MODULE_NAME = 'CError: '
class CError extends Error {
  constructor (errorCode, errorDataString = null) {
    const funcName = String(MODULE_NAME).concat('constructor: ')
    // call super
    super()
    // validate input param: errCode
    if (!(errorCode && errorCode.length > 0)) {
      console.log(`${funcName}Invalid errorCode, errorCode = ${errorCode}`)
      throw (new Error('Invalid argument: errorCode'))
    }
    // validate: errorData must be string type if it exist
    if (errorDataString) {
      if (typeof errorDataString !== 'string') {
        console.log(`${funcName}Invalid errorDataString, errorDataString = ${errorDataString}`)
        throw (new Error('Invalid argument: errorDataString'))
      }
    }
    this.name = errorCode // error name to identify error type
    this.data = errorDataString // custom optional error data string
    console.log(`${funcName} this.name = ${this.name}`)
    console.log(`${funcName} this.data = ${this.data}`)
  } // constructor
}
module.exports = {
  CError
}
