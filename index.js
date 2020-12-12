const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex('slug');

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

app.get('/', () => {
  res.json({
    message: 'a Url Shortener - Shortens urls for your convenience!',
  });
});

app.get('/:id', async (req, res, next) => {
  console.log('Get url by id endpoint hit!');

  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    } else {
      res.redirect(`/?error=${slug} not found`);
    }
  } catch (error) {
    next(error);
  }
});

app.post('/:url', async (req, res, next) => {
  console.log('Create new url endpoint hit!');

  let { slug, url } = req.body;

  try {
    await schema.validate({
      slug,
      url,
    });

    if (!slug) {
      slug = nanoid(5);
    } else {
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new Error('Slug is in use. 🍔');
      }
    }

    slug = slug.toLowerCase();
    const newUrl = {
      url,
      slug,
    }
    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    next(error);
  }
});

const HTTP_SERVER_ERROR = 500;
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(HTTP_SERVER_ERROR);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🍰' : error.stack,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
