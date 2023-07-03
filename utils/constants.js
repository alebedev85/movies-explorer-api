const regexHttp = /^https*:\/\/[A-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i;
const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

module.exports = {
  regexHttp,
  regexEmail,
};
