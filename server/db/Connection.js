const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async () => {
  try {
    const connections = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connections) {
      console.log(`Database connected to ${connections.connection.host}`);
    } else {
      console.log(`Database is not connected`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
