const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const trackerRoutes = require('./tracker');
const authRoutes = require('./auth');

router.use('/users', userRoutes);
router.use('/tracking', trackerRoutes);
router.use('/auth', authRoutes);
module.exports = router;