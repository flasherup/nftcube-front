export function trimIfNeeded(string:string, length:number):string {
    return string.length > length ?
        string.substring(0, length - 3) + "..." :
        string;
}