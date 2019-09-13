const { CError } = require('./CError')
const { errorCodesJSON } = require('./error-codes')
// Validation Module contains utility functions to perform different data validations
const MODULE_NAME = 'validation-util: '
// Validate that each item in the given list is of type string, is not null/undefined and has length > 0
async function validateStringTypeParamList (strParamsList) {
  const funcName = String(MODULE_NAME).concat('validateStringTypeParamList: ')
  const invalidParamsList = []
  try {
    if (!(strParamsList && Array.isArray(strParamsList))) {
      console.log(`${funcName}Invalid params, strParamsList = ${JSON.stringify(strParamsList)}`)
      throw (new Error(`${JSON.stringify(strParamsList)}`))
    }
    console.log(`${funcName}strParamsList = ${JSON.stringify(strParamsList)}`)
    for (const stringElement of strParamsList) {
      console.log(`${funcName}stringElement = ${stringElement}`)
      if (!(stringElement !== null && stringElement !== undefined && typeof stringElement === 'string' && String(stringElement).length > 0)) {
        invalidParamsList.push(stringElement)
      } // if
    }
    if (invalidParamsList.length > 0) {
      console.log(`${funcName}error = Invalid value of param, invalidParamsList = ${JSON.stringify(invalidParamsList)}`)
      throw (new Error(`${JSON.stringify(invalidParamsList)}`))
    }
    return strParamsList
  } catch (error) {
    console.log(`${funcName}: error = ${error}`)
    throw (error)
  }
} // validateStringTypeParamList

// Validate that each item in the given list is 'valid JSON object'
async function validateJSONTypeParamList (jsonParamsList) {
  const funcName = String(MODULE_NAME).concat('validateJSONTypeParamList: ')
  try {
    if (!(jsonParamsList && Array.isArray(jsonParamsList))) {
      console.log(`${funcName}Invalid params, jsonParamsList = ${JSON.stringify(jsonParamsList)}`)
      throw (new Error(`${JSON.stringify(jsonParamsList)}`))
    }
    console.log(`${funcName}jsonParamsList = ${JSON.stringify(jsonParamsList)}`)
    for (const jsonObject of jsonParamsList) {
      if (!jsonObject) {
        console.log(`${funcName}jsonObject is null, jsonObject = ${jsonObject}`)
        throw (new Error(`${JSON.stringify(jsonObject)}`))
      }
      // iterate through each key-value of each 'jsonObject'. If it is not valid JSON then below code will throw error
      for (const key in jsonObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (jsonObject.hasOwnProperty(key)) {
          const keyVal = jsonObject[key]
          console.log(`${funcName}key = ${key}, keyVal = ${keyVal}`) // log for debug purpose
        } // if
      } // for in
    } // for
    return jsonParamsList
  } catch (error) {
    console.log(`${funcName}: error = ${error}`)
    throw (error)
  }
}
// Validate 'event' object by checking that it contains each 'required' parameter as asked in the 'requiredParamsList' list
async function validateRequiredRequestBodyParams (event, requiredParamsList) {
  const funcName = String(MODULE_NAME).concat('validateRequiredRequestBodyParams: ')
  try {
    console.log(`${funcName}requiredParamsList = ${JSON.stringify(requiredParamsList)}`)
    if (!event) {
      console.log(`${funcName}Invalid value of event, event = ${JSON.stringify(event)}`)
      throw (new Error('Invalid value of event'))
    }
    if (!requiredParamsList) {
      console.log(`${funcName}Invalid value of requiredParamsList, requiredParamsList = ${JSON.stringify(requiredParamsList)}`)
      throw (new Error('Invalid value of requiredParamsList'))
    }
    const evtBody = JSON.parse(event.body)
    console.log(`${funcName}evtBody = ${JSON.stringify(evtBody)}`)
    if (!evtBody) {
      console.log(`${funcName}invalid event body, evtBody = ${evtBody}`)
      // throw (new Error(`${funcName}invalid event body, evtBody = ${evtBody}`))
      throw (new CError(errorCodesJSON.API_ERR_INVALID_REQUEST_BODY.code))
    }
    const missingParams = []
    // iterate each required param and validate it against event body
    for (const reqParam of requiredParamsList) {
      console.log(`${funcName}reqParam = ${reqParam}`)
      if (!evtBody[reqParam].toString()) { // if event body does not conain required param then add it into missing params list
        missingParams.push(reqParam)
      }
    }
    if (missingParams.length > 0) {
      console.log(`${funcName}Missing required request params: ${JSON.stringify(missingParams)}`)
      throw (new CError(errorCodesJSON.API_ERR_MISSING_PARAMETERS.code, `${missingParams.toString()}`))
    }
    return requiredParamsList
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}
module.exports = {
  validateStringTypeParamList,
  validateJSONTypeParamList,
  validateRequiredRequestBodyParams
}
