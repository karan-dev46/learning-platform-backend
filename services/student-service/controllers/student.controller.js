const Enrollment = require('../models/enrollment.model');
const axios = require('axios');
const mongoose = require('mongoose');

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Fetch all courses (from course-service)
exports.getAllCourses = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.COURSE_SERVICE_URL}/api/courses`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!isObjectId(courseId)) return res.status(400).json({ message: 'Invalid Course ID' });

    const already = await Enrollment.findOne({ studentId: req.user.id, courseId });
    if (already) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
      status: 'enrolled'
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get student's enrollments
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user.id }).populate('courseId');
    res.json({ count: enrollments.length, enrollments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark course as completed
exports.completeCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: 'Invalid Enrollment ID' });

    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: id, studentId: req.user.id },
      { status: 'completed' },
      { new: true }
    );

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    res.json({ message: 'Course marked as completed', enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
