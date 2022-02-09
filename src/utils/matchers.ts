interface Status {
    status:string
}

export function isUninitialized(object:Status):boolean {
    return object.status === 'uninitialized';
}

export function isFulfilled(object:Status):boolean {
    return object.status === 'fulfilled';
}

export function isRejected(object:Status):boolean {
    return object.status === 'rejected';
}

export function isPending(object:Status):boolean {
    return object.status === 'pending';
}