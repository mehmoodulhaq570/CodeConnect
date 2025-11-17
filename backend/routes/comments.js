const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

// Routes
router.put('/:id', auth, updateCommentValidation, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
