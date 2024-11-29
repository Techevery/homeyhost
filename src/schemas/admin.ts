import { z } from "zod";

export const createAdminSchema = z.object({
  name:z.string().min(1, "Name is required."),
  email:z.string().email("Invalid email address."),
  password:z.string().min(6, "Password must be at least 6 characters long"),
  address:z.string().min(1, "Address is required."),
  gender:z.enum(["Male","Female","Other"],{
    errorMap:() => ({message:"Gender must be Male, Female, or Other."}),
  }),
});

export const createApartmentSchema = z.object({
  name:z.string().min(1, "Apartment name is required. "),
  address:z.string().min(1, "Address is required."),
  type:z.string().min(1, "Type is required."),
  bedroom: z.string().min(1, "Bedroom count is required."),
  price:z.number().positive("Price must be a positive number")
})