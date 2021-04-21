import * as Joi from '@hapi/joi'


const LatLongSchema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
})

export const createSchema = Joi.object({
    license_plate: Joi.string().required(),
    location: LatLongSchema.required()
})


export const truckIdParamsSchema = Joi.object({
    id: Joi.string().email().required()
})
export const truckParamsSchema = Joi.object({
    license_plate: Joi.string().required()
})

 

export const updateCurrentLocationSchema = Joi.object({
    location: LatLongSchema.required()
})