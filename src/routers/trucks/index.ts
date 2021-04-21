import { Router, Request, Response, NextFunction } from 'express'
import { validator } from '../../config/validator'
import { createSchema, truckParamsSchema,updateCurrentLocationSchema } from './schemas'
 
import TrucksController from '../../controllers/trucks'

const router = Router()


const initRouter = () => {

    router.route('/')
        .post(
            validator.body(createSchema),
            create
        )
        .get(findAll)

    router.route('/:license_plate')
        .get(
            validator.params(truckParamsSchema),
            findByLicensePlate
        )
        .patch(
            validator.params(truckParamsSchema),
            validator.body(updateCurrentLocationSchema),
            updateByLicensePlate
        )
        .delete(
            validator.params(truckParamsSchema),
            deleteByLicensePlate
        )
 
       

    return router
}


const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const truckInsertBody = req.body
        const trucksController = new TrucksController()
        const truck = await trucksController.create(truckInsertBody)
        res.status(200).json(truck.toJSON())
    } catch (error) {
        return next(error)
    }

}


const findAll = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const trucksController = new TrucksController()
        const trucks = await trucksController.findAll()
        res.status(200).json(trucks.map((truck)=> truck.toJSON()))
    } catch (error) {
        return next(error)
    }
}


const findByLicensePlate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trucksController = new TrucksController()
        const { license_plate } = req.params
        const result = await trucksController.findByLicensePlate(license_plate)
        res.status(200).json(result.toJSON())
    } catch (error) {
        return next(error)
    }
}

const updateByLicensePlate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { license_plate } = req.params
        const { location } = req.body
        const trucksController = new TrucksController()
        const updatedTruck = await trucksController.updateLocation(license_plate,location)
        res.status(200).json(updatedTruck.toJSON())
    } catch (error) {
        return next(error)
    }
}

const deleteByLicensePlate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { license_plate } = req.params
        const trucksController = new TrucksController()
        const deletedTruck = await trucksController.deleteByLicensePlate(license_plate)
        res.status(200).json(deletedTruck.toJSON())
    } catch (error) {
        return next(error)
    }
}


export default initRouter()
