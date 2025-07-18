
A backend for a basic LMS where users can sign up, view courses, enroll, complete lessons, attempt quizzes, and track progress.

- Tech Stack
  - Node.js + Express + postgresql

steps : 1
  - npm install
  - in .env file ( enter DB_USER and Password) for which you have account 

 step : 2 
  - npm run dev

steps : 3 
 - below are endpoints 

API Endpoints
s
http://localhost:6000

Authorization
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login & get JWT

 **Courses**
- `POST /api/courses` – Create course (Admin only)
- `GET /api/courses` – View all courses (public)
- `GET /api/courses/:id` – View single course
- `POST /api/courses/:id/enroll` – Enroll in a course (**Logged-in**)

 **Lessons**
- `POST /api/courses/:id/lessons` – Add lesson (**Admin only**)
- `GET /api/courses/:id/lessons` – View lessons of a course (public)
- `POST /api/lessons/:id/complete` – Mark lesson completed (**Logged-in**)
- `GET /api/lessons/completed` – View completed lessons (**Logged-in**)

 **Quizzes**
- `POST /api/courses/:id/quizzes` – Create quiz (**Admin only**)
- `GET /api/courses/:id/quizzes` – View quizzes of a course (**Logged-in**)
- `POST /api/quizzes/:id/attempt` – Attempt a quiz (**Logged-in**)
- `GET /api/quizzes/:id/attempts` – View quiz attempts (**Logged-in**)

 **Progress**
- `GET /api/users/:id/progress` – View course progress (**Logged-in user**)

---

**Security**
- Passwords hashed with bcrypt
- JWT authentication for all protected routes
- Role-based access for admin routes

---

**Testing**
- Used Postman for testing:
  - Login → copy JWT token
  - Pass token in `Authorization: Bearer <token>` header for protected endpoints
  - Verified all flows: registration, login, course creation, enrollment, lessons, quizzes, and progress tracking.

---

 **Next Steps**
- Add pagination for courses & lessons
- Implement API rate-limiting
- Deploy to Heroku or any hosting service
