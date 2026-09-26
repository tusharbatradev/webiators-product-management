const Joi = require('joi');

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const createProductSchema = Joi.object({
  metaTitle: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Meta title is required',
    'any.required': 'Meta title is required',
    'string.max': 'Meta title must not exceed 100 characters',
  }),
  productName: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required',
    'string.max': 'Product name must not exceed 200 characters',
  }),
  productSlug: Joi.string().trim().pattern(slugPattern).required().messages({
    'string.empty': 'Product slug is required',
    'any.required': 'Product slug is required',
    'string.pattern.base': 'Product slug must be URL-friendly (e.g. premium-cotton-t-shirt)',
  }),
  galleryImages: Joi.array()
    .items(Joi.string().uri().messages({ 'string.uri': 'Each gallery image must be a valid URL' }))
    .min(1)
    .required()
    .messages({
      'array.base': 'Gallery images must be an array',
      'array.min': 'At least one gallery image is required',
      'any.required': 'Gallery images are required',
    }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  discountedPrice: Joi.number().positive().less(Joi.ref('price')).optional().messages({
    'number.base': 'Discounted price must be a number',
    'number.positive': 'Discounted price must be a positive number',
    'number.less': 'Discounted price must be less than the regular price',
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
  }),
});

const updateProductSchema = Joi.object({
  metaTitle: Joi.string().trim().max(100).messages({
    'string.empty': 'Meta title must not be empty',
    'string.max': 'Meta title must not exceed 100 characters',
  }),
  productName: Joi.string().trim().max(200).messages({
    'string.empty': 'Product name must not be empty',
    'string.max': 'Product name must not exceed 200 characters',
  }),
  productSlug: Joi.string().trim().pattern(slugPattern).messages({
    'string.empty': 'Product slug must not be empty',
    'string.pattern.base': 'Product slug must be URL-friendly (e.g. premium-cotton-t-shirt)',
  }),
  galleryImages: Joi.array()
    .items(Joi.string().uri().messages({ 'string.uri': 'Each gallery image must be a valid URL' }))
    .min(1)
    .messages({
      'array.base': 'Gallery images must be an array',
      'array.min': 'At least one gallery image is required',
    }),
  price: Joi.number().positive().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),
  discountedPrice: Joi.number().positive().less(Joi.ref('price')).optional().messages({
    'number.base': 'Discounted price must be a number',
    'number.positive': 'Discounted price must be a positive number',
    'number.less': 'Discounted price must be less than the regular price',
  }),
  description: Joi.string().trim().messages({
    'string.empty': 'Description must not be empty',
  }),
}).min(1);

module.exports = { createProductSchema, updateProductSchema };
