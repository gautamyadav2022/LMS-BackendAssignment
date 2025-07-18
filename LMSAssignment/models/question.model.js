module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidOptions(value) {
          if (!Array.isArray(value) || value.length < 2) {
            throw new Error('At least two options are required');
          }
          const hasCorrect = value.some(opt => opt.isCorrect);
          if (!hasCorrect) {
            throw new Error('At least one correct option is required');
          }
        }
      }
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'quizzes',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'questions'
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Quiz, {
      foreignKey: 'quiz_id',
      as: 'quiz'
    });
  };

  return Question;
};