'use strict';

import { yup, validateYupSchema } from '@strapi/utils';

import { isEmpty } from 'lodash';

const fileInfoSchema = yup.object({
  folder: yup.string().required(),
});
const uploadSchema = yup.object({
  fileInfo: fileInfoSchema,
});

const multiUploadSchema = yup.object({
  fileInfo: yup.array().of(fileInfoSchema),
});
const validateUploadBody = (data = {}, isMulti = false) => {
  const schema = isMulti ? multiUploadSchema : uploadSchema;

  return validateYupSchema(schema, { strict: false })(data);
};
module.exports = ({ strapi }) => ({
  async upload(ctx) {
    const {
      request: { body, files: { files = null } = {} },
    } = ctx;

    if (isEmpty(files) || files.size === 0) {
      return ctx.badRequest('Files are empty.');
    }

    const data = await validateUploadBody(body, Array.isArray(files));

    const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
      data,
      files,
    });

    if (!uploadedFiles || !uploadedFiles.length) {
      return ctx.badRequest('Upload unsuccessful.');
    }

    return ctx.send(uploadedFiles);
  },
});
