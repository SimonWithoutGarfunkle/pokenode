const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.delete('/api/pokemons/:id', (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            const pokemonToDelete = pokemon;
            Pokemon.destroy({where: {id: pokemon.id}})
                .then(_ => {
                    const message = `Le pokémon ${pokemonToDelete.name} a bien été supprimé. RIP ${pokemonToDelete.name}.`;
                    res.json({message, data: pokemonToDelete})
                })
        })
    })
}