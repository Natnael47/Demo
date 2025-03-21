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
  updateUserTerm,
} from "../controller/user_Controller.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided details. This endpoint validates user input, checks for duplicate email or phone number, hashes the password, and generates an authentication token upon successful registration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_Name
 *               - user_Email
 *               - user_Phone
 *               - user_Password
 *             properties:
 *               user_Name:
 *                 type: string
 *                 description: Full name of the user.
 *               user_Phone:
 *                 type: string
 *                 description: Unique phone number of the user.
 *               user_Password:
 *                 type: string
 *                 format: password
 *                 description: Password must be at least 8 characters long.
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid fields.
 *       409:
 *         description: Email or phone number already in use.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in the user using their phone number and password. If authentication is successful, a JWT token is returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_Phone
 *               - user_Password
 *             properties:
 *               user_Phone:
 *                 type: string
 *                 description: Registered phone number of the user.
 *               user_Password:
 *                 type: string
 *                 format: password
 *                 description: Password associated with the account.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized, incorrect credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/user/check-User-Term:
 *   get:
 *     summary: Check if user agreed to terms
 *     description: Checks whether the user has agreed to the terms and conditions required to participate in the lottery game.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token to authorize and decode the user ID.
 *     responses:
 *       200:
 *         description: User term acceptance status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 userTermStatus:
 *                   type: boolean
 *                 Id:
 *                   type: string
 *       401:
 *         description: Token not provided or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/check-User-Term", checkUserTerm);

/**
 * @swagger
 * /api/user/update-term:
 *   put:
 *     summary: Update user term status
 *     description: Updates the user's acceptance of terms and conditions. Since this is a new system, all users are assumed to have not agreed initially.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token to authorize and decode the user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_Term:
 *                 type: boolean
 *                 description: The new acceptance status (true = agreed, false = not agreed).
 *     responses:
 *       200:
 *         description: Terms updated successfully.
 *       400:
 *         description: Invalid request body (e.g., user_Term is not a boolean).
 *       401:
 *         description: Token not provided or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
userRouter.put("/update-term", updateUserTerm);

/**
 * @swagger
 * /api/user/payment:
 *   post:
 *     summary: Process lottery payment and generate a ticket
 *     description: >
 *       - Confirms the payment transaction.
 *       - Deducts 1 additional birr for the lottery ticket.
 *       - Generates a lottery number for the user who agreed to participate.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token to authorize and decode the user ID.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Payment processed and lottery number generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment successful. Lottery number generated."
 *                 lottery_number:
 *                   type: string
 *                   example: "123456789012"
 *       401:
 *         description: Token not provided or invalid.
 *       400:
 *         description: Invalid request or payment failure.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/payment", payment);

/**
 * @swagger
 * /api/user/choose-winner:
 *   post:
 *     summary: Select a lottery winner and remove other tickets
 *     description: >
 *       - Randomly selects a single winner from the lottery entries.
 *       - Deletes all other lottery numbers from the database.
 *       - Returns the winner's details including name, phone, and lottery number.
 *     responses:
 *       200:
 *         description: Winner selected successfully, and other tickets cleared.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Winner selected successfully and other lottery numbers cleared."
 *                 winnerDetails:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     phone:
 *                       type: string
 *                       example: "+251912345678"
 *                     lotteryNumber:
 *                       type: string
 *                       example: "987654321012"
 *       404:
 *         description: No eligible lottery tickets found.
 *       500:
 *         description: Internal server error.
 */
userRouter.post("/choose-winner", selectAndKeepLotteryWinner);

/**
 * @swagger
 * /api/user/lottery-numbers:
 *   get:
 *     summary: Retrieve user's lottery numbers
 *     description: Fetches all lottery numbers associated with the authenticated user using the token in the headers.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token to authenticate and identify the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user's lottery numbers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lottery numbers fetched successfully."
 *                 lotteryNumbers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lotteryNumber:
 *                         type: string
 *                         example: "123456789012"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-21T12:00:00Z"
 *       400:
 *         description: Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/lottery-numbers", getUserLotteryNumbers);

/**
 * @swagger
 * /api/user/notify-winner:
 *   get:
 *     summary: Notify and reward the lottery winner
 *     description: Notifies the winner and processes their reward if they hold the winning lottery number, using the token in the headers for identification.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token to authenticate and identify the user.
 *     responses:
 *       200:
 *         description: Winner notified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Congratulations! You are the winner."
 *                 winnerDetails:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "605c72b9f1d2c70015f87b4f"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     phone:
 *                       type: string
 *                       example: "+251912345678"
 *                     lotteryNumber:
 *                       type: string
 *                       example: "123456789012"
 *                     rewardAmount:
 *                       type: integer
 *                       example: 100000
 *       400:
 *         description: Token is missing or invalid.
 *       404:
 *         description: User does not exist or did not win the lottery.
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/notify-winner", notifyAndRewardWinner);

/**
 * @swagger
 * /api/user/all-lottery-numbers:
 *   get:
 *     summary: Retrieve all lottery numbers (Admin Only)
 *     description: Fetches all lottery numbers along with the associated usernames.
 *       This endpoint is accessible only by a super admin. The admin **cannot** modify or change any data.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all lottery numbers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lottery numbers fetched successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lotteryNumber:
 *                         type: string
 *                         example: "987654321012"
 *                       userName:
 *                         type: string
 *                         example: "John Doe"
 *                       userPhone:
 *                         type: string
 *                         example: "+251912345678"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-21T12:00:00Z"
 *       500:
 *         description: Internal server error.
 */
userRouter.get("/all-lottery-numbers", getAllLotteryNumbersWithUsernames);

export default userRouter;
