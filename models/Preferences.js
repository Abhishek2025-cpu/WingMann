const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    userDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
      unique: true,
    },
   
    age: {
      min: { type: Number, default: null},
      max: { type: Number, default: null },
    },
    height: {
      min: { type: Number, required: true, min: 30 },
      max: { type: Number, required: true, max: 300 },
    },
    religion: { type: String, required: true },
    ethnicity: { type: String, required: true },
    spokenLanguage: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "spokenLanguage must have at least 1 language",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Preference", preferenceSchema);
