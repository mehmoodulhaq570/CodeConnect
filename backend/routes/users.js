const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  searchUsers
} = require('../controllers/userController');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('socialLinks.github')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be valid'),
  body('socialLinks.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
  body('socialLinks.twitter')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be valid'),
  body('socialLinks.website')
    .optional()
    .isURL()
    .withMessage('Website URL must be valid')
];

// Routes
router.get('/profile/:id', getUserProfile);
router.put('/profile', auth, updateProfileValidation, updateProfile);
router.post('/follow/:id', auth, followUser);
router.delete('/unfollow/:id', auth, unfollowUser);
router.get('/search', searchUsers);

module.exports = router;
