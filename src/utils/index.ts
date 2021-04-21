
export default class Utils {
  static isNil(value:any):boolean{
    return value == null || value == undefined
  }
  static isEmpty(value:any):boolean{
    return value  == '' || value == {} || value == [] 
  }
  static sleep(ms:number):Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}