const validationUtil = require('./validation-util')
const { errorCodesJSON } = require('./error-codes')
const { successCodesJSON } = require('./success-codes')
const { CError } = require('./CError')
// constants
const MODULE_NAME = 'api-response-util: '
const unhandledErrorJSON = {
  code: 'API_ERR_INTERNAL_SERVER_ERROR',
  httpStatusCode: 500,
  httpStatusMessage: 'Internal Server Error',
  errorMessage: 'Server error occured'
}
// common https headers for the response
const RESPONSE_HTTTP_HEADERS = {
  'Access-Control-Allow-Methods': '*', // to enable CORS
  'Access-Control-Allow-Headers': '*', // to enable CORS
  'Access-Control-Allow-Origin': '*', // to enable CORS
  'Content-Type': 'application/json'
}
async function prepareErrorJSON (errorCode, errorData = null) {
  const funcName = String(MODULE_NAME).concat('prepareErrorJSON: ')
  try {
    // validate input params: errorCode
    await validationUtil.validateStringTypeParamList([errorCode])
    // get MB Error Code JSON for the mbErrorType
    console.log(`${funcName}errorCode = ${errorCode}`)
    const errorCodeJSON = errorCodesJSON[errorCode]
    console.log(`${funcName}errorCodeJSON = ${JSON.stringify(errorCodeJSON)}`)
    if (!errorCodeJSON) {
      console.log(`${funcName}invalid errorCodeJSON = ${JSON.stringify(errorCodeJSON)}`)
      throw (new Error(errorCodeJSON))
    }
    // prepare error JSON
    const errorJSON = {}
    errorJSON.httpStatusCode = errorCodeJSON.httpStatusCode
    errorJSON.error = {}
    errorJSON.error.errorStatus = errorCodeJSON.httpStatusMessage
    errorJSON.error.errorCode = errorCodeJSON.code
    if (errorData) {
      await validationUtil.validateStringTypeParamList([errorData])
      errorJSON.error.errorMessage = String(errorCodeJSON.errorMessage).concat(': ').concat(errorData)
    } else {
      errorJSON.error.errorMessage = errorCodeJSON.errorMessage // default error msg
    }
    console.log(`${funcName}errorJSON = ${JSON.stringify(errorJSON)}`)
    return errorJSON
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}
// Unhandled Error. When no one could handle error, this function is called to indicate server failure gracefully and return 500
async function getAPIUnhandledErrorResponse () {
  const funcName = String(MODULE_NAME).concat('getAPIUnhandledErrorResponse: ')
  // prepare error JSON
  const errorJSON = {}
  errorJSON.error = {}
  errorJSON.error.errorStatus = unhandledErrorJSON.httpStatusMessage
  errorJSON.error.errorCode = unhandledErrorJSON.code
  errorJSON.error.errorMessage = unhandledErrorJSON.errorMessage
  // prepare API error response
  const errAPIResJSON = {}
  errAPIResJSON.statusCode = unhandledErrorJSON.httpStatusCode // HTTP Status Code
  errAPIResJSON.headers = RESPONSE_HTTTP_HEADERS // HTTP Headers
  errAPIResJSON.body = JSON.stringify(errorJSON) // HTTP Body
  console.log(`${funcName}final errAPIResJSON = ${JSON.stringify(errAPIResJSON)}`)
  return errAPIResJSON
}
// Function responsible to prepare the API Error Response JSON
async function getAPIErrorResponse (errorObj) {
  const funcName = String(MODULE_NAME).concat('getAPIErrorResponse: ')
  try {
    console.log(`${funcName} errorObj = ${JSON.stringify(errorObj)}`)
    // validate input params: errorObj
    if (!errorObj) {
      console.log(`${funcName}Invalid argument, errorObj = ${errorObj}`)
      throw (new Error('Invalid argument: errorObj'))
    }
    let errorJSON = null
    // check if errorObj is instance of CError
    if (!(errorObj instanceof CError)) { // if not instance of CError then it is programming/internal-server error
      console.log(`${funcName}errorObj IS NOT instance of CError so Internal Server Error`)
      // create server error of type CError
      const cServerErr = new CError(errorCodesJSON.API_ERR_INTERNAL_SERVER_ERROR.code)
      console.log(`${funcName}cServerErr = ${JSON.stringify(cServerErr)}`)
      errorJSON = await prepareErrorJSON(cServerErr.name) // error code
    } else { // this is managable CError
      // validate that errorObj has valid 'name' value
      await validationUtil.validateStringTypeParamList([errorObj.name])
      if (errorObj.data) { // if errorObj.data exist then it must be string type
        await validationUtil.validateStringTypeParamList([errorObj.data])
      } // if
      errorJSON = await prepareErrorJSON(errorObj.name, errorObj.data)
    }
    console.log(`${funcName}errorJSON = ${JSON.stringify(errorJSON)}`)
    // prepare complete API response
    const apiErrorResJSON = {}
    const apiErrorJSON = {}
    apiErrorJSON.error = errorJSON.error
    apiErrorResJSON.statusCode = errorJSON.httpStatusCode // HTTP Status Code
    apiErrorResJSON.headers = RESPONSE_HTTTP_HEADERS // HTTP Headers
    apiErrorResJSON.body = JSON.stringify(apiErrorJSON) // HTTP Body
    console.log(`${funcName}final apiErrorResJSON = ${JSON.stringify(apiErrorResJSON)}`)
    return apiErrorResJSON
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    // Don't propogate error further as this is the last error handling function
    // so return as unhandler error to indicate server failure
    const apiUnhandledErrorRes = await getAPIUnhandledErrorResponse()
    return apiUnhandledErrorRes
  }
}
// Function responsible to prepare the complete API Success Response JSON
async function getAPISuccessResponse (apiSuccessCode, httpBodyJSON) {
  const funcName = String(MODULE_NAME).concat('getAPISuccessResponse: ')
  try {
    // validate input params: apiSuccessCode, httpBodyJSON
    await validationUtil.validateStringTypeParamList([apiSuccessCode])
    await validationUtil.validateJSONTypeParamList([httpBodyJSON])
    // get Success JSON from apiSuccessCode
    const successJSON = successCodesJSON[apiSuccessCode]
    console.log(`${funcName}successJSON = ${JSON.stringify(successJSON)}`)
    // prepare complete API response
    const apiSuccessResJSON = {}
    // const dataJSON = {}
    // dataJSON.data = httpBodyJSON
    if (!httpBodyJSON.data) {
      console.log(`${funcName}'data' key do not exist so adding it...`)
      httpBodyJSON.data = {}
    }
    httpBodyJSON.status = successJSON.httpStatusMessage
    apiSuccessResJSON.statusCode = successJSON.httpStatusCode // HTTP Status Code
    apiSuccessResJSON.headers = RESPONSE_HTTTP_HEADERS // HTTP Headers
    console.log(`${funcName}dataJSON = ${JSON.stringify(httpBodyJSON)}`)
    apiSuccessResJSON.body = JSON.stringify(httpBodyJSON) // HTTP Body
    return apiSuccessResJSON
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    // Don't propogate error further as this is the last error handling function
    // so return as unhandler error to indicate server failure
    const apiUnhandledErrorRes = await getAPIUnhandledErrorResponse()
    return apiUnhandledErrorRes
  }
}
module.exports = {
  getAPIErrorResponse,
  getAPISuccessResponse
}
