
// @ts-nocheck
import { expect } from 'chai'

import TrucksController from '../../controllers/trucks'
import { generateRandomTrucks, generateRandomLocations } from './data'

const trucks = generateRandomTrucks(10)
describe('Crud testing...', function () {
    const trucksController = new TrucksController();
    this.timeout(50000)
    for (const truck of trucks) {
        it(`Creating truck ${truck.license_plate} in location [${truck.location.lat},${truck.location.lng}]...`, async function () {

            const createdTruck = await trucksController.create(truck)
            expect(createdTruck).to.have.property('license_plate').equal(truck.license_plate)
            expect(createdTruck).to.have.property('location').with.property('current').and.that.to.be.a('object')
            expect(createdTruck).to.have.property('location').with.property('history').and.that.to.be.a('array').with.lengthOf(0)
        })
        it(`Fetching truck ${truck.license_plate}...`, async function () {

            const truckFromDB = await trucksController.findByLicensePlate(truck.license_plate)
            expect(truckFromDB).to.have.property('license_plate').equal(truck.license_plate)
            expect(truckFromDB).to.have.property('location').with.property('current').and.that.to.be.a('object')
            expect(truckFromDB).to.have.property('location').with.property('history').and.that.to.be.a('array').with.lengthOf(0)
        })
        const locations = generateRandomLocations(12)
        for (let index = 0; index < locations.length; index++) {
            const location = locations[index];
            it(`Updating truck ${truck.license_plate} with coordinates [${location.lat},${location.lng}] ...`, async function () {

                const truckFromDB = await trucksController.updateLocation(truck.license_plate, location)
                expect(truckFromDB).to.have.property('license_plate').equal(truck.license_plate)
                expect(truckFromDB).to.have.property('location').with.property('current').and.that.to.be.a('object').with.property('lat').equal(location.lat)
                expect(truckFromDB).to.have.property('location').with.property('current').and.that.to.be.a('object').with.property('lng').equal(location.lng)
                expect(truckFromDB).to.have.property('location').with.property('history').and.that.to.be.a('array').with.lengthOf(index + 1)

            })
        }

        it(`Deleting truck ${truck.license_plate}...`, async function () {
            await trucksController.deleteByLicensePlate(truck.license_plate)
            try {
                expect(await trucksController.findByLicensePlate(truck.license_plate)).to.throw()
            } catch (err) {
                expect(err).to.have.property('code').equal(404)
            }

        })
    }


})