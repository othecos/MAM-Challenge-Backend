import axios from 'axios'
import ErrorHandler from './ErroHandler'
import { MEDIA_TYPES } from '@config/HttpRequest'
import qs from 'qs'
import Logger from './Logger'


axios.interceptors.request.use(function (config: any) {
  if (config.headers && config.headers['content-type'] == MEDIA_TYPES.APPLICATION_FORM) {
    config.data = qs.stringify(config.data)
  }

  config.meta = config.meta || {}
  config.meta.requestStartedAt = new Date().getTime()
  Logger.info(`External Request: ${config.method} ${config.url}`)
  Logger.info(`Body: ${JSON.stringify(config.data, null, 2)}`)
  return config
})

axios.interceptors.response.use((options: any) => {
  Logger.info(`Request: ${options.config.method.toUpperCase()} ${options.config.url} - ${options.config.status} - ${new Date().getTime() - options.config.meta.requestStartedAt} ms`)
  return options
}, (error) => {
  Logger.error(`Request: ${error.config.method.toUpperCase()} ${error.config.url} - ${error.response.status} - ${new Date().getTime() - error.config.meta.requestStartedAt} ms`)
  return error
})


export default class HttpRequest {

  static async get(URL: string, options: any = {}) {
    try {
      const fullResponse = options.rawResponse ? true : false
      delete options.rawResponse
      const response: any = await axios.get(URL, options)
      if (response.isAxiosError) throw { error: response }
      if (fullResponse) return response
      return response.data
    } catch (error) {
      const errorHandler = new ErrorHandler({
        code: error.response?.status,
        ...error.response?.data,
      })
      throw errorHandler.format()
    }
  }

  static async post(URL: string, body: any = {}, options: any = {}) {
    try {
      const response: any = await axios.post(URL, body, options)
      if (response.isAxiosError) throw response
      return response.data
    } catch (error) {
      const errorHandler = new ErrorHandler({
        code: error.response?.status || 500,
        ...error.response?.data,
      })
      throw errorHandler.format()
    }
  }
  static async put(URL: string, body = {}, options = {}) {
    try {
      const response: any = await axios.put(URL, body, options)
      if (response.isAxiosError) throw response
      return response.data
    } catch (error) {
      const errorHandler = new ErrorHandler({
        code: error.response?.status || 500,
        ...error.response?.data,
      })
      throw errorHandler.format()
    }
  }

  static async patch(URL: string, body = {}, options = {}) {
    try {
      const response: any = await axios.patch(URL, body, options)
      if (response.isAxiosError) throw response
      return response.data
    } catch (error) {
      const errorHandler = new ErrorHandler({
        code: error.response?.status || 500,
        ...error.response?.data,
      })
      throw errorHandler.format()
    }
  }

  static async make(URL: string, METHOD: any, body: any = {}, options: any = {}) {
    try {
      const result: any = await axios({
        method: METHOD,
        url: URL,
        data: body,
        headers: options.headers
      })
      if (!result.isAxiosError)
        return result.data
      else throw result
    } catch (error) {
      const errorHandler = new ErrorHandler({
        code: error.response?.status || 500,
        ...error.response?.data,
      })
      throw errorHandler.format()
    }
  }
}
