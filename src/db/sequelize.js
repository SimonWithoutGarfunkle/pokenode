const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const pokemons = require('./mock-pokemon')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
  
const sequelize = new Sequelize('pokedex', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})
  
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
  
const initDb = () => {
  return sequelize.sync({force: true}).then(async _ => {
    await Promise.all(pokemons.map(pokemon => {
      pokemon => console.log(pokemon.toJSON())
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types
      })
    }))

    const hash = await bcrypt.hash('admin', 10)
    const user = await User.create({
      username: 'admin',
      password: hash
    })
    console.log(user.toJSON())
    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { 
  initDb, Pokemon, User
}