import express from "express";
import {
  checkUserTerm,
  getAllLotteryNumbersWithUsernames,
  getUserLotteryNumbers,
  loginUser,
  notifyAndRewardWinner,
  payment,
  registerUser,
  selectAndKeepLotteryWinner,
  selectLotteryWinner,
  updateUserTerm,
} from "../controller/user_Controller.js";
import auth_user from "../middleWare/auth_user.js";

const userRouter = express.Router();
/**
 * @swagger
 * /api/user/term:
 *   post:
 *     summary: Check user term status
 *     description: Verifies if the user has accepted the terms.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User term status retrieved successfully.
 */
userRouter.post("/term", auth_user, checkUserTerm);

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with provided details.
 *     responses:
 *       200:
 *         description: User registered successfully.
 */
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login user
 *     description: Logs in the user using phone number and password.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/user/check:
 *   get:
 *     summary: Check user term status
 *     description: Retrieves the term acceptance status for a user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User term status retrieved.
 */
userRouter.get("/check", auth_user, checkUserTerm);

/**
 * @swagger
 * /api/user/update-term:
 *   post:
 *     summary: Update user term status
 *     description: Updates the user's term acceptance status.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Terms updated successfully.
 */
userRouter.post("/update-term", auth_user, updateUserTerm);

/**
 * @swagger
 * /api/user/payment:
 *   post:
 *     summary: Process payment
 *     description: Handles user payments and generates a lottery number.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payment processed successfully.
 */
userRouter.post("/payment", auth_user, payment);

/**
 * @swagger
 * /api/user/select-winner:
 *   get:
 *     summary: Select lottery winner
 *     description: Randomly selects a lottery winner from eligible tickets.
 *     responses:
 *       200:
 *         description: Winner selected successfully.
 */
userRouter.get("/select-winner", selectLotteryWinner);

/**
 * @swagger
 * /api/user/lottery-numbers:
 *   get:
 *     summary: Get user's lottery numbers
 *     description: Fetches all lottery numbers associated with a user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's lottery numbers retrieved successfully.
 */
userRouter.get("/lottery-numbers", auth_user, getUserLotteryNumbers);

/**
 * @swagger
 * /api/user/all-lottery-numbers:
 *   get:
 *     summary: Get all lottery numbers
 *     description: Retrieves all lottery numbers along with associated usernames.
 *     responses:
 *       200:
 *         description: All lottery numbers retrieved successfully.
 */
userRouter.get("/all-lottery-numbers", getAllLotteryNumbersWithUsernames);

/**
 * @swagger
 * /api/user/choose-winner:
 *   get:
 *     summary: Choose and keep a lottery winner
 *     description: Randomly selects a winner and deletes all other tickets.
 *     responses:
 *       200:
 *         description: Winner chosen and other tickets deleted.
 */
userRouter.get("/choose-winner", selectAndKeepLotteryWinner);

/**
 * @swagger
 * /api/user/notify-winner:
 *   get:
 *     summary: Notify and reward the winner
 *     description: Notifies the winner and processes their reward.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Winner notified successfully.
 */
userRouter.get("/notify-winner", auth_user, notifyAndRewardWinner);

export default userRouter;
