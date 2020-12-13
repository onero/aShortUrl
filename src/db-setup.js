const monk = require('monk');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
db.then(() => {
  console.log('MongoDB Connected!')
})
const urls = db.get(process.env.MONGO_INITDB_DATABASE);
urls.createIndex('slug');

module.exports = urls;