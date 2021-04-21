import faker from 'faker'

export const generateRandomLocations = (number: number) => {
    return [...Array(number)].map(() => {
        return {
            lat: Number(faker.address.latitude(38.72, 38.74, 6)),
            lng: Number(faker.address.longitude(-9.3, -9.1, 6))
        }
    })
}
export const generateRandomTrucks = (number: number = 1) => {
    return [...Array(number)].map(() => {
        const location = {
            lat: Number(faker.address.latitude(38.72, 38.74, 6)),
            lng: Number(faker.address.longitude(-9.3, -9.1, 6))
        }
        return {
            license_plate: faker.vehicle.vin(),
            location
        }
    })
}

