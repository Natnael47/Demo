import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import validator from "validator";
import LotteryModel from "../models/lotteryNumbermodel.js";
import usermodel from "../models/usermodel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Login User using phone number and password
const loginUser = async (req, res) => {
  const { user_Phone, user_Password } = req.body; // Using phone number and password for login
  try {
    // Check if user exists
    const user = await usermodel.findOne({ user_Phone });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(user_Password, user.user_Password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error occurred" });
  }
};

// Helper function to create a token
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // Token valid for 1 day
};

// Utility function to decode token and return user ID
const getUserIdFromToken = (token) => {
  try {
    // Decode the token using the JWT secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.id; // Return the user ID from the decoded token
  } catch (error) {
    throw new Error("Invalid or expired token."); // Throw error for invalid tokens
  }
};

// Fetch User Term Status (True or False)
const checkUserTerm = async (req, res) => {
  try {
    // Get token from headers
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Token not provided. Authorization required.",
      });
    }

    let userId;
    try {
      // Use the reusable function to get the user ID
      userId = getUserIdFromToken(token);
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }

    const user = await usermodel.findById(userId); // Find user by ID in the database

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    // Return the user's term acceptance status
    const userTermStatus = user.user_Term;
    return res.json({ success: true, userTermStatus, Id: userId });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Error fetching user term status.",
    });
  }
};

// Update User Term Status
const updateUserTerm = async (req, res) => {
  const { user_Term } = req.body;
  try {
    // Get token from headers
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Token not provided. Authorization required.",
      });
    }

    let userId;
    try {
      // Use the reusable function to get the user ID
      userId = getUserIdFromToken(token);
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
    // Validate the user_Term field
    if (typeof user_Term !== "boolean") {
      return res.json({
        success: false,
        message: "user_Term should be a boolean value",
      });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update the user's term acceptance status
    user.user_Term = user_Term ? "true" : "false"; // Save as 'true' or 'false'
    await user.save();

    res.json({ success: true, message: "Terms updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating terms" });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { user_Name, user_Email, user_Phone, user_Password } = req.body; // Ensure proper destructuring
  try {
    // Check for missing fields
    if (!user_Name || !user_Email || !user_Phone || !user_Password) {
      return res.json({
        success: false,
        message: "All fields (name, email, phone, password) are required",
      });
    }

    // Check if user already exists
    const emailExists = await usermodel.findOne({ user_Email });
    const phoneExists = await usermodel.findOne({ user_Phone });
    if (emailExists || phoneExists) {
      return res.json({
        success: false,
        message: "Email or phone already in use",
      });
    }

    // Validate email and password
    if (!validator.isEmail(user_Email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (user_Password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_Password, salt);

    // Create user
    const newUser = new usermodel({
      user_Name,
      user_Email,
      user_Phone,
      user_Password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

const payment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // Get token from headers
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Token not provided. Authorization required.",
      });
    }

    let userId;
    try {
      // Use the reusable function to get the user ID
      userId = getUserIdFromToken(token);
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
    // Adjust the amount to meet Stripe's minimum (e.g., 300 ETB)
    const amountInETB = 300; // Adjust as needed
    const amountInCents = amountInETB * 100; // Convert ETB to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "ETB",
      description: "Lottery ticket payment with subscription fee",
    });

    const generateLotteryNumber = () => {
      return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    };

    const lotteryNumber = generateLotteryNumber();

    const lotteryEntry = new LotteryModel({
      lottery_number: lotteryNumber,
      user_id: userId,
    });
    await lotteryEntry.save();

    // Log the lottery number if success is true
    console.log("Lottery Number:", lotteryNumber);

    res.json({
      success: true,
      message: "Payment successful. Lottery number generated.",
      lottery_number: lotteryNumber,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, message: "Payment failed." });
  }
};

export const selectLotteryWinner = async (req, res) => {
  try {
    // Find all lottery numbers where is_winner is false
    const eligibleTickets = await LotteryModel.find({ is_winner: false });

    if (eligibleTickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No eligible lottery tickets found.",
      });
    }

    // Randomly select one ticket from the eligible ones
    const randomIndex = Math.floor(Math.random() * eligibleTickets.length);
    const selectedTicket = eligibleTickets[randomIndex];

    // Retrieve the user details for the selected ticket
    const user = await usermodel.findById(selectedTicket.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User associated with the lottery ticket not found.",
      });
    }

    // Update the is_winner field to true for the selected ticket
    selectedTicket.is_winner = true;
    await selectedTicket.save();

    // Send the user's name, phone, and the winning lottery number to the frontend
    res.json({
      success: true,
      message: "Winner selected successfully!",
      winnerDetails: {
        name: user.user_Name,
        phone: user.user_Phone,
        lotteryNumber: selectedTicket.lottery_number,
      },
    });
  } catch (error) {
    console.error("Error selecting lottery winner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to select a lottery winner.",
    });
  }
};

