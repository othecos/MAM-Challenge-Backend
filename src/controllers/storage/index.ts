import chalk from 'chalk'
import mongoose, { ConnectionOptions, Mongoose } from 'mongoose'
import { DATABASE_URL, ca, DATABASE_NAME } from '../../config/storage'
import Utils from '../../utils'



var mongodb: any
let isConnected = false
export const init = async (counter: number) => {
    try {
        if (counter != 0) console.warn(`Trying to reconnect... ${counter} time`)
        let options: ConnectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            dbName: DATABASE_NAME
        }

        if (!DATABASE_URL?.includes('localhost')) {
            options = {
                ...options,
                ssl: true,
                sslValidate: true,
                sslCA: ca as any
            }
        }

        mongodb = await mongoose.connect(DATABASE_URL, options)

        console.log(chalk.green('Mongodb connected successfully'))
        isConnected = true
        mongodb.connection.on('disconnected', () => {
            console.log(chalk.red('Mongodb disconnected'))
            mongodb.connection.removeAllListeners()

            isConnected = false
            init(counter)
        })

        mongodb.connection.on('error', (error: any) => {
            mongodb.connection.removeAllListeners()
            console.error(error)
        })
        return isConnected

    }
    catch (error) {
        if (error && error.name) {
            switch (error.name) {
                case 'MongoNetworkError':
                case 'MongoError':
                    if (counter + 1 <= 6) {
                        await Utils.sleep(2000 * (counter + 1))
                        init(counter + 1)
                    } else {
                        const message = `${process.env.BASE_ENV} DB couldn't reconnect, please check this issue`
                        console.warn(message)
                        console.error(error)
                    }
                    break
                default:
            }
            console.error(error);

        }
        return isConnected
    }
}


type RunInTransactionCallback = (session: any) => any

export default class StorageController {

    private database: Mongoose

    constructor() {
        this.database = mongodb
    }

    async isMongoInitialized(): Promise<boolean> {
        if (isConnected) return isConnected
        else {
            await Utils.sleep(300)
            return this.isMongoInitialized()
        }
    }

    getDatabase() {
        return this.database
    }


    async run(usedSession: any, callback: RunInTransactionCallback) {
        const session = usedSession ? usedSession : await mongoose.startSession()
        session.startTransaction()
        try {
            const value = await callback(session)
            // Since the mutations ran without an error, commit the transaction.
            await session.commitTransaction()
            // Return any value returned by `mutations` to make this function as transparent as possible.
            return value
        }
        catch (error) {
            // Abort the transaction as an error has occurred in the mutations above.
            await session.abortTransaction()
            // Rethrow the error to be caught by the caller.
            throw error
        }
        finally {
            // End the previous session.
            session.endSession()
        }
    }

}


if (DATABASE_URL)
    init(0)
