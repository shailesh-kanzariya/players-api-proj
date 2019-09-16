/* eslint-disable import/no-absolute-path */
console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
let validationUtil = null
let AWSS3Util = null
let configsJSON = null
let CError = null
let errorCodesJSON = null
console.log(`process.env.RUN_ENV = ${process.env.RUN_ENV}`)
if (process.env.RUN_ENV === 'local') {
  AWSS3Util = require('./../../../aws-utils-layer/nodejs/AWSS3Util').AWSS3Util
  configsJSON = require('./../../../common-layer/nodejs/configs').configsJSON
  validationUtil = require('./../../../common-layer/nodejs/validation-util')
  CError = require('./../../../common-layer/nodejs/CError').CError
  errorCodesJSON = require('./../../../common-layer/nodejs/error-codes').errorCodesJSON
} else {
  validationUtil = require('/opt/nodejs/validation-util')
  AWSS3Util = require('/opt/nodejs/AWSS3Util').AWSS3Util
  configsJSON = require('/opt/nodejs/configs').configsJSON
  CError = require('/opt/nodejs/CError').CError
  errorCodesJSON = require('/opt/nodejs/error-codes').errorCodesJSON
}
// valid values for team
const validTeamValueList = ['red', 'blue', 'green', 'yellow']
class Player extends Object {
  constructor (id, name, team, points, isActive) {
    // call super constructor
    super()
    this.id = id
    this.name = name
    this.team = team
    this.points = points
    this.isActive = isActive
  }
} // class

