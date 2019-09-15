const { lambdaHandler } = require('./../src/lambdas/create-player-lambda/app')
const originalEventStub = require('./stubs/eventHttpApiGateway_createPlayer.json') // AWS API Gateway Event Mock
var faker = require('faker') // to generate mock data
const uuidv1 = require('uuid/v1') // to generate random player id
const { Player } = require('./../src/lambda-layers/dal-layer/nodejs/models/Player')

let eventStub
const validTeamValueList = ['red', 'blue', 'green', 'yellow']
console.log(`validTeamValueList.length = ${validTeamValueList.length}`)

describe('Execute Create Player Unit Tests.....', () => {
  beforeEach(() => {
    eventStub = JSON.parse(JSON.stringify(originalEventStub))
    jest.setTimeout(5000)
  })
  /*
  beforeAll(() => {
  })
  afterEach(() => {
  })
  afterAll(() => {
  })
  */
  // All Test Cases - Start
  test('Creating player that already exist, should return a status code 400 with \'API_ERR_ITEM_ALREADY_EXIST\' error code', async () => {
    const event = eventStub
    console.log(`create existing player, event = ${JSON.stringify(event)}`)
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_ITEM_ALREADY_EXIST') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  test('Sending request body null, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    eventStub.body = null
    const event = eventStub
    const result = await lambdaHandler(event)
    console.log(`result = ${JSON.stringify(result)}`)
    const resultBodyJSON = JSON.parse(result.body)
    console.log(`resultBodyJSON = ${JSON.stringify(resultBodyJSON)}`)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // request body missing 'name'
  test('Request body missing \'name\' param, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    const stubBodyJSON = JSON.parse(eventStub.body)
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    // remove key 'name'
    delete stubBodyJSON.name
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    eventStub.body = JSON.stringify(stubBodyJSON)
    const event = eventStub
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // request body missing 'team'
  test('Request body missing \'team\' param, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    const stubBodyJSON = JSON.parse(eventStub.body)
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    // remove key 'team'
    delete stubBodyJSON.team
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    eventStub.body = JSON.stringify(stubBodyJSON)
    const event = eventStub
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // request body missing 'isActive'
  test('Request body missing \'isActive\' param, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    const stubBodyJSON = JSON.parse(eventStub.body)
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    // remove key 'isActive'
    delete stubBodyJSON.isActive
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    eventStub.body = JSON.stringify(stubBodyJSON)
    const event = eventStub
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // request body missing 'points'
  test('Request body missing \'points\' param,, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    const stubBodyJSON = JSON.parse(eventStub.body)
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    // remove key 'points'
    delete stubBodyJSON.points
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    eventStub.body = JSON.stringify(stubBodyJSON)
    const event = eventStub
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // request body missing 'id'
  test('Request body missing \'id\' param, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    const stubBodyJSON = JSON.parse(eventStub.body)
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    // remove key 'id'
    delete stubBodyJSON.id
    console.log(`stubBodyJSON = ${JSON.stringify(stubBodyJSON)}`)
    eventStub.body = JSON.stringify(stubBodyJSON)
    const event = eventStub
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // request body empty json {}
  test('Request body missing all params, should return a status code 400 with \'API_ERR_INVALID_REQUEST_BODY\' error code', async () => {
    eventStub.body = {}
    console.log(`eventStub = ${JSON.stringify(eventStub)}`)
    const event = eventStub
    const result = await lambdaHandler(event)
    const resultBodyJSON = JSON.parse(result.body)
    expect(result.statusCode).toBe(400) // 'statusCode' should be 400
    expect(resultBodyJSON.error.errorCode).toBe('API_ERR_INVALID_REQUEST_BODY') // should match 'errorCode'
    expect(result).toMatchSnapshot()
  }) // test
  // success
  test('Valid Request, should return a status code 200', async () => {
    console.log(`eventStub = ${JSON.stringify(eventStub)}`)
    // create new player mock json
    const randomId = uuidv1()
    const randomName = faker.name.findName()
    const randomIndex = faker.random.number(validTeamValueList.length - 1)
    const randomTeam = validTeamValueList[randomIndex]
    const randomPoints = faker.random.number(100)
    const randomBool = faker.random.number(1)
    let randomIsActive = false
    if (randomBool >= 1) {
      randomIsActive = true
    }
    const newPlayerToCreate = new Player(randomId, randomName, randomTeam, randomPoints, randomIsActive)
    console.log(`newPlayerToCreate = ${JSON.stringify(newPlayerToCreate)}`)
    // add that player to event body
    eventStub.body = JSON.stringify(newPlayerToCreate)
    console.log(`eventStub = ${JSON.stringify(eventStub)}`)
    const event = eventStub
    // create new player
    const result = await lambdaHandler(event)
    console.log(`result = ${JSON.stringify(result)}`)
    const resultBodyJSON = JSON.parse(result.body)
    // data json - player created
    const playerCreated = resultBodyJSON.data[0]
    console.log(`playerCreated = ${JSON.stringify(playerCreated)}`)
    const status = resultBodyJSON.status
    console.log(`status = ${status}`)
    expect(result.statusCode).toBe(201) // 'statusCode' should be 201
    expect(resultBodyJSON.status).toBe('Created') // 'status' should be 'Created'
    expect(resultBodyJSON.data[0]).toEqual(newPlayerToCreate) // should match with player JSON sent into request body
  }) // test
  // All Test Cases - End
}) // describe
