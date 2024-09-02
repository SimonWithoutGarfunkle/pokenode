const validTypes = ['Plante', 'Feu', 'Eau', 'Insecte', 'Normal', 'Electrik', 'Poison', 'Fée', 'Vol', 'Combat', 'Psy', 'Acier', 'Roche', 'Sol', 'Glace', 'Dragon', 'Spectre']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Le nom est déjà pris.' },
        validate: {
          len: { args: [1, 100], msg: 'Le nom du pokémon doit comporter entre 1 et 100 caractères.'},
          notNull: { msg: 'Le champ name est obligatoire.'}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: 'Utilisez uniquement des nombres entiers pour les hp.'},
          min: { args: [1], msg: 'Les hp doivent être positifs.'},
          max: { args: [999], msg: 'Les hp ne peuvent pas dépasser 999.'},
          notNull: { msg: 'Le champ hp est obligatoire.'}
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: 'Utilisez uniquement des nombres entiers pour les cp.'},
          notNull: { msg: 'Le champ cp est obligatoire.'}
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: { msg: 'Utilisez une URL valide pour l\'image.'},
          notNull: { msg: 'Le champ picture est obligatoire.'}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue('types').split(',')
        },
        set(types) {
          this.setDataValue('types', types.join())
        },
        validate: {
          isTypeValid(value) {
            if (!value) {
              throw new Error("Le pokémon doit avoir au moins un type.");
            }
            if (value.split(',').length > 3) {
              throw new Error("Un pokémon ne peut pas avoir plus de trois types.");
            }
            value.split(',').forEach(type => {
              if (!validTypes.includes(type)) {
                throw new Error(`Le type ${type} n'est pas autorisé. Les types valides sont ${validTypes.join(', ')}.`);
              }
            })
          },
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }