const { Pokemon } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const auth = require('../auth/auth');

module.exports = (app) => {
    app.post('/api/pokemons', auth, (req, res) => {
        Pokemon.create(req.body).then(pokemon => {
            const message = `Le pokémon ${pokemon.name} a bien été créé.`;
            res.json({message, data: pokemon})
        })
        .catch(error => {
            if (error instanceof ValidationError, UniqueConstraintError) {
                return res.status(400).json({message: error.message, data: error})
            }
            const message = 'Le pokémon n\'a pas pu être ajouté. Réessayez dans quelques instants.';
            res.status(500).json({message, data: error})
        })
    })
};