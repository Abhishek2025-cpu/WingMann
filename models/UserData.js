// const mongoose = require("mongoose");

// const userDataSchema = new mongoose.Schema(
//   {
//     gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
//     name: { type: String, trim: true, default: "" },
//     dob: { type: String, default: null },
//     height: { type: Number, default: null },

//     location: {
//       address: { type: String, default: "" },
//       coordinates: {
//         lat: { type: Number, default: null },
//         lng: { type: Number, default: null },
//       },
//     },

//     state: { type: String, default: "" },
//     story: { type: String, default: "" },
//     type: { type: String, default: "" },

//     college: { type: String, default: "" },
//     course: { type: String, default: "" },

//     company: { type: String, default: "" },
//     position: { type: String, default: "" },

//     education: { type: String, default: "" },
//     religion: { type: String, default: "" },
//     habits: { type: String, default: "" },

//     interests: { type: [String], default: [] },

//     lifestyle: {
//       drink: { type: String, default: "" },
//       smoke: { type: String, default: "" },
//       exercise: { type: String, default: "" },
//     },

//     // images (max 6)
//     images: {
//       type: Array,
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("UserData", userDataSchema);
const mongoose = require("mongoose");
const userDataSchema = new mongoose.Schema(
  {
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    name: { type: String, trim: true, default: "" },
    dob: { type: String, default: null },
    height: { type: Number, default: null },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String, 
      required: true,
      unique: true,
      lowercase: true
    },

    age: {
      type: Number
    },
    location: {
      address: { type: String, default: "" },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },

    state: { type: String, default: "" },
    story: { type: String, default: "" },
    type: { type: String, default: "" },

    college: { type: String, default: "" },
    course: { type: String, default: "" },

    company: { type: String, default: "" },
    position: { type: String, default: "" },

    education: { type: String, default: "" },
    religion: { type: String, default: "" },
    habits: { type: String, default: "" },

    interests: { type: [String], default: [] },

    lifestyle: {
      drink: { type: String, default: "" },
      smoke: { type: String, default: "" },
      exercise: { type: String, default: "" },
    },

    // images (max 6)
    // images: {
    //   type: Array,
    //   default: [],
    // },
  },
  { timestamps: true }
);

 module.exports = mongoose.model("UserData", userDataSchema);