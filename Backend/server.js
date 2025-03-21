import cors from "cors";
import "dotenv/config";
import express from "express";
import swaggerUI from "swagger-ui-express";
import { connectDB } from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import swaggerSpec from "./swagger.js";

//app config
const app = express();
const port = process.env.PORT || 5000;
connectDB();

//middlewares
app.use(express.json());
app.use(cors());
// Serve Swagger documentation
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//Api endpoints
app.get("/", (req, res) => {
  res.send("Api Start Working");
});
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
