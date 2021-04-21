import TrucksStorageController from '../storage/trucks'
import Truck from '../../models/truck'
import { HttpError } from '../../utils/ErroHandler'


interface LocationBody {
    lat: number,
    lng: number
}

interface TruckInsertBody {
    license_plate: string,
    location: LocationBody
}

export default class TrucksController {

    private storageController

    constructor() {
        this.storageController = new TrucksStorageController()

    }

    async initCollection() {
        return this.storageController.initializeCollection()
    }
    async create(truckInsertBody: TruckInsertBody): Promise<Truck> {
        try {
            let truckDB = await this.storageController.findByLicensePlate(truckInsertBody.license_plate)
            if (truckDB) {
                throw HttpError(409)
            } else {
                const truck = new Truck(truckInsertBody.license_plate)
                truck.setLocation(truckInsertBody.location)
                truckDB = await this.storageController.create(truck)
                truck.setData(truckDB)
                return truck
            }

        } catch (error) {
            throw error
        }
    }

    async findAll(): Promise<Array<Truck>> {
        try {
            let trucks = await this.storageController.findAll()
            return trucks
        } catch (error) {
            throw error
        }
    }

    async findByLicensePlate(license_plate: string): Promise<Truck> {
        try {
            let truckResponse = await this.storageController.findByLicensePlate(license_plate)

            if (truckResponse) {
                const truck = new Truck()
                truck.setData(truckResponse)
                return truck
            } else {
                throw HttpError(404)
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async deleteByLicensePlate(license_plate: string): Promise<Truck> {
        try {
            const deletedTruck = await this.storageController.findOneAndDelete(license_plate)
            if (deletedTruck) {
                return deletedTruck
            } else {
                throw HttpError(404)
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async updateLocation(license_plate: string, location: LocationBody): Promise<Truck> {

        try {
            let truckDB = await this.findByLicensePlate(license_plate)
            if (truckDB) {
                let truckModel = new Truck()
                truckModel.setData(truckDB)
                truckModel.updateCurrentLocation(location)
                return await this.storageController.findOneAndUpdate(truckModel)
            } else {
                throw HttpError(404)
            }

        } catch (error) {
            console.error(error)
            throw error
        }

    }
}
