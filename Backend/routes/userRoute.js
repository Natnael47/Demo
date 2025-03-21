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
 * /api/user/potato/{id}:
 *   get:
 *     summary: Get a resource
 *     description: Get a specific resource by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the resource to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 */

userRouter.get("/potato/:id", (req, res) => {
  res.send(`Getting resource with ID: ${req.params.id}`);
});

userRouter.post("/term", auth_user, checkUserTerm);

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/check", auth_user, checkUserTerm);
userRouter.post("/update-term", auth_user, updateUserTerm);

userRouter.post("/payment", auth_user, payment);
userRouter.get("/select-winner", selectLotteryWinner);

userRouter.get("/lottery-numbers", auth_user, getUserLotteryNumbers);
userRouter.get("/all-lottery-numbers", getAllLotteryNumbersWithUsernames);
userRouter.get("/choose-winner", selectAndKeepLotteryWinner);

userRouter.get("/notify-winner", auth_user, notifyAndRewardWinner);

export default userRouter;
