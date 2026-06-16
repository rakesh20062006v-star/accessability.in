const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default:"N/A",
    },

    email: {
      type: String,
   
      trim: true,
      lowercase: true,
      default:"N/A",
    },

    subject: {
      type: String,
     
      trim: true,
      default:"N/A",
    },

    message: {
      type: String,
     
      trim: true,
      default:"N/A",
    },

    status: {
      type: String,
      enum: ["Unread", "Read", "Resolved"],
      default: "Unread",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Contact",
  contactSchema
);