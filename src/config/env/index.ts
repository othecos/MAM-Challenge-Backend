/* eslint-disable */
export const NODE_ENV = process.env.NODE_ENV || 'local'

const config: any = {
    local: {
        PORT: 8000,
        NODE_ENV,
        API_KEY: process.env.GOOGLE_API_KEY
    },
    test: {
        PORT: process.env.PORT || 80,
        NODE_ENV,
        API_KEY: process.env.GOOGLE_API_KEY
    },
    production: {
        PORT: process.env.PORT || 80,
        NODE_ENV,
        API_KEY: process.env.GOOGLE_API_KEY
    }
}

export default config[NODE_ENV]