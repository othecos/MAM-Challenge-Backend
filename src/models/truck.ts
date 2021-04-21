import Location from './location'


interface TruckLocation {
    current: Location
    history: Array<Location>
}

export default class Truck {


    private _id = ''
    public license_plate: string
    private location: TruckLocation

    /**
     *
     */
    constructor(license_plate = '') {
      this.license_plate = license_plate
      this.location = {
        current: new Location(),
        history: []
      }
    }

    public get id(): string {
      return this._id
    }

    setData(truckDB: any): void {
      if (truckDB) {
        if (truckDB._id) this._id = truckDB._id
        if (truckDB.license_plate) this.license_plate = truckDB.license_plate
        if (truckDB.location) {
          this.location.current.setData(truckDB.location.current)
          if (truckDB.location.history && Array.isArray(truckDB.location.history)) {
            this.location.history = truckDB.location.history.map((locationHistory: Location) => {
              const locationModel = new Location()
              locationModel.setData(locationHistory)
              return locationModel
            })
          }
        }
      }
    }

    toDatabase(): any {
      const object: any = {
        license_plate: this.license_plate,
        location: {
          current: this.location.current.toDatabase(),
          history: this.location.history.map((location) => location.toDatabase())
        }
      }
      if (this._id) object['_id'] = this._id
      return object
    }
    toUpdate(): any {
      const object: any = {
        _id: this._id,
        license_plate: this.license_plate,
        location: {
          current: this.location.current.toUpdate(),
          history: this.location.history.map((location) => location.toUpdate())
        }
      }

      return object
    }
    updateCurrentLocation(location: any):void {
      if (location) {
        this.location.history.push(this.location.current)
        this.location.current = new Location()
        this.location.current.setData({ ...location, insertDate: new Date() })
      }

    }
    setLocation(location: any):void {
      if (location) this.location.current.setData(location)
    }

    toJSON(): any {
      return {
        license_plate: this.license_plate,
        location: {
          current: this.location.current.toJSON(),
          history: this.location.history.map((location) => location.toJSON())
        }
      }
    }
}
