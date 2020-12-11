const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const { nanoid } = require('nanoid');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
  // Any characters, digits, underscore and dash
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.get('/', (req, res) => {
  res.json({
    message: 'a Url Shortener - Shortens urls for your convenience!',
  });
});

app.get('/:id', (req, res, next) => {
  const { id: slug } = req.params;
  try {
    // TODO ALH: Lookup url!
    const url = 'https://www.google.com'
    if (url) {
      res.redirect(url);
    }
  } catch (error) {
    next(error)
  }
});

app.post('/:url', async (req, res, next) => {
  let { slug, url } = req.body;

  try {
    await schema.validate({
      slug,
      url,
    });
    if (!slug) {
      slug = nanoid(5);
    }
    slug = slug.toLowerCase();
    res.json({
      slug,
      url
    });
  } catch (error) {
    next(error);
  }
});

app.get('/url/:id', (req, res) => {
  // TODO ALH: Get url information
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'UhUh!' : error.stack,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
