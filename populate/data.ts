import faker
    //,  { random } 
    from 'faker'
import { Coordinates } from './model'
import { Client, TravelMode } from '@googlemaps/google-maps-services-js'
import axios from 'axios'
import { DirectionsResponseData } from '@googlemaps/google-maps-services-js/dist/directions'
import { decodePath } from '@utils/googleMaps'
import config from '@config/env'

const client = new Client({ axiosInstance: axios })

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
        const location = generateRandomLocationsWithinRadiusRange(1)[0]
        return {
            license_plate: faker.vehicle.vin(),
            location: location
        }
    })
}



export const generateLocationsByRoutes = async (origin: Coordinates, destination: Coordinates) => {
    let locations: Array<any> = []
    console.log(config.API_KEY)
    if (config.API_KEY) {
        try {
            const response = await client.directions({ params: { origin, destination, key: config.API_KEY, mode: TravelMode.driving } })

            const locationsByResult = getLocationsByDirectionsResult(response.data)
            if (locationsByResult && Array.isArray(locationsByResult)) {
                locations = locationsByResult
            }
        } catch (err) {
            console.error(err);

        }
    } else {
        console.error('No API_KEY were found')
    }

    return locations

}

const getLocationsByDirectionsResult = (response: DirectionsResponseData) => {
    const points = response?.routes[0]?.overview_polyline.points
    const overview_path = decodePath(points)
    const locationMarkers = []
    if (overview_path && Array.isArray(overview_path)) {
        for (let index = 0; index < overview_path.length; index++) {
            if (index % 3 == 0 || index == 0) {
                const location = overview_path[index];
                locationMarkers.push(location)
            }
        }
    }
    return locationMarkers
}

export const generateRandomLocationsWithinRadiusRange = (number: number = 1, coordinate: Coordinates = {
    lat: 38.7495122,
    lng: -9.1819189
}) => {
    return [...Array(number)].map(() => {

        const { lat, lng } = randomGeo(coordinate, 3000)
        return {
            lat,
            lng
        }
    })
}
function randomGeo(center: Coordinates, radius: number) {
    const y0 = center.lat;
    const x0 = center.lng;
    const rd = radius / 111300; //about 111300 meters in one degree

    const u = Math.random();
    const v = Math.random();

    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    //Adjust the x-coordinate for the shrinking of the east-west distances
    const xp = x / Math.cos(y0);

    const newlat = y + y0;
    const newlon = x + x0;
    const newlon2 = xp + x0;
    const response = {
        'latitude': newlat.toFixed(6),
        'longitude': newlon.toFixed(6),
        'longitude2': newlon2.toFixed(6),
        'distance': distance(center.lat, center.lng, newlat, newlon).toFixed(2),
        'distance2': distance(center.lat, center.lng, newlat, newlon2).toFixed(2),
    };
    return {
        lat: Number(response.latitude),
        lng: Number(response.longitude)
    }
}

//Calc the distance between 2 coordinates as the crow flies
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000;
    const a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}