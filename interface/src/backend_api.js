import JsonBigint from "json-bigint";

export async function callDalleService(backendUrl, text, numImages, dalleName) {
  return JsonBigint.parse(await (await fetch(backendUrl + `/dalle`, {
    method: 'POST',
    headers: {
      'Bypass-Tunnel-Reminder': "go",
      'mode': 'no-cors'
    },
    body: JSON.stringify({
      text,
      'num_images': numImages,
      'model_name': dalleName
    })
  }).then(function (response) {
    return response
  }).catch((error) => {
    alert('Error querying DALL-E service. ' + error)
    throw error
  })).text())
}

export async function getAvailableModels(backendUrl) {
  return JsonBigint.parse(await (await fetch(backendUrl + `/available-models`, {
    headers: {
      'Bypass-Tunnel-Reminder': "go",
      'mode': 'no-cors'
    }
  }).then(function (response) {
    return response
  }).catch((error) => {
    alert('Error fetching available models. ' + error)
    throw error
  })).text())

}
