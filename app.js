const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');
const cors = require('cors')



const app = express();
const port = 3000;

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(cors);

sequelize.initDb();
console.log('test de vitesse');

app.get('/', (req, res) => {
    res.send('Hello Deployed World!');
});

require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk')(app);
require('./src/routes/createPokemon')(app);
require('./src/routes/deletePokemon')(app);
require('./src/routes/updatePokemon')(app);
require('./src/routes/login')(app);

//Middleware pour gérer les pages non trouvées
app.use(({ res }) => {
    const message = 'La ressource demandée n\'existe pas';
    res.status(404).json({ message });
});

app.listen(port, () => console.log(`Notre appli vient de démarrer sur : http://localhost:${port}`));