import { LatLngLiteral } from '@googlemaps/google-maps-services-js'

/**
 * Decodes a polyline encoded string.
 *
 * See {@link https://developers.google.com/maps/documentation/utilities/polylinealgorithm}
 */
export function decodePath(encodedPath: string): LatLngLiteral[] {
  const len: number = encodedPath.length || 0
  const path = new Array(Math.floor(encodedPath.length / 2))
  let index = 0
  let lat = 0
  let lng = 0
  let pointIndex: number

  for (pointIndex = 0; index < len; ++pointIndex) {
    let result = 1
    let shift = 0
    let b: number
    do {
      b = encodedPath.charCodeAt(index++) - 63 - 1
      result += b << shift
      shift += 5
    } while (b >= 0x1f)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    result = 1
    shift = 0
    do {
      b = encodedPath.charCodeAt(index++) - 63 - 1
      result += b << shift
      shift += 5
    } while (b >= 0x1f)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    path[pointIndex] = { lat: lat * 1e-5, lng: lng * 1e-5 }
  }
  path.length = pointIndex

  return path
}