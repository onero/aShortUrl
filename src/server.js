const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Initial DB setup
require('./db-setup');

const routes = require('./routes')
const errorMiddleware = require('./error-middleware')
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.use(routes);
app.use(errorMiddleware.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
