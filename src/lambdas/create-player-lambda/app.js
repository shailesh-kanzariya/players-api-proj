/* eslint-disable import/no-absolute-path */
let CError = null
let errorCodesJSON = null
let apiResponseUtil = null
let successCodesJSON = null
let player = null
let validationUtil = null
const myEnv = process.env.NODE_ENV
if (process.env.NODE_ENV && process.env.NODE_ENV === myEnv) {
  CError = require('./../../lambda-layers/common-layer/nodejs/CError').CError
  errorCodesJSON = require('./../../lambda-layers/common-layer/nodejs/error-codes').errorCodesJSON
  successCodesJSON = require('./../../lambda-layers/common-layer/nodejs/success-codes').successCodesJSON
  apiResponseUtil = require('./../../lambda-layers/common-layer/nodejs/api-response-util')
  player = require('./../../lambda-layers/dal-layer/nodejs/models/Player')
  validationUtil = require('./../../lambda-layers/common-layer/nodejs/validation-util')
} else {
  CError = require('/opt/nodejs/CError').CError
  errorCodesJSON = require('/opt/nodejs/error-codes').errorCodesJSON
  successCodesJSON = require('/opt/nodejs/success-codes').successCodesJSON
  apiResponseUtil = require('/opt/nodejs/api-response-util')
  player = require('/opt/nodejs/models/Player')
  validationUtil = require('/opt/nodejs/validation-util')
}
// required request params
const requiredRequestParamList = ['name', 'team', 'points', 'isActive', 'id']

exports.lambdaHandler = async (event) => {
  const funcName = 'create-player-lambda: '
  console.log(`${funcName}event = ${JSON.stringify(event)}`)
  try {
    // validate the request has all required request params
    try {
      await validationUtil.validateRequiredRequestBodyParams(event, requiredRequestParamList)
    } catch (error) {
      console.log(`${funcName}error = ${JSON.stringify(error)}`)
      if (error instanceof CError) {
        const apiRes = await apiResponseUtil.getAPIErrorResponse(error)
        return apiRes
      } else {
        const apiRes = await apiResponseUtil.getAPIErrorResponse(new CError(errorCodesJSON.API_ERR_INVALID_REQUEST_BODY.code))
        return apiRes
      }
    }
    const eventBodyJSON = JSON.parse(event.body)
    // create new player in DB
    let p = null
    try {
      p = await player.createNewPlayer(eventBodyJSON.id, eventBodyJSON.name, eventBodyJSON.team, eventBodyJSON.points, eventBodyJSON.isActive)
      console.log(`${funcName}p = ${JSON.stringify(p)}`)
    } catch (error) { // hanlde createNewPlayer specific errors
      console.log(`${funcName}error = ${error}`)
      const apiRes = await apiResponseUtil.getAPIErrorResponse(error)
      console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
      return apiRes
    }
    const pList = [] // result data
    if (p) { // if valid result
      pList.push(p)
    }
    // success reponse
    const apiRes = await apiResponseUtil.getAPISuccessResponse(successCodesJSON.API_SUCCESS_CREATED.code, { data: pList })
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
    return apiRes
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    const apiRes = await apiResponseUtil.getAPIErrorResponse(new CError(errorCodesJSON.API_ERR_INTERNAL_SERVER_ERROR.code))
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
    return apiRes
  }
}
