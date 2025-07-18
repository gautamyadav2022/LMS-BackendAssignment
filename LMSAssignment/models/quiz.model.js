module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passing_score: {
      type: DataTypes.INTEGER,
      defaultValue: 70,
      validate: {
        min: 0,
        max: 100
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'quizzes'
  });

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course'
    });
    Quiz.hasMany(models.Question, {
      foreignKey: 'quiz_id',
      as: 'questions'
    });
  };

  return Quiz;
};