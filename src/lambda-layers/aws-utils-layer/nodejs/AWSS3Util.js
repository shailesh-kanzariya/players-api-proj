/* eslint-disable import/no-absolute-path */
console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const AWS = require('aws-sdk')
const fs = require('fs')

let awsUtilsConfigs = null
let validationUtil = null
console.log(`process.env.RUN_ENV = ${process.env.RUN_ENV}`)
if (process.env.RUN_ENV === 'local') {
  awsUtilsConfigs = require('./aws-utils-configs').awsUtilsConfigs
  validationUtil = require('./../../common-layer/nodejs/validation-util')
} else {
  awsUtilsConfigs = require('/opt/nodejs/aws-utils-configs')
  validationUtil = require('/opt/nodejs/validation-util')
}

class AWSS3Util extends Object {
  constructor (bucketName = null) {
    super()
    if (bucketName) {
      this.currentBucket = bucketName
    }
  } // constructor

  // get object from S3 bucket
  async getObjectFromBucket (s3ObjectKey, bucketName = null) {
    const funcName = 'getObjectFromBucket: '
    try {
      // validate input params: s3ObjectKey, bucketName
      if (bucketName) {
        await validationUtil.validateStringTypeParamList([bucketName, s3ObjectKey])
      } else {
        await validationUtil.validateStringTypeParamList([s3ObjectKey])
      }
      let curBucket = null
      // if bucketName is provided then use it else use this.currentBucket
      if (bucketName) {
        curBucket = bucketName
      } else if (this.currentBucket) {
        curBucket = this.currentBucket
      } else { // either bucketName or this.currentBucket is not available then throw error
        console.log(`${funcName}invalid bucketName = ${this.currentBucket}`)
        throw (new Error(`Invalid bucket name: ${this.currentBucket}`))
      } // else
      const params = {
        Bucket: curBucket,
        Key: s3ObjectKey
      } // params
      console.log(`${funcName} params = ${JSON.stringify(params)}`)
      const s3 = new AWS.S3({ apiVersion: awsUtilsConfigs.s3APIVersion, region: awsUtilsConfigs.s3Region })
      const data = await s3.getObject(params).promise()
      if (data === null) {
        console.log(`${funcName}failed to get object from bucket, data = ${data}`)
        throw (new Error(`failed to get object from bucket, data = ${data}`))
      } // if
      const dataBodyBuffer = Buffer.from(data.Body)
      return dataBodyBuffer
    } catch (error) {
      console.log(`${funcName}error = ${error}`)
      throw (error)
    }
  }

  // get JSON object from S3 bucket
  async getJSONObjectFromBucket (s3ObjectKey, bucketName = null) {
    const funcName = 'getJSONObjectFromBucket: '
    try {
      // validate input params: s3ObjectKey, bucketName
      if (bucketName) {
        await validationUtil.validateStringTypeParamList([bucketName, s3ObjectKey])
      } else {
        await validationUtil.validateStringTypeParamList([s3ObjectKey])
      }
      const dataBodyBuffer = await this.getObjectFromBucket(s3ObjectKey, bucketName)
      if (!dataBodyBuffer) {
        console.log(`${funcName}failed to get object from bucket, data = ${dataBodyBuffer}`)
        throw (new Error(`${funcName}failed to get object from bucket, data = ${dataBodyBuffer}`))
      }
      const dataString = dataBodyBuffer.toString('utf8')
      // parse dataString to JSON
      const objectJSON = JSON.parse(dataString)
      console.log(`${funcName}objectJSON = ${JSON.stringify(objectJSON)}`)
      return objectJSON
    } catch (error) {
      console.log(`${funcName}error = ${error}`)
      throw (error)
    }
  }

  // put file into S3 bucket
  async putFileInBucket (filePath, s3ObjectKey, bucketName = null) {
    const funcName = 'putFileInBucket: '
    try {
      // validate input params: filePath, s3ObjectKey, bucketName
      if (bucketName) {
        await validationUtil.validateStringTypeParamList([filePath, s3ObjectKey, bucketName])
      } else {
        await validationUtil.validateStringTypeParamList([filePath, s3ObjectKey])
      }
      let curBucket = null
      // if bucketName is provided then use it else use this.currentBucket
      if (bucketName) {
        curBucket = bucketName
      } else if (this.currentBucket) {
        curBucket = this.currentBucket
      } else { // either bucketName or this.currentBucket is not available then throw error
        console.log(`${funcName}invalid bucketName = ${this.currentBucket}`)
        throw (new Error(`Invalid bucket name: ${this.currentBucket}`))
      } // else
      // read file and create its stream
      const readStream = fs.createReadStream(filePath)
      const params = {
        Body: readStream,
        Bucket: curBucket,
        Key: s3ObjectKey
      } // params
      const s3 = new AWS.S3({ apiVersion: awsUtilsConfigs.s3APIVersion, region: awsUtilsConfigs.s3Region })
      // const data = await s3.upload(params).promise();
      const data = await s3.putObject(params).promise()
      if (data === null) {
        console.log(`${funcName}failed to put object in bucket, data = ${data}`)
        throw (new Error(`${funcName}failed to put object in bucket, data = ${data}`))
      } // if
      console.log(`${funcName}data = ${JSON.stringify(data)}`)
      return data
    } catch (error) {
      console.log(`${funcName}error = ${error}`)
      throw (error)
    }
  }

  // put JSON into S3 bucket
  async putJSONInBucket (dataJSON, s3ObjectKey, bucketName = null) {
    const funcName = 'putJSONInBucket: '
    try {
      // validate input params: dataJSON, s3ObjectKey, bucketName
      if (bucketName) {
        await validationUtil.validateStringTypeParamList([s3ObjectKey, bucketName])
      } else {
        await validationUtil.validateStringTypeParamList([s3ObjectKey])
      }
      // await validationUtil.validateJSONTypeParamList([dataJSON])
      let curBucket = null
      // if bucketName is provided then use it else use this.currentBucket
      if (bucketName) {
        curBucket = bucketName
      } else if (this.currentBucket) {
        curBucket = this.currentBucket
      } else { // either bucketName or this.currentBucket is not available then throw error
        console.log(`${funcName}invalid bucketName = ${this.currentBucket}`)
        throw (new Error(`Invalid bucket name: ${this.currentBucket}`))
      } // else
      const dataStringified = JSON.stringify(dataJSON)
      const params = {
        Body: dataStringified,
        Bucket: curBucket,
        Key: s3ObjectKey
      } // params
      const s3 = new AWS.S3({ apiVersion: awsUtilsConfigs.s3APIVersion, region: awsUtilsConfigs.s3Region })
      // const data = await s3.upload(params).promise()
      const data = await s3.putObject(params).promise()
      if (data === null) {
        console.log(`${funcName}failed to put object in bucket, data = ${data}`)
        throw (new Error(`${funcName}failed to put object in bucket, data = ${data}`))
      } // if
      console.log(`${funcName}data = ${JSON.stringify(data)}`)
      return data
    } catch (error) {
      console.log(`${funcName}error = ${error}`)
      throw (error)
    }
  }
} // class

module.exports = {
  AWSS3Util
}