// Player Model methods
// create a new player
async function createNewPlayer (pId, pName, pTeam, pPoints = 0, pIsActive = false) {
  const funcName = 'createNewPlayer: '
  try {
    // validate input params: pName, pTeam
    await validationUtil.validateStringTypeParamList([pId, pName, pTeam])
    // value of points must be betweeb 0 and 100 range
    if (!(typeof pPoints === 'number' && pPoints >= 0 && pPoints <= 100)) {
      console.log(`${funcName}invalid value of points, pPoints = ${pPoints}`)
      throw (new CError(errorCodesJSON.API_ERR_INVALID_PARAMETERS.code, 'value of \'points\' must be between 0 and 100'))
    }
    // value of team must be either of ['red', 'blue', 'green', 'yellow']
    if (!validTeamValueList.includes(pTeam)) {
      console.log(`${funcName}invalid value of team, pTeam = ${pPoints}`)
      throw (new CError(errorCodesJSON.API_ERR_INVALID_PARAMETERS.code, `valid 'team' values are: ${JSON.stringify(validTeamValueList)}`))
    }
    // value of isActive must be either 'true' or 'false'
    if (!(String(pIsActive) === 'true' || String(pIsActive) === 'false')) {
      console.log(`${funcName}invalid value of isActive, pIsActive = ${pIsActive}`)
      throw (new CError(errorCodesJSON.API_ERR_INVALID_PARAMETERS.code, 'valid \'isActive\' values are: true or false'))
    }
    // load playerDB.json file from S3
    const s3BucketObjectKey = configsJSON.playerDBS3ObjectKey
    console.log(`${funcName}s3BucketObjectKey = ${s3BucketObjectKey}`)
    const awsS3Util = new AWSS3Util(configsJSON.playerDBS3BucketName)
    let playerList = null
    try {
      playerList = await awsS3Util.getJSONObjectFromBucket(s3BucketObjectKey)
    } catch (error) {
      // if db file does not exist then first create empty db json file
      if (error.code === 'NoSuchKey') {
        console.log(`${funcName}creating new DB JSON file on S3...`)
        await awsS3Util.putJSONInBucket([], s3BucketObjectKey)
        playerList = await awsS3Util.getJSONObjectFromBucket(s3BucketObjectKey)
      } // if
    }
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (!(playerList && Array.isArray(playerList))) {
      console.log(`${funcName}invalid db json, dbJson = ${JSON.stringify(playerList)}}`)
      throw (new Error(`${funcName}invalid db json`))
    }
    // check if player with the sam "id" already exist
    for (const player of playerList) {
      if (player.id === pId) {
        console.log(`${funcName}Player with id ${pId} exist`)
        throw (new CError(errorCodesJSON.API_ERR_ITEM_ALREADY_EXIST.code))
      }
    }
    // create new player object
    const newPlayerObj = new Player(pId, pName, pTeam, pPoints, pIsActive)
    console.log(`${funcName}newPlayerObj = ${JSON.stringify(newPlayerObj)}`)
    // add newly created object into DBJSON
    playerList.push(newPlayerObj)
    console.log(`${funcName}updated playerList = ${JSON.stringify(playerList)}`)
    // put updated playerlist on S3
    const location = await awsS3Util.putJSONInBucket(playerList, configsJSON.playerDBS3ObjectKey)
    console.log(`${funcName}location = ${location}`)
    return newPlayerObj
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}
// get all playes
async function listAllPlayers () {
  const funcName = 'listAllPlayers: '
  try {
    // load playerDB.json file from S3
    const s3BucketObjectKey = configsJSON.playerDBS3ObjectKey
    console.log(`${funcName}s3BucketObjectKey = ${s3BucketObjectKey}`)
    const awsS3Util = new AWSS3Util(configsJSON.playerDBS3BucketName)
    const playerList = await awsS3Util.getJSONObjectFromBucket(s3BucketObjectKey)
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (!(playerList && Array.isArray(playerList))) {
      console.log(`${funcName}invalid db json, dbJson = ${JSON.stringify(playerList)}}`)
      throw (new Error(`${funcName}invalid db json`))
    }
    return playerList
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}
// get player by id
async function getPlayerById (pId) {
  const funcName = 'getPlayerById: '
  try {
    // validate input params: pId
    await validationUtil.validateStringTypeParamList([pId])
    // load playerDB.json file from S3
    const s3BucketObjectKey = configsJSON.playerDBS3ObjectKey
    console.log(`${funcName}s3BucketObjectKey = ${s3BucketObjectKey}`)
    const awsS3Util = new AWSS3Util(configsJSON.playerDBS3BucketName)
    const playerList = await awsS3Util.getJSONObjectFromBucket(s3BucketObjectKey)
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (!(playerList && Array.isArray(playerList))) {
      console.log(`${funcName}invalid db json, dbJson = ${JSON.stringify(playerList)}}`)
      throw (new Error(`${funcName}invalid db json`))
    }
    // iterate to get player by id
    let playerFound = null
    for (const player of playerList) {
      if (player.id === pId) {
        console.log(`${funcName}player matched = ${pId}`)
        playerFound = player
        break
      }
    }
    console.log(`${funcName}playerFound = ${JSON.stringify(playerFound)}`)
    return playerFound
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}
// delete player by id
async function deletePlayerById (pId) {
  const funcName = 'deletePlayerById: '
  try {
    // validate input params: pId
    await validationUtil.validateStringTypeParamList([pId])
    // load playerDB.json file from S3
    const s3BucketObjectKey = configsJSON.playerDBS3ObjectKey
    console.log(`${funcName}s3BucketObjectKey = ${s3BucketObjectKey}`)
    const awsS3Util = new AWSS3Util(configsJSON.playerDBS3BucketName)
    const playerList = await awsS3Util.getJSONObjectFromBucket(s3BucketObjectKey)
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (!(playerList && Array.isArray(playerList))) {
      console.log(`${funcName}invalid db json, dbJson = ${JSON.stringify(playerList)}}`)
      throw (new Error(`${funcName}invalid db json`))
    }
    // iterate to get player by id
    let playerDeleted = null
    let index = 0
    for (const player of playerList) {
      console.log(`${funcName}index = ${index}`)
      if (player.id === pId) {
        console.log(`${funcName}player matched = ${pId}`)
        // delete the player
        playerDeleted = playerList.splice(index, 1)
        break
      }
      index++
    } // for
    console.log(`${funcName}playerDeleted = ${JSON.stringify(playerDeleted)}`)
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (playerDeleted) { // if player matched and deleted then update db on s3
      await awsS3Util.putJSONInBucket(playerList, s3BucketObjectKey)
    }
    return playerDeleted
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}
// update player by id
async function updatePlayerById (pId, pName, pTeam, pPoints, pIsActive) {
  const funcName = 'updatePlayerById: '
  try {
    // validate input params: pId, pName, pTeam, pPoints, pIsActive
    await validationUtil.validateStringTypeParamList([pId, pName, pTeam, String(pPoints), String(pIsActive)])
    // value of points must be betweeb 0 and 100 range
    if (!(typeof pPoints === 'number' && pPoints >= 0 && pPoints <= 100)) {
      console.log(`${funcName}invalid value of points, pPoints = ${pPoints}`)
      throw (new CError(errorCodesJSON.API_ERR_INVALID_PARAMETERS.code, 'value of \'points\' must be between 0 and 100'))
    }
    // value of team must be either of ['red', 'blue', 'green', 'yellow']
    if (!validTeamValueList.includes(pTeam)) {
      console.log(`${funcName}invalid value of team, pTeam = ${pPoints}`)
      throw (new CError(errorCodesJSON.API_ERR_INVALID_PARAMETERS.code, `valid 'team' values are: ${JSON.stringify(validTeamValueList)}`))
    }
    // value of isActive must be either 'true' or 'false'
    if (!(String(pIsActive) === 'true' || String(pIsActive) === 'false')) {
      console.log(`${funcName}invalid value of isActive, pIsActive = ${pIsActive}`)
      throw (new CError(errorCodesJSON.API_ERR_INVALID_PARAMETERS.code, 'valid \'isActive\' values are: true or false'))
    }
    // load playerDB.json file from S3
    const s3BucketObjectKey = configsJSON.playerDBS3ObjectKey
    console.log(`${funcName}s3BucketObjectKey = ${s3BucketObjectKey}`)
    const awsS3Util = new AWSS3Util(configsJSON.playerDBS3BucketName)
    const playerList = await awsS3Util.getJSONObjectFromBucket(s3BucketObjectKey)
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (!(playerList && Array.isArray(playerList))) {
      console.log(`${funcName}invalid db json, dbJson = ${JSON.stringify(playerList)}}`)
      throw (new Error(`${funcName}invalid db json`))
    }
    const updatedPlayer = new Player(pId, pName, pTeam, pPoints, pIsActive)
    console.log(`${funcName}updatedPlayer = ${JSON.stringify(updatedPlayer)}`)
    // iterate to get player by id
    let playerUpdated = null
    let index = 0
    for (const player of playerList) {
      console.log(`${funcName}index = ${index}`)
      if (player.id === pId) {
        console.log(`${funcName}player matched = ${pId}`)
        // delete the player
        playerUpdated = playerList.splice(index, 1, updatedPlayer)
        break
      }
      index++
    } // for
    console.log(`${funcName}playerUpdated = ${JSON.stringify(playerUpdated)}`)
    console.log(`${funcName}playerList = ${JSON.stringify(playerList)}`)
    if (playerUpdated) { // if player matched and deleted then update db on s3
      await awsS3Util.putJSONInBucket(playerList, s3BucketObjectKey)
    }
    if (playerUpdated) { // if update success then return updated player
      return updatedPlayer
    }
    return playerUpdated
  } catch (error) {
    console.log(`${funcName}error = ${error}`)
    throw (error)
  }
}

module.exports = {
  Player,
  createNewPlayer,
  listAllPlayers,
  getPlayerById,
  deletePlayerById,
  updatePlayerById
}
