const express = require("express");
const app = express();
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  const { userId, planType } = req.body;
  const result = await subscribeUser(userId, planType);
  res.json(result);
});

app.post("/unsubscribe", async (req, res) => {
  const { userId } = req.body;
  const result = await unsubscribeUser(userId);
  res.json(result);
});

app.post("/process-entry", async (req, res) => {
  const { userId, transactionId, amount } = req.body;
  const result = await processLotteryEntry(userId, transactionId, amount);
  res.json(result);
});

app.post("/select-winner", async (req, res) => {
  const result = await selectWeeklyWinner();
  res.json(result);
});

app.post("/clear-lottery-data", async (req, res) => {
  const result = await clearLotteryData();
  res.json(result);
});

app.get("/user-entries/:userId", async (req, res) => {
  const result = await getUserLotteryEntries(req.params.userId);
  res.json(result);
});

app.get("/lottery-stats", async (req, res) => {
  const result = await getLotteryStats();
  res.json(result);
});

app.post("/manual-winner", async (req, res) => {
  const { lotteryNumber } = req.body;
  const result = await manuallySelectWinner(lotteryNumber);
  res.json(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));
