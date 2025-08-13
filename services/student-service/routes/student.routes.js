const express = require('express');
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const ctrl = require('../controllers/student.controller');

const router = express.Router();

router.use(auth);

// View all courses
router.get('/courses', allowRoles(['student']), ctrl.getAllCourses);

// Enroll in a course
router.post('/enroll', allowRoles(['student']), ctrl.enrollCourse);

// View my enrollments
router.get('/my-enrollments', allowRoles(['student']), ctrl.getMyEnrollments);

// Mark course completed
router.patch('/complete/:id', allowRoles(['student']), ctrl.completeCourse);

module.exports = router;
