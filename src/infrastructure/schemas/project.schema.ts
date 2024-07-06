import Joi from "joi";

const name  = Joi.string()
const descriptions = Joi.string() // ! change to type array of string
const images =  Joi.string() // ! change to type array of string
const uri = Joi.string()

export const createUserSchema = Joi.object({
  descriptions: descriptions.required(),
  name:name.required(),
  images: images.required(),
  uri,
})

export const updateUserSchema = Joi.object({
  descriptions,
  uri,
  images
});

export const getUserSchema = Joi.object({
  descriptions,
  name,
  images
});
