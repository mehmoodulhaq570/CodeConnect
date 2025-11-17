const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts
} = require('../controllers/postController');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

// Validation rules
const createPostValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters'),
  body('codeSnippet.code')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Code snippet must be less than 10000 characters'),
  body('codeSnippet.language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'typescript', 'html', 'css', 'sql', 'json', 'xml', 'yaml', 'markdown', 'bash', 'powershell', 'other'])
    .withMessage('Invalid programming language'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be less than 30 characters')
];

const updatePostValidation = [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters'),
  body('codeSnippet.code')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Code snippet must be less than 10000 characters'),
  body('codeSnippet.language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'php', 'ruby', 'go', 'rust', 'typescript', 'html', 'css', 'sql', 'json', 'xml', 'yaml', 'markdown', 'bash', 'powershell', 'other'])
    .withMessage('Invalid programming language'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag must be less than 30 characters')
];

const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  body('parentComment')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent comment ID')
];

const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

// Routes
router.get('/', auth, getPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPost);
router.post('/', auth, createPostValidation, createPost);
router.put('/:id', auth, updatePostValidation, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.delete('/:id/unlike', auth, unlikePost);

// Comment routes
router.get('/:postId/comments', getComments);
router.post('/:postId/comments', auth, createCommentValidation, createComment);

module.exports = router;
