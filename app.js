const express = require('express');
const pokemons = require('./mock-pokemon');
const pokedexRaw = require('./pokedex.json');
const fs = require('fs');
const { succes } = require('./helper');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const app = express();
const port = 3000;

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'));

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



/* 
const pokedex = JSON.parse(fs.readFileSync('./pokedex.json', 'utf8'));

app.get('/api/V2/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > pokedex.length) {
        res.status(404).send('Désolé, nous n’avons pas ce pokémon');
        return;
    }
    const pokemon = pokedex.pokemon.find(pokemon => parseInt(pokemon.id) === id);
    console.log(pokemon);
    res.send(`Vous avez demandé le pokémon n°${id} : ${pokemon.name}`);
}); */


app.listen(port, () => console.log(`Notre appli vient de démarrer sur : http://localhost:${port}`));