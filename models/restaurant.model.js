const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    venuePhotos: {
      type: [String], // ✅ multiple images
      required: true,
      default: [],
    },

    venueType: { type: String, enum: ["Restaurant", "Cafe"], required: true },
    businessName: { type: String, required: true },

    email: {
      type: String,
      required: [true, "Required email for all the restaurant"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    streetAddress: { type: String, required: true },
    cityState: { type: String, required: true },
    pincode: { type: String, required: true },
    googleMapsLink: { type: String },

  typeOfFood: {
  type: [String], // ✅ multiple food types
  required: true,
  default: [],
},
    budgetPerPerson: { type: Number, required: true },

    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
