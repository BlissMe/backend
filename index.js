require('dotenv').config();
const db = require('./src/config/db');
    
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const indexRoute = require('./src/routes/index.route');

// Import DB connection (just importing ensures it runs)

app.use(bodyParser.json());
app.use(cors({ origin: '*' }));
app.use('', indexRoute);

app.listen(port, () => {
    console.log(`BlissMe APIs listening on port - ${port}`);
});
