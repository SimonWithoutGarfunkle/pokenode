const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.delete('/api/pokemons/:id', (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            const pokemonToDelete = pokemon;
            if (pokemonToDelete === null) {
                const message = `le pokemon demandé n'existe pas. Réessayez avec un autre identifiant.`;
                return res.status(404).json({message})
            }
            return Pokemon.destroy({where: {id: pokemon.id}})
                .then(_ => {
                    const message = `Le pokémon ${pokemonToDelete.name} a bien été supprimé. RIP ${pokemonToDelete.name}.`;
                    res.json({message, data: pokemonToDelete})
                })
        })
        .catch(error => {
            const message = `Le pokémon n'a pas pu être supprimé. Réessayez dans quelques instants.`;
            res.status(500).json({message, data: error})
        })
    })
}