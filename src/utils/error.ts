export const retrieveError = (payload:any) => {
    let res = '';
    if (payload.hasOwnProperty('status')) {
        res += 'Status: ' + payload.status;

    }
    if (payload.hasOwnProperty('data')) {
        const data = payload.data;
        if (data && data.hasOwnProperty('error')) {
            res +=  ', Message: ' + data.error;
        }

    }

    return res;
}

export const retrieveMetamaskError = (payload:any) => {
    let res = 'Metamask Error';
    if (payload) {
        if (payload.hasOwnProperty('message')) {
            res = payload.message;
        }

        if (payload.hasOwnProperty('data')) {
            const data = payload.data;
            if (data && data.hasOwnProperty('message')) {
                res = data.message;
            }
        }
    }
    return res;
}

export const metamaskStackIntoJson = (stack:string):Object|null => {
    const end = stack.lastIndexOf('},')
    if (end >= 0) {
        const parse = stack.substring(0, end+1) + '}';
        try {
            return JSON.parse(parse);
        } catch (e) {
            console.log('Can not parse json', parse);
        }
    }
    return null;
}