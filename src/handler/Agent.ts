import { Request, Response } from "express";
import prisma from "../helpers/prisma";
import { info, error as logError } from "../helpers/logger";
import HttpStatusCode from "../helpers/httpResponse";
import Helper from "../helpers";
import { ErrorResponse, SuccessResponse } from "../helpers/customResponse";

const successResponse = new SuccessResponse();
const errorResponse = new ErrorResponse();
type RequestHandler = (req: Request, res: Response) => Promise<Response>;

export const createAgent = async (req: Request, res: Response)=> {
  try {
    const {
      name,
      email,
      password,
      address,
      gender,
      phone_number,
      bank_name,
      account_number,
    } = req.body;

    const existingAccount = await prisma.agent.findUnique({
      where: { email },
    });

    if (existingAccount) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Account already exist",
        HttpStatusCode.HTTP_BAD_REQUEST
      );
    }

    const hashedPassword = Helper.hash(password);

    const agent = await prisma.agent.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        gender,
        phone_number,
        bank_name,
        account_number,
      },
    });

    const { password: _, ...agentDataWithoutPassword } = agent;

    info({ message: "Agent Profile Created successfully." });

    successResponse.sendSuccessResponse(
      res,
      agentDataWithoutPassword,
      "Account Created Successfully",
      HttpStatusCode.HTTP_CREATED
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error creating Agent profile",
        params: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      });
    }

    errorResponse.sendErrorResponse(
      res,
      null,
      "INTERNAL SERVER ERROR",
      HttpStatusCode.HTTP_INTERNAL_SERVER_ERROR
    );
  }
};

export const agentLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const agent = await prisma.agent.findUnique({
      where: { email },
    });

    if (!agent) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Account not found",
        HttpStatusCode.HTTP_NOT_FOUND
      );
    }

    const isPasswordCorrect = Helper.correctPassword(password, agent?.password || "");

    if (!isPasswordCorrect) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Invalid Credentials",
        HttpStatusCode.HTTP_BAD_REQUEST
      );
    }

    const token = Helper.signToken({ id: agent?.id, email: agent?.email });

    info({ message: "Agent authenticated" });
    successResponse.sendSuccessResponse(
      res,
      {
        token,
        agent: {
          id: agent?.id,
          name: agent?.name,
          email: agent?.email,
          status: agent?.status,
        },
      },
      "Agent Authenticated",
      HttpStatusCode.HTTP_OK
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error Authenticaing Agent",
        params: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      });
    }

    errorResponse.sendErrorResponse(
      res,
      null,
      "INTERNAL SERVER ERROR",
      HttpStatusCode.HTTP_INTERNAL_SERVER_ERROR
    );
  }
};