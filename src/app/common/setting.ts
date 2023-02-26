export class Setting{
    key!:String;
    value!: any;
    constructor(key: String, value: any){
        this.key = key;
        this.value = value;
    }
}