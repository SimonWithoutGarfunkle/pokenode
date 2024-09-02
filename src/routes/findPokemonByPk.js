const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.get('/api/pokemons/:id', (req, res) => {
        try {Pokemon.findByPk(req.params.id).then(pokemon => {
            const message = 'Le pokémon a bien été récupéré.';
            res.json({message, data: pokemon})
        })} catch (error) {
            res.status(404).json({message: 'Le pokémon demandé n\'existe pas.'})
        }
    })}