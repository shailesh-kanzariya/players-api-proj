// define HTTP Status Code, Message and Basic Error Message for the error code
const errorCodesJSON = {
  API_ERR_INTERNAL_SERVER_ERROR: {
    code: 'API_ERR_INTERNAL_SERVER_ERROR',
    httpStatusCode: 500,
    httpStatusMessage: 'Internal Server Error',
    errorMessage: 'Server error occured'
  },
  API_ERR_MISSING_PARAMETERS: {
    code: 'API_ERR_MISSING_PARAMETERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Missing required request parameters'
  },
  API_ERR_INVALID_PARAMETERS: {
    code: 'API_ERR_INVALID_PARAMETERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Invalid request parameters'
  },
  API_ERR_MISSING_PATH_PARAMETERS: {
    code: 'API_ERR_MISSING_PATH_PARAMETERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Missing request path parameters'
  },
  API_ERR_INVALID_PATH_PARAMETERS: {
    code: 'API_ERR_INVALID_PATH_PARAMETERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Invalid request path parameters'
  },
  API_ERR_INVALID_QS_PARAMETERS: {
    code: 'API_ERR_INVALID_QS_PARAMETERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Invalid request query string parameters'
  },
  API_ERR_MISSING_HEADERS: {
    code: 'API_ERR_MISSING_HEADERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Missing required request headers'
  },
  API_ERR_INVALID_HEADERS: {
    code: 'API_ERR_INVALID_HEADERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Invalid request headers'
  },
  API_ERR_INVALID_REQUEST_BODY: {
    code: 'API_ERR_INVALID_REQUEST_BODY',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Request body either missing or invalid'
  },
  API_ERR_UNAUTHORIZED_REQUEST: {
    code: 'API_ERR_UNAUTHORIZED_REQUEST',
    httpStatusCode: 401,
    httpStatusMessage: 'Unauthorized',
    errorMessage: 'Request sent is unauthorized'
  },
  API_ERR_USER_ALREADY_EXIST: {
    code: 'API_ERR_USER_ALREADY_EXIST',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'User already exist'
  },
  API_ERR_ITEM_ALREADY_EXIST: {
    code: 'API_ERR_ITEM_ALREADY_EXIST',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Item already exist'
  },
  API_ERR_INVALID_QUERY_PARAMETERS: {
    code: 'API_ERR_INVALID_QUERY_PARAMETERS',
    httpStatusCode: 400,
    httpStatusMessage: 'Bad Request',
    errorMessage: 'Invalid query parameters'
  }
}

module.exports = {
  errorCodesJSON
}
