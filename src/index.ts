import express, { Express, Request, Response } from "express";
import connection from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import BaseRouter from "./routes";
import { SuccessResponse } from "./helpers/customResponse";
import HttpStatusCode from "./helpers/httpResponse";
import { notFound } from "./middlewares/error.middleware";
import prisma from "./helpers/prisma";

const successResponse = new SuccessResponse();

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigin = "*";

const CorsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(CorsOptions));

app.get("/", (_req: Request, res: Response) => {
  successResponse.sendSuccessResponse(
    res,
    null,
    "Server Health check",
    HttpStatusCode.HTTP_OK
  );
});

app.use("/api/v1", BaseRouter);
app.use(notFound);

async function startServer() {
  try {
    // Test the databse connection
    await prisma.$connect();
    console.log("[database]: Connected to the database successfully.");

    //Start the server
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("[database]: Failed to connected to the database:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

startServer();
