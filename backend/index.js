require("dotenv").config();

const express = require("express");
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const path = require("path");
const fs = require("fs");
const upload = require("./multer");
const { error } = require("console");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

//create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists!" });
  }

  const hashedPassowrd = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hashedPassowrd,
  });

  await user.save();

  const accesToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accesToken,
    message: "Registration Successful",
  });
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordIsValid = await bcrypt.compare(password, user.password);
  if (!isPasswordIsValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.json({
    error: false,
    message: "Login Succesful",
    user: { fullName: user.fullName, email: user.email },
    accessToken,
  });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({
      user: isUser,
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Add travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // here we validate required fields
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  // converting visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    await travelStory.save();
    res.status(201).json({ story: travelStory, message: "Added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Failed to add travel story" });
  }
});

//Get all travel stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });

    // Send the fetched stories as a response
    res
      .status(200)
      .json({
        stories: travelStories,
        message: "Stories fetched successfully",
      });
  } catch (error) {
    res.status(500).json({ error: true, message: "Failed to fetch stories" });
  }
});

// POST route for handling image uploads
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Delete images from uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  }
  try {
    // ectract the filename from imageUrl
    const filename = path.basename(imageUrl);

    //define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    //check if file exists?
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found!" });
    }
  } catch (error) {
    res.status(500), json({ error: true, message: error.message });
  }
});

//Edit travel story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  // Convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));
  try {
    //find stories by ID
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found!" });
    }

    const placeholderImgUrl = `http://localhost:8000/assets/placeholder.png`;
    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful!" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//Delete a travel story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    //find stories by ID
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found!" });
    }
    //delete the travel story
    await travelStory.deleteOne({ _id: id, userId: userId });

    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    //define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("failed to delete image file:", err);
      }
    });

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//update isfavourite?
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: " Travel Story not found" });
    }

    travelStory.isfavourite = isFavourite;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//Search travel story
app.put("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    res.status(404).json({ error: true, message: "Query is Required" });
  }
  try {
    const searchresults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isfavourite: -1 });
    res.status(200).json({ stories: searchresults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//filter stories
app.put("/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    const start = new Date(parseInt(startDate));
    const end = new date(parseInt(endDate));

    const filterStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isfavourite: -1 });
    res.status(200).json({ stories: filterStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(8000);
module.exports = app;
