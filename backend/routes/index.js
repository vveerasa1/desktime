const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const trackerRoutes = require('./tracker');

router.use('/users', userRoutes);
router.use('/tracking', trackerRoutes);
module.exports = router;