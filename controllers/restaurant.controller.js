const Restaurant = require('../models/restaurant.model');
const fs = require('fs');

// Add new restorent 
exports.addRestaurant = async (req, res) => {
    try {
        const { 
            venueType, businessName, email, streetAddress, cityState, 
            pincode, googleMapsLink, typeOfFood, budgetPerPerson 
        } = req.body;

        // 1. Photo Check
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Venue photo is required!" });
        }

        // 2. Email Presence & Validation
        if (!email) {
            return res.status(400).json({ success: false, message: "Email field is required in form-data!" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid restaurant email format!" });
        }

        // 3. Create Restaurant
        const newRestaurant = await Restaurant.create({
            venuePhoto: req.file.path,
            venueType,
            businessName,
            email, 
            streetAddress,
            cityState,
            pincode,
            googleMapsLink,
            typeOfFood,
            budgetPerPerson,
            addedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Restaurant added successfully!",
            data: newRestaurant
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "This email is already registered to another restaurant!" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all restorent
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error to fatch restaurent", 
            error: error.message 
        });
    }
};

// Update restaurent detials
exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (req.file) {
            updateData.venuePhoto = req.file.path;
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ 
                success: false, 
                message: "Not found restaurant!" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Restaurant details successfully updated!",
            data: updatedRestaurant
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "failed updating", 
            error: error.message 
        });
    }
};

// Delete restaurent 
exports.deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Pehle check karo ki restaurant exist karta hai ya nahi
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found!" });
        }

        if (restaurant.venuePhoto) {
            fs.unlink(restaurant.venuePhoto, (err) => {
                if (err) console.log("Photo delete karne mein error:", err);
                else console.log("Purani photo server se delete kar di gayi.");
            });
        }

        await Restaurant.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Restaurant delete successfully."
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "error Delete ", 
            error: error.message 
        });
    }
};