const { Progress, Lesson, Quiz, Course } = require('../models');
const ErrorHandler = require('../middleware/error').ErrorHandler;

exports.completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    
    const progress = await Progress.findOne({ 
      where: { user_id: req.user.id, course_id: courseId } 
    });
    
    if (!progress) return next(new ErrorHandler('Progress not found', 404));
    
    if (progress.completed_lessons.includes(lessonId)) {
      return next(new ErrorHandler('Lesson already marked as completed', 400));
    }
    
    progress.completed_lessons = [...progress.completed_lessons, lessonId];
    await progress.save();
    
    res.status(200).json({ status: 'success', data: { progress } });
  } catch (err) {
    next(err);
  }
};

exports.attemptQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Question, as: 'questions' }]
    });
    
    if (!quiz) return next(new ErrorHandler('Quiz not found', 404));
    
    const detailedAnswers = quiz.questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      const isCorrect = userAnswer ? 
        question.options[userAnswer.selectedOption].isCorrect : false;
      return { 
        questionId: question.id, 
        selectedOption: userAnswer?.selectedOption, 
        isCorrect 
      };
    });
    
    const correctCount = detailedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    const progress = await Progress.findOne({ 
      where: { user_id: req.user.id, course_id: quiz.course_id } 
    });
    
    if (!progress) return next(new ErrorHandler('Progress not found', 404));
    
    progress.quiz_attempts = [
      ...progress.quiz_attempts,
      { quizId, score, answers: detailedAnswers, attemptedAt: new Date() }
    ];
    
    await progress.save();
    
    res.status(200).json({ 
      status: 'success', 
      data: { 
        score, 
        passed: score >= quiz.passing_score,
        progress 
      } 
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      where: { user_id: req.user.id, course_id: req.params.courseId },
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'user' }
      ]
    });
    
    if (!progress) return next(new ErrorHandler('Progress not found', 404));
    
    const totalLessons = await Lesson.count({ where: { course_id: req.params.courseId } });
    const completedPercentage = totalLessons > 0 
      ? Math.round((progress.completed_lessons.length / totalLessons) * 100)
      : 0;
    
    res.status(200).json({ 
      status: 'success', 
      data: { 
        progress, 
        completedPercentage,
        totalLessons,
        completedLessons: progress.completed_lessons.length 
      } 
    });
  } catch (err) {
    next(err);
  }
};