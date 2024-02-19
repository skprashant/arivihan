
function customFetchRequest(path, method = "POST", body = {}) {

    let headers = {
        "token": localStorage.getItem("token"),
        "userId": localStorage.getItem('id')
    }

    let options = {
        method: method,
        headers: headers,
    }

    if (method === "POST") {
        options['body'] = body
    }

    return fetch(`/secure/web/${path}`, options)
        .then(res => res.json())
        .then(json => {
            return json
        })
}


export {
    customFetchRequest
}

