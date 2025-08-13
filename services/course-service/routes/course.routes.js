

const express = require('express');
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const ctrl = require('../controllers/course.controller');

const router = express.Router();

// Public - get all courses
router.get('/', ctrl.getAllCourses);

// Public - get course by ID
router.get('/:id', ctrl.getCourseById);

// Protected - Institute/Admin can create
router.post('/', auth, allowRoles(['admin', 'institute']), ctrl.createCourse);

// Protected - update
router.patch('/:id', auth, allowRoles(['admin', 'institute']), ctrl.updateCourse);

// Protected - delete
router.delete('//id', auth, allowRoles(['admin', 'institute']), ctrl.deleteCourse);

module.exports = router;

// const express = require('express');
// const auth = require('../middlewares/auth.middleware');
// const allowRoles = require('../middlewares/role.middleware');
// const ctrl = require('../controllers/course.controller');

// const router = express.Router();

// // public routes could be added here if needed (without auth)

// // All below require auth
// router.use(auth);

// // CRUD
// router.post('/courses', allowRoles(['admin', 'institute']), ctrl.createCourse);
// router.get('/courses', allowRoles(['admin', 'institute', 'faculty', 'student']), ctrl.listCourses);
// router.get('/courses/:id', allowRoles(['admin', 'institute', 'faculty', 'student']), ctrl.getCourse);
// router.patch('/courses/:id', allowRoles(['admin', 'institute']), ctrl.updateCourse);
// router.delete('/courses/:id', allowRoles(['admin', 'institute']), ctrl.deleteCourse);

// // Assign faculty
// router.post('/courses/:id/assign-faculty', allowRoles(['admin', 'institute']), ctrl.assignFaculty);

// // Faculty self-view
// router.get('/faculty/my-courses', allowRoles(['faculty']), ctrl.myFacultyCourses);

// module.exports = router;
