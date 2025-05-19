require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const indexRoute = require('./src/routes/index.route');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));
app.use('', indexRoute);

app.listen(port, () => {
    console.log(`BlissMe APIs listening on port - ${port}`)
})
