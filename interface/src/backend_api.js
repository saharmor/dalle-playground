import JsonBigint from "json-bigint";

const REQUEST_TIMEOUT_SEC = 60000

export async function callDalleService(backendUrl, text, numImages) {
    const queryStartTime = new Date()
    const response = await Promise.race([
        (await fetch(backendUrl + `/generate`, {
                method: 'POST',
                headers: {
                    'Bypass-Tunnel-Reminder': "go"
                },
                body: JSON.stringify({
                    text,
                    'num_images': numImages,
                })
            }
        ).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response
        })).text(), new Promise((_, reject) => setTimeout(
            () => reject(new Error('Timeout')), REQUEST_TIMEOUT_SEC))
    ]);


    return {
        'executionTime': Math.round(((new Date() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100,
        'serverResponse': JsonBigint.parse(response)
    }
}

export async function checkIfValidBackend(backendUrl) {
    return await fetch(backendUrl, {
        headers: {
            'Bypass-Tunnel-Reminder': "go"
        }
    }).then(function (response) {
        return true
    }).catch(() => {
        return false
    })
}
