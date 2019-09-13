/* eslint-disable import/no-absolute-path */
const { CError } = require('/opt/nodejs/CError')
const { errorCodesJSON } = require('/opt/nodejs/error-codes')
const { successCodesJSON } = require('/opt/nodejs/success-codes')
const apiResponseUtil = require('/opt/nodejs/api-response-util')
const player = require('/opt/nodejs/models/Player')
// list all players lambda
exports.lambdaHandler = async (event) => {
  const funcName = 'list-allplayers-lambda: '
  try {
    console.log(`${funcName}event = ${JSON.stringify(event)}`)
    const playerList = await player.listAllPlayers()
    // success reponse
    const apiRes = await apiResponseUtil.getAPISuccessResponse(successCodesJSON.API_SUCCESS_OK.code, { data: playerList, total: playerList.length })
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
    return apiRes
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    const apiRes = await apiResponseUtil.getAPIErrorResponse(new CError(errorCodesJSON.API_ERR_INTERNAL_SERVER_ERROR.code))
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`)
    return apiRes
  }
}
