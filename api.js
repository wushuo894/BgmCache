let post = async (url, body) => {
    return await fetch_(url, 'POST', body);
}

let get = async (url) => {
    return await fetch_(url, 'GET', '');
}

let del = async (url, body) => {
    return await fetch_(url, 'DELETE', body);
}

let put = async (url, body) => {
    return await fetch_(url, 'PUT', body);
}

let fetch_ = async (url, method, body) => {
    let headers = {}
    if (authorization.value.length) {
        headers['Authorization'] = authorization.value
    }
    return await fetch(url, {
        'method': method,
        'body': body ? JSON.stringify(body) : null,
        'headers': headers
    })
        .then(res => {
            if (res.status !== 200) {
                return new Promise((resolve, reject) => {
                    reject(new Error(res.status.toString()));
                });
            }
            return res.json();
        })
}

let authorization = {value: ''}

export default {post, get, del, put, authorization}

