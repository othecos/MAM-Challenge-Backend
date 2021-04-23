import { config } from 'dotenv'
config()
import express from 'express'
import { env, corsOptions } from '@config/index'
import cors from 'cors'
import errorhandler from 'errorhandler'
import chalk from 'chalk'
import { AuthMiddleware, ErrorMiddleware } from '@middleware/index'
import SwaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { options } from '@config/swagger'
import { trucks } from '@routers/index'
import Logger, { HttpLogger } from '@utils/Logger/index'

let swaggerSpec: SwaggerDefinition = SwaggerJSDoc(options) as SwaggerDefinition

var app = express()

app.set('PORT', env.PORT)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(errorhandler())
app.use(HttpLogger)

// Import and add Routers here. 
const BASE_PATH = '/v1'

//Middleware for authentication
app.use(AuthMiddleware)


app.use(`${BASE_PATH}/trucks`, trucks)


swaggerSpec.servers = [{ url: `${process.env.BASE_URL || 'http://localhost:8000'}${BASE_PATH}` }]
app.use(`${BASE_PATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Custom Handle Error
app.use(ErrorMiddleware)

app.listen(app.get('PORT'), () => {
    /* eslint-disable no-console */
    Logger.info(`App is listening on port: ${chalk.cyanBright(app.get('PORT'))}`)
    Logger.info(`Environment: ${chalk.green(env.NODE_ENV)}`)
})