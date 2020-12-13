const express = require('express');
const { nanoid } = require('nanoid');

const router = express.Router();
const schema = require('./schema');
const urls = require('./db-setup');

router.get('/', () => {
  res.json({
    message: 'a Url Shortener - Shortens urls for your convenience!',
  });
});

router.get('/:id', async (req, res, next) => {
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

router.post('/:url', async (req, res, next) => {
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

module.exports = router;
