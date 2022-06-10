import JsonBigint from 'json-bigint';

const REQUEST_TIMEOUT_SEC = 60000;

export async function callDalleService(backendUrl, text, numImages) {
  const queryStartTime = new Date();
  const response = await Promise.race([
    (
      await fetch(`${backendUrl}/dalle`, {
        method: 'POST',
        headers: {
          'Bypass-Tunnel-Reminder': 'go',
          mode: 'no-cors',
        },
        body: JSON.stringify({
          text,
          num_images: numImages,
        }),
      }).then((resp) => {
        if (!resp.ok) {
          throw Error(resp.statusText);
        }

        return resp;
      })
    ).text(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), REQUEST_TIMEOUT_SEC)),
  ]);

  return {
    executionTime: Math.round(((new Date() - queryStartTime) / 1000 + Number.EPSILON) * 100) / 100,
    generatedImgs: JsonBigint.parse(response),
  };
}

export const validateDalleServer = (backendUrl) =>
  fetch(backendUrl, {
    headers: {
      'Bypass-Tunnel-Reminder': 'go',
      mode: 'no-cors',
    },
  });
