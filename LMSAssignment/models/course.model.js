module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    instructor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'courses'
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Course.hasMany(models.Lesson, {
      foreignKey: 'course_id',
      as: 'lessons'
    });
    Course.hasMany(models.Quiz, {
      foreignKey: 'course_id',
      as: 'quizzes'
    });
    Course.belongsToMany(models.User, {
      through: models.Enrollment,
      foreignKey: 'course_id',
      otherKey: 'user_id',
      as: 'enrolledUsers'
    });
    Course.hasMany(models.Progress, {
      foreignKey: 'course_id',
      as: 'progresses'
    });
  };

  return Course;
};