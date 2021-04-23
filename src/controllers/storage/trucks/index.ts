import StorageController from '..'

import { Trucks } from '@models/storage'
import Truck from '@models/truck'
import { HttpError } from '@utils/ErroHandler'

export default class TrucksStorageController extends StorageController {
    constructor() {
        super()
        //Creating collection in case it doesn't exists
        this.initializeCollection()
    }
    async initializeCollection() {
        return await Trucks.createCollection()
    }
    async findByID(id: string, select = '', usedSession?: any): Promise<any> {
        try {
            if (id) {
                let truck = await this.run(usedSession, async (session) => await Trucks.findOne({ '_id': id }).select(select).session(session).exec())
                return truck
            } else {
                throw HttpError(400)

            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async findByLicensePlate(license_plate: string, select = '', usedSession?: any): Promise<any> {
        try {
            if (license_plate) {
                let truck = await this.run(usedSession, async (session) => await Trucks.findOne({ 'license_plate': license_plate }).select(select).session(session).exec())
                return truck
            } else {
                throw HttpError(400)

            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async create(truck: Truck, usedSession?: any): Promise<any> {
        try {
            if (truck) {
                let TrucksSchema = new Trucks(truck.toDatabase())
                let newTruck = this.run(usedSession, async (session) => await TrucksSchema.save({ session }))
                return newTruck
            } else {
                throw HttpError(400)
            }
        } catch (error) {
            throw error
        }

    }

    async findAll(select = '-_id -__v', usedSession?: any) {
        try {
            const trucks = await this.run(usedSession, async (session) => await Trucks.find({}).select(select).session(session).exec())
            return trucks
        } catch (error) {
            console.error(error)
            throw error
        }

    }

    async findOneAndUpdate(truck: Truck, select = '', usedSession?: any) {
        try {

            const modifiedTruck = await this.run(usedSession, async (session) => await Trucks.findOneAndUpdate({ 'license_plate': truck.license_plate }, truck.toUpdate(), { new: true }).select(select).session(session).exec())
            if (modifiedTruck) {
                return modifiedTruck
            } else {
                throw HttpError(500)
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async findOneAndDelete(license_plate: string, usedSession?: any) {
        try {
            return await this.run(usedSession, async (session) => await Trucks.findOneAndDelete({ license_plate }).session(session).exec())
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
