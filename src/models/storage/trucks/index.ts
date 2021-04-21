import mongoose, { Schema } from 'mongoose'
import { DATABASE_MODELS } from '../../../config/storage'


const truckSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    license_plate: {
        type: String,
        required: true
    },
    location: {
        current: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            },
            insertDate: {
                type: Date,
                default: new Date()
            }
        },
        history: [
            {
                lat: {
                    type: Number,
                    required: true
                },
                lng: {
                    type: Number,
                    required: true
                },
                insertDate: {
                    type: Date,
                    default: new Date()
                }
            }
        ]
    },

})


export default mongoose.model(DATABASE_MODELS.TRUCKS, truckSchema)
