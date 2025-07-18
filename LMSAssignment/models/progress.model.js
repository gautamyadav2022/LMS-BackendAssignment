module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
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
    },
    completed_lessons: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: []
    },
    quiz_attempts: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'progresses',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'course_id']
      }
    ]
  });

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Progress.belongsTo(models.Course, {
      foreignKey: 'course_id',
      as: 'course'
    });
  };

  return Progress;
};