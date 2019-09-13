// define HTTP Status Code, Message and Basic Success Message for the success code
const successCodesJSON = {
  API_SUCCESS_OK: {
    code: 'API_SUCCESS_OK',
    httpStatusCode: 200,
    httpStatusMessage: 'OK'
  },
  API_SUCCESS_CREATED: {
    code: 'API_SUCCESS_CREATED',
    httpStatusCode: 201,
    httpStatusMessage: 'Created'
  }
}
module.exports = {
  successCodesJSON
}
