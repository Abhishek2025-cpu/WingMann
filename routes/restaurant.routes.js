const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/add', protect, authorize('admin'), upload.single('venuePhoto'), restaurantController.addRestaurant);
router.get('/all', protect, authorize('admin'), restaurantController.getAllRestaurants);
router.patch('/update/:id', protect, authorize('admin'), upload.single('venuePhoto'),
restaurantController.updateRestaurant);
router.delete('/delete/:id', protect, authorize('admin'), restaurantController.deleteRestaurant);
module.exports = router;