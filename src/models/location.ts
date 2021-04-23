import Utils from '@utils/index'
 
export default class Location {

    private lat: number | null
    private lng: number | null
    private insertDate: Date | null = null

    /**
     *
     * @param {number} lat
     * @param {number} lng
     */
    constructor(lat = 0, lng = 0) {
      this.lat = lat
      this.lng = lng
    }


    setData(location: any): void {
      if (location) {
        if (!Utils.isNil(location.lat)) this.lat = location.lat
        if (!Utils.isNil(location.lng)) this.lng = location.lng
        if (!Utils.isNil(location.insertDate)) this.insertDate = location.insertDate

      }
    }

    toDatabase(): any {
      const object: any = {
        lat: this.lat,
        lng: this.lng
      }
      if (this.insertDate) object['insertDate'] = this.insertDate
      return object
    }
    toUpdate(): any {
      const object: any = {
        lat: this.lat,
        lng: this.lng
      }
      if (this.insertDate) object['insertDate'] = this.insertDate
      return object
    }

    toJSON(): any {
      return {
        lat: this.lat,
        lng: this.lng,
        insertDate: this.insertDate
      }
    }
}
