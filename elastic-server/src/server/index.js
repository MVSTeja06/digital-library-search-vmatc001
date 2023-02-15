const express = require('express');

const app = express();

const cors = require('cors')

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes'));

app.listen(PORT, () => console.log(`serving on ${PORT}`));