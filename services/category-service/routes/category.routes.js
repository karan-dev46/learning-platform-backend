const express = require('express');
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const ctrl = require('../controllers/category.controller');

const router = express.Router();

// All endpoints require authentication
router.use(auth);

// Admin-only
router.post('/', allowRoles(['admin']), ctrl.createCategory);
router.patch('/:id', allowRoles(['admin']), ctrl.updateCategory);
router.delete('/:id', allowRoles(['admin']), ctrl.deleteCategory);

// All roles can view categories
router.get('/', allowRoles(['admin', 'institute', 'faculty', 'student']), ctrl.getCategories);
router.get('/:id', allowRoles(['admin', 'institute', 'faculty', 'student']), ctrl.getCategory);

module.exports = router;
