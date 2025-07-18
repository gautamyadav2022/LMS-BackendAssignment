module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
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
    tableName: 'enrollments',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'course_id']
      }
    ]
  });

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Enrollment.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course'
    });
  };

  return Enrollment;
};