const { Pokemon } = require('../db/sequelize');
const { Op } = require('sequelize');

module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        if (req.query.name) {
            const limitResult = parseInt(req.query.limit) || 5;
            const name = req.query.name;
            if (name.length < 2) {
                const message = 'Le terme de recherche doit contenir au moins 2 caractères.';
                return res.status(400).json({message})
            }


            return Pokemon.findAndCountAll({
                where: { 
                    name: { 
                        [Op.like]: `%${name}%` 
                    }
                },
                order: ['name'],
                limit: limitResult
            })
            .then(({count, rows}) => {
                const message = `Il y a ${count} pokémon(s) avec le nom ${name}`;
                res.json({message, data: rows})
            })
        } else {
            Pokemon.findAll({order: ['name']})
            .then(pokemons => {
                const message = 'La liste des pokémons a bien été récupérée.';
                res.json({message, data: pokemons})
            })
        .catch(error => {
            const message = 'La liste des pokémons n\'a pas pu être récupérée. Réessayez dans quelques instants.';
            res.status(500).json({message, data: error})
        })
    }
    })
}