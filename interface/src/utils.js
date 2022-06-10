export function isValidURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(:\\d+)?(\\/[-\\w%.~+]*)*' + // port and path
      '(\\?[;&\\w%.~+=-]*)?' + // query string
      '(#[-\\w]*)?$',
    'i',
  ); // fragment locator

  return Boolean(pattern.test(str));
}
