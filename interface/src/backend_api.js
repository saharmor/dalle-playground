import JsonBigint from "json-bigint";

export async function callDalleService(backendUrl, text, numImages) {
    debugger
    return JsonBigint.parse(await (await fetch(backendUrl + `/dalle`, {
        method: 'POST',
        headers: {
            'Bypass-Tunnel-Reminder': "go",
            'mode': 'no-cors'
        },
        body: JSON.stringify({
            text,
            'num_images': numImages,
        })
    }).then(function (response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response
    })).text())
}

export async function checkIfValidBackend(backendUrl) {
    return await fetch(backendUrl, {
        headers: {
            'Bypass-Tunnel-Reminder': "go",
            'mode': 'no-cors'
        }
    }).then(function (response) {
        return true
    }).catch(() => {
        return false
    })
}