// Collect Lottery Numbers by User ID
const getUserLotteryNumbers = async (req, res) => {
  try {
    // Get token from headers
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Token not provided. Authorization required.",
      });
    }

    let userId;
    try {
      // Use the reusable function to get the user ID
      userId = getUserIdFromToken(token);
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
    // Validate if userId is provided
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Find lottery numbers associated with the user ID
    const lotteryNumbers = await LotteryModel.find({ user_id: userId });

    if (lotteryNumbers.length === 0) {
      return res.json({
        success: false,
        message: "No lottery numbers found for the given user ID",
      });
    }

    // Extract and return lottery numbers along with their creation dates
    const numbers = lotteryNumbers.map((entry) => ({
      lotteryNumber: entry.lottery_number,
      createdAt: entry.createdAt,
    }));

    res.json({
      success: true,
      message: "Lottery numbers fetched successfully",
      lotteryNumbers: numbers,
    });
  } catch (error) {
    console.error("Error fetching lottery numbers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lottery numbers",
    });
  }
};

// Fetch all lottery numbers with associated user names, ordered by creation date
const getAllLotteryNumbersWithUsernames = async (req, res) => {
  try {
    // Use aggregation to join the LotteryModel and usermodel
    const lotteryNumbers = await LotteryModel.aggregate([
      {
        $lookup: {
          from: "user_datas", // Collection name in the database for the User model
          localField: "user_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Flatten the userDetails array
      },
      {
        $project: {
          lottery_number: 1,
          createdAt: 1,
          "userDetails.user_Name": 1, // Include only the user's name
        },
      },
      {
        $sort: { createdAt: 1 }, // Sort by creation date in ascending order
      },
    ]);

    if (lotteryNumbers.length === 0) {
      return res.json({
        success: false,
        message: "No lottery numbers found.",
      });
    }

    // Format the response
    const result = lotteryNumbers.map((entry) => ({
      lotteryNumber: entry.lottery_number,
      userName: entry.userDetails.user_Name,
      userPhone: entry.userDetails.user_Phone,
      createdAt: entry.createdAt,
    }));

    res.json({
      success: true,
      message: "Lottery numbers fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching lottery numbers with usernames:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lottery numbers with usernames.",
    });
  }
};

// Function to randomly select a lottery winner and delete all but the selected one
export const selectAndKeepLotteryWinner = async (req, res) => {
  try {
    // Find all lottery numbers where is_winner is false
    const eligibleTickets = await LotteryModel.find({ is_winner: false });

    if (eligibleTickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No eligible lottery tickets found.",
      });
    }

    // Randomly select one ticket from the eligible ones
    const randomIndex = Math.floor(Math.random() * eligibleTickets.length);
    const selectedTicket = eligibleTickets[randomIndex];

    // Retrieve the user details for the selected ticket
    const user = await usermodel.findById(selectedTicket.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User associated with the lottery ticket not found.",
      });
    }

    // Set the is_winner field to false for the selected ticket (just in case it's not set yet)
    selectedTicket.is_winner = true;
    await selectedTicket.save();

    // Send the user's name, phone, and the winning lottery number to the frontend
    const winnerDetails = {
      name: user.user_Name,
      phone: user.user_Phone,
      lotteryNumber: selectedTicket.lottery_number,
    };

    // Delete all other lottery tickets except the selected one
    await LotteryModel.deleteMany({
      _id: { $ne: selectedTicket._id }, // Exclude the selected ticket
    });

    res.json({
      success: true,
      message:
        "Winner selected successfully and other lottery numbers cleared.",
      winnerDetails,
    });
  } catch (error) {
    console.error("Error selecting and keeping lottery winner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to select and keep a lottery winner.",
    });
  }
};

// Function to notify and reward the lottery winner
export const notifyAndRewardWinner = async (req, res) => {
  try {
    // Get token from headers
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Token not provided. Authorization required.",
      });
    }

    let userId;
    try {
      // Use the reusable function to get the user ID
      userId = getUserIdFromToken(token);
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Retrieve user details
    const user = await usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find if this user has a winning lottery ticket
    const winningTicket = await LotteryModel.findOne({
      user_id: userId,
      is_winner: true,
    });

    if (!winningTicket) {
      console.log(`User ${user.user_Name} checked, but did not win.`);
      return res.json({
        success: false,
        message:
          "Unfortunately, you did not win this time. Better luck next time!",
        isWinner: false,
      });
    }

    await user.save();

    // Notify user about the win
    const notificationMessage = `🎉 Congratulations ${user.user_Name}! 🎉 You have won the lottery! Your winning number: ${winningTicket.lottery_number}. A reward of 100,000 has been credited to your account.`;

    // Simulate sending a notification (Replace with actual SMS/email service if needed)
    console.log(
      `Sending notification to ${user.user_Phone}: ${notificationMessage}`
    );

    // Delete the winning lottery entry after notifying the user
    await LotteryModel.deleteOne({ _id: winningTicket._id });

    res.json({
      success: true,
      message: "Congratulations! You are a winner!",
      isWinner: true,
      winnerDetails: {
        userId: user._id,
        name: user.user_Name,
        phone: user.user_Phone,
        lotteryNumber: winningTicket.lottery_number,
        rewardAmount: 100000,
      },
    });
  } catch (error) {
    console.error("Error checking winner status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while checking the lottery results.",
    });
  }
};

export {
  checkUserTerm,
  getAllLotteryNumbersWithUsernames,
  getUserLotteryNumbers,
  loginUser,
  payment,
  registerUser,
  updateUserTerm,
};
