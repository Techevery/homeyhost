import { Request, Response } from "express";
import prisma from "../helpers/prisma";
import { info, error as logError } from "../helpers/logger";
import { SuccessResponse, ErrorResponse } from "../helpers/customResponse";
import HttpStatusCode from "../helpers/httpResponse";
import Helper from "../helpers";

const successResponse = new SuccessResponse();
const errorResponse = new ErrorResponse();

type RequestHandler = (req: Request, res: Response) => Promise<Response>;

export const createAdminProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, gender } = req.body;

    const hashedPassword = Helper.hash(password);

    const admin = await prisma.admin.create({
      data: { name, email, password: hashedPassword, address, gender },
    });

    const { password: _, ...adminDataWithoutPassword } = admin;

    info({ message: "Admin profile created successfully." });

    successResponse.sendSuccessResponse(
      res,
      adminDataWithoutPassword,
      "Admin Profile created",
      HttpStatusCode.HTTP_CREATED
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error creating Admin profile",
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

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Account not found",
        HttpStatusCode.HTTP_NOT_FOUND
      );
    }

    const isPasswordCorrect = Helper.correctPassword(
      password,
      admin?.password || ""
    );

    if (!isPasswordCorrect) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Invalid Credentials",
        HttpStatusCode.HTTP_BAD_REQUEST
      );
    }

    const token = Helper.signToken({ id: admin?.id, email: admin?.email });

    info({ message: "Admin authenticated" });
    successResponse.sendSuccessResponse(
      res,
      {
        token,
        admin: { id: admin?.id, name: admin?.name, email: admin?.email },
      },
      "Admin Authenticated",
      HttpStatusCode.HTTP_OK
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error Authenticating Admin",
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

export const createApartment = async (req: Request, res: Response) => {
  try {
    const { name, address, type, servicing, bedroom, price } = req.body;

    const adminId = (req as any).admin.id;
    console.log("Admin ID: ", adminId);

    if (!adminId) {
      res.status(HttpStatusCode.HTTP_FORBIDDEN).json({
        message: "Forbidden: No Admin account access",
      });

      return;
    }

    const apartment = await prisma.apartment.create({
      data: {
        name,
        address,
        type,
        servicing,
        bedroom,
        price,
        createdBy: { connect: { id: adminId } },
      },
    });

    info({ message: "Apartment created successfully." });

    successResponse.sendSuccessResponse(
      res,
      apartment,
      "Apartment created successfully",
      HttpStatusCode.HTTP_OK
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error creating apartment",
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

export const verifyAgent = async (req: Request, res: Response) => {
  try {
    const { agentId, status } = req.body;

    if (!agentId || !status) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "agentId and status are required",
        HttpStatusCode.HTTP_BAD_REQUEST
      );
    }

    if (!["VERIFIED", "UNVERIFIED"].includes(status)) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Invalid status. Status must be 'VERIFIED' or 'UNVERIFIED'.",
        HttpStatusCode.HTTP_BAD_REQUEST
      );
    }

    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Agent Account not found",
        HttpStatusCode.HTTP_NOT_FOUND
      );
    }

    const updateProfile = await prisma.agent.update({
      where: { id: agent?.id },
      data: { status },
    });

    info({ message: `Agent ${agentId} verified` });

    successResponse.sendSuccessResponse(
      res,
      updateProfile,
      "Agent Status Updated",
      HttpStatusCode.HTTP_OK
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error updating Agent status",
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

export const listProperties = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin.id;

    if (!adminId) {
      errorResponse.sendErrorResponse(
        res,
        null,
        "Forbidden: No Admin account access",
        HttpStatusCode.HTTP_FORBIDDEN
      );
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const skip = (page - 1) * pageSize;

    const apartments = await prisma.apartment.findMany({
      skip,
      take: pageSize,
      where: {
        adminId,
      },
      include: {
        createdBy: true,
      },
    });

    const totalCount = await prisma.apartment.count({
      where: {
        adminId,
      },
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    successResponse.sendSuccessResponse(
      res,
      {
        apartments,
        pagination: {
          totalItems: totalCount,
          totalPages,
          currentPage: page,
          itemsPerPage: pageSize,
        },
      },
      "Available Apartments",
      HttpStatusCode.HTTP_OK
    );
  } catch (error) {
    if (error instanceof Error) {
      logError({
        message: "Error getting properties",
        params: {
          name: error.name,
          messages: error.message,
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
