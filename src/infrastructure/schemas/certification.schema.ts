import Joi from "joi";

const title = Joi.string();
const emitedBy = Joi.string(); // ! change to type array of string
const emitedAt = Joi.number(); // ! change to type array of string
const image = Joi.string();
const url = Joi.string();
const uuid = Joi.string();
const tags = Joi.array().items(Joi.string());

export const createCertification = Joi.object({
  title: title.required(),
  emitedBy: emitedBy.required(),
  emitedAt: emitedAt.required(),
  image: image.required(),
  url,
});

export const updateCertification = Joi.object({
  uuid,
  emitedAt,
  emitedBy,
  title,
  image,
  tags,
  url,
});

export const createCertifications = Joi.array().items(createCertification);
