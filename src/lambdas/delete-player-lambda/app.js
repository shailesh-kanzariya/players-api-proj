/* eslint-disable import/no-absolute-path */
const { CError } = require('/opt/nodejs/CError')
const { errorCodesJSON } = require('/opt/nodejs/error-codes')
const { successCodesJSON } = require('/opt/nodejs/success-codes')
const apiResponseUtil = require('/opt/nodejs/api-response-util')
const player = require('/opt/nodejs/models/Player')

exports.lambdaHandler = async (event) => {
  const funcName = 'delete-player-lambda: '
  console.log(`${funcName}event = ${JSON.stringify(event)}`)
  try {
    // validate the request has path param 'player_id'
    let playerId = null
    try {
      // check if path params exist
      if (!(event && event.pathParameters && event.pathParameters.player_id)) {
        console.log(`${funcName}invalid path param, event.pathParameters = ${JSON.stringify(event.pathParameters)}`)
        throw (new Error(`${funcName}invalid path param, event.pathParameters = ${JSON.stringify(event.pathParameters)}`))
      }
      // extract player_id value
      playerId = event.pathParameters.player_id
      console.log(`${funcName}playerId = ${playerId}`)
      if (!(playerId && String(playerId).length > 0)) {
        console.log(`${funcName}invalid path param, playerId = ${playerId}`)
        throw (new Error(`${funcName}invalid path param, playerId = ${playerId}`))
      } // if
    } catch (error) {
      const apiRes = await apiResponseUtil.getAPIErrorResponse(new CError(errorCodesJSON.API_ERR_INVALID_PATH_PARAMETERS.code))
      return apiRes
    }
    // delete player by id
    const p = await player.deletePlayerById(playerId)
    const pList = [] // result data
    if (p) { // if valid result
      pList.push(p)
    }
    // success reponse
    console.log(`${funcName}p = ${JSON.stringify(p)}`)
    const apiRes = await apiResponseUtil.getAPISuccessResponse(successCodesJSON.API_SUCCESS_OK.code, { data: pList })
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
    return apiRes
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    const apiRes = await apiResponseUtil.getAPIErrorResponse(new CError(errorCodesJSON.API_ERR_INTERNAL_SERVER_ERROR.code))
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
    return apiRes
  }
}
