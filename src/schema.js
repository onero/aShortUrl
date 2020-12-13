const yup = require('yup');

const anyCharacterDigitsUnderscoreOrDashRegex = /[\w\-]/i;

module.exports = schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(anyCharacterDigitsUnderscoreOrDashRegex),
  url: yup.string().trim().url().required(),
});