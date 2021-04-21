import { config } from 'dotenv'
config()
import fs from 'fs'
import path from 'path'

export const DATABASE_URL: any = process.env.DATABASE_URL
export const POPULATE: boolean = process.env.ENV_POPULATE ? true : false
export const DATABASE_NAME: any = process.env.DATABASE_NAME

export const DATABASE_MODELS = {
    TRUCKS: 'trucks'
}

export const ca = fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf8')
