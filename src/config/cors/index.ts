import { NODE_ENV } from '../env'

const corsOptions: any = {
    local: {
        origin: '*'
    },
    development: {
        origin: '*'
    },
    quality_assurance: {
        origin: '*'
    },
    production: {
        origin: '*'
    }
}

export default corsOptions[NODE_ENV]