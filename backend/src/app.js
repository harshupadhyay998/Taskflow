import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notFound from "./middleware/NotFound.js";
import errorHandler from "./middleware/errorHandler.js";
const app = express();

// app.use(cors({
//     origin:["https://harsh-taskflow.vercel.app"],
//     credentials:true
// }));

app.use(cors({
  origin: [
    "https://harsh-taskflow.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Manager API is running 🚀",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;