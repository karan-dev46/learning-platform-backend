// const Course = require('../models/course.model');
const mongoose = require('mongoose');

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all courses
exports.getAllCourses = async (_req, res) => {
  try {
    const courses = await Course.find()
    //.populate('categoryId', 'name')
    //.populate('instituteId', 'name');
    res.json({ count: courses.length, courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid Course ID' });

    const course = await Course.findById(id)
      // .populate('categoryId', 'name')
      // .populate('instituteId', 'name')
      // .populate('facultyIds', 'name');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create course (Institute/Admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, categoryId, facultyIds, duration, price } = req.body;
    if (!isObjectId(categoryId)) return res.status(400).json({ message: 'Invalid Category ID' });

    const course = await Course.create({
      title,
      description,
      categoryId,
      instituteId: req.user.id,
      facultyIds: facultyIds || [],
      duration,
      price
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid Course ID' });

    const course = await Course.findOneAndUpdate(
      { _id: id, instituteId: req.user.id },
      req.body,
      { new: true }
    );

    if (!course) return res.status(404).json({ message: 'Course not found or not authorized' });

    res.json({ message: 'Course updated', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid Course ID' });

    const course = await Course.findOneAndDelete({ _id: id, instituteId: req.user.id });

    if (!course) return res.status(404).json({ message: 'Course not found or not authorized' });

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Course = require('../models/course.model');
// const mongoose = require('mongoose');

// // helpers
// const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// const isAdmin = (req) => req.user?.role === 'admin';
// const isInstitute = (req) => req.user?.role === 'institute';

// /**
//  * POST /api/courses
//  * Roles: admin, institute
//  */
// exports.createCourse = async (req, res) => {
//   try {
//     const { title, description = '', categoryId, isPublished = false } = req.body;

//     if (!title || !categoryId) {
//       return res.status(400).json({ message: 'title and categoryId are required' });
//     }
//     if (!isObjectId(categoryId)) {
//       return res.status(400).json({ message: 'Invalid categoryId' });
//     }

//     const doc = await Course.create({
//       title,
//       description,
//       categoryId,
//       isPublished,
//       createdBy: req.user.id,
//     });

//     res.status(201).json({ message: 'Course created', course: doc });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// /**
//  * GET /api/courses
//  * Roles: admin, institute, faculty, student
//  * Query: ?published=true|false (optional)
//  */
// exports.listCourses = async (req, res) => {
//   try {
//     const { published } = req.query;
//     const filter = {};
//     if (published === 'true') filter.isPublished = true;
//     if (published === 'false') filter.isPublished = false;

//     // Students/faculty can view all; if you want stricter, filter by isPublished for students
//     if (req.user.role === 'student') {
//       filter.isPublished = true;
//     }

//     const items = await Course.find(filter).sort({ createdAt: -1 });
//     res.json({ count: items.length, courses: items });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// /**
//  * GET /api/courses/:id
//  * Roles: all authenticated
//  */
// exports.getCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const doc = await Course.findById(id);
//     if (!doc) return res.status(404).json({ message: 'Course not found' });

//     // students can only see published
//     if (req.user.role === 'student' && !doc.isPublished) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     res.json({ course: doc });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// /**
//  * PATCH /api/courses/:id
//  * Roles: admin, institute
//  * - admin can update any course
//  * - institute can update only its own course
//  */
// exports.updateCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const updates = {};
//     ['title', 'description', 'isPublished', 'categoryId'].forEach((k) => {
//       if (req.body[k] !== undefined) updates[k] = req.body[k];
//     });
//     if (updates.categoryId && !isObjectId(updates.categoryId)) {
//       return res.status(400).json({ message: 'Invalid categoryId' });
//     }

//     const existing = await Course.findById(id);
//     if (!existing) return res.status(404).json({ message: 'Course not found' });

//     if (!isAdmin(req) && !(isInstitute(req) && String(existing.createdBy) === req.user.id)) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     Object.assign(existing, updates);
//     await existing.save();
//     res.json({ message: 'Course updated', course: existing });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// /**
//  * DELETE /api/courses/:id
//  * Roles: admin, institute (owner only)
//  */
// exports.deleteCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

//     const existing = await Course.findById(id);
//     if (!existing) return res.status(404).json({ message: 'Course not found' });

//     if (!isAdmin(req) && !(isInstitute(req) && String(existing.createdBy) === req.user.id)) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     await existing.deleteOne();
//     res.json({ message: 'Course deleted' });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// /**
//  * POST /api/courses/:id/assign-faculty
//  * Body: { facultyId }
//  * Roles: admin, institute (owner only)
//  */
// exports.assignFaculty = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { facultyId } = req.body;

//     if (!isObjectId(id) || !isObjectId(facultyId)) {
//       return res.status(400).json({ message: 'Invalid id(s)' });
//     }

//     const course = await Course.findById(id);
//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     if (!isAdmin(req) && !(isInstitute(req) && String(course.createdBy) === req.user.id)) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     course.facultyId = facultyId;
//     await course.save();
//     res.json({ message: 'Faculty assigned', course });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// /**
//  * GET /api/faculty/my-courses
//  * Roles: faculty
//  */
// exports.myFacultyCourses = async (req, res) => {
//   try {
//     const items = await Course.find({ facultyId: req.user.id }).sort({ createdAt: -1 });
//     res.json({ count: items.length, courses: items });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };
