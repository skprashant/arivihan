import { auth } from "../firebase"

function customFetchRequest(path, method = "POST", body = {}) {

    let headers = {
        "token": localStorage.getItem("token") ?? "",
        "userId": localStorage.getItem('id') ?? "",
    }

    let options = {
        method: method,
        headers: headers,
    }

    if (method === "POST") {
        options['body'] = body
    }

    return fetch(`https://platform-dev.arivihan.com/arivihan-platform/secure/web/${path}`, options)
        .then(res => {
            if(res.status === 200){
                return res.json()
            }else if(res.status === 401){
                if (auth.currentUser !== null) {
                    auth.currentUser.getIdToken(true).then((res) => {
                        localStorage.setItem('token', res)
                    })
                }
            }
        })
        .then(json => {
            return json;
        })
}


export {
    customFetchRequest
}

