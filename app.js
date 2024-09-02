const express = require('express');
let pokemons = require('./mock-pokemon');
const pokedexRaw = require('./pokedex.json');
const fs = require('fs');
const { succes, getUniqueID } = require('./helper');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const PokemonModel = require('./src/models/pokemon');


const app = express();
const port = 3000;
const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: false
    }
)

sequelize.authenticate()
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch(err => console.error(`Impossible de se connecter à la base de données: ${err}`));

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({ force: true })
    .then(() => { 
        console.log('La base de données a été synchronisée')
        Pokemon.create({
            name: "Bulbizarre",
            hp: 25999,
            cp: 5,
            picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
            types: ["Plante", "Poison"].join()
    }).then(bulbizare => console.log(bulbizare.toJSON()))
});

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello Express je change en azeaelive!'));

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > pokemons.length) {
        res.status(404).send('Désolé, nous n’avons pas ce pokémon');
        return;
    }
    const pokemon = pokemons.find(pokemon => pokemon.id === id);
    const message = "Un pokémon a bien été trouvé";
    res.status(200).json(succes(message, pokemon));
});

app.get('/api/pokemons', (req, res) => {
    const message = `Notre pokedex contient actuellement ${pokemons.length} pokémons`;
    res.send(succes(message, pokemons));
});

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueID(pokemons);
    const pokemonCreated = {... req.body, ...{id: id, created: new Date()}};
    pokemons.push(pokemonCreated);
    const message = `Félicitation, vous avez ajouté le pokémon ${pokemonCreated.name}`;
    res.status(201).json(succes(message, pokemonCreated));
});

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = {... req.body, id:id };
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon;
    })
    const message = `Félicitation, vous avez modifié le pokémon ${pokemonUpdated.name}`;
    res.status(200).json(succes(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pokemons = pokemons.filter(pokemon => pokemon.id !== id);
    const message = `Le pokémon avec l'id ${id} a bien été supprimé`;
    res.status(200).json(succes(message, pokemons));
});

//const pokedex = JSON.parse(fs.readFileSync('./pokedex.json', 'utf8'));

app.listen(port, () => console.log(`Notre appli vient de démarrer sur : http://localhost:${port}`));