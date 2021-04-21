

import TrucksController from './../src/controllers/trucks'
import StorageController from './../src/controllers/storage/index'
import { generateRandomTrucks, generateRandomLocationsWithinRadiusRange, generateLocationsByRoutes } from './data'
import chalk from 'chalk'

const populate = async () => {
    const storageController = new StorageController()
    const isInitialized = await storageController.isMongoInitialized()
    if (isInitialized) {
        const trucks = generateRandomTrucks(20)
        const trucksController = new TrucksController();

        await trucksController.initCollection()
        try {
            for (const truck of trucks) {

                console.log(`Creating truck ${chalk.green(truck.license_plate)} in location ${chalk.blue(`[${truck.location.lat},${truck.location.lng}]`)}...`)
                await trucksController.create(truck)
                const origin = truck.location
                const destiny = generateRandomLocationsWithinRadiusRange(1)[0]
                const locations = await generateLocationsByRoutes(origin, destiny)
                for await (const location of locations) {
                    console.log(` Updating truck ${chalk.green(truck.license_plate)} location to ${chalk.blue(`[${location.lat},${location.lng}]`)}...`)
                    await trucksController.updateLocation(truck.license_plate, location)
                }

            }

            console.log(chalk.green(`MongoDB populated...`))
        } catch (err) {
            console.error(err);
            console.error(chalk.red('Error when trying to populate database'));
        }
    } else {
        console.error(chalk.red('Error when trying to connect to database'));
    }

}
populate()