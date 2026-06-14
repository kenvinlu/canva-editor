/**
 * your-upload controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::your-upload.your-upload',
  ({ strapi }) => ({
    async uploadUserImage(ctx: Context) {
      try {
        // Get user from token
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized('User not authenticated');
        }

        // Check if files are present in the request
        const files = ctx.request.files?.file;
        if (!files) {
          return ctx.badRequest('No file uploaded');
        }

        // Handle single or multiple files
        const fileArray = Array.isArray(files) ? files : [files];

        // Upload files to Strapi's upload plugin
        const uploadedFiles = await Promise.all(
          fileArray.map(async (file) => {
            const uploadedFile =
              await strapi.plugins.upload.services.upload.upload({
                data: {
                  refId: user.id,
                  ref: 'plugin::users-permissions.user',
                  field: 'uploads', // Adjust based on your schema relation
                  source: 'users-permissions',
                },
                files: file,
              });
            return uploadedFile[0]; // Strapi upload returns an array
          })
        );

        // Create entries in your-upload content type
        const entities = await Promise.all(
          uploadedFiles.map(async (uploadedFile) => {
            return await strapi.entityService.create(
              'api::your-upload.your-upload',
              {
                data: {
                  user: user.id,
                  img: uploadedFile.id, // Reference the uploaded file ID
                  publishedAt: new Date(), // Ensure the entry is published
                },
                populate: {
                  img: {
                    fields: ['url', 'mime', 'width', 'height', 'formats'],
                  },
                },
              }
            );
          })
        );

        // Transform and return response
        return ctx.send({
          data: entities,
          meta: {
            uploadedFiles: entities.length,
          },
        });
      } catch (error) {
        console.error('Upload error:', error);
        return ctx.internalServerError('An error occurred during file upload');
      }
    },
    async removeUserImage(ctx: Context) {
      try {
        // Get user from token
        const user = ctx.state.user;
        if (!user) {
          return ctx.unauthorized('User not authenticated');
        }

        // Validate request body
        const { documentId } = ctx.params;

        if (!documentId || typeof documentId !== 'string') {
          return ctx.badRequest('Invalid or missing image ID');
        }

        // Find the your-upload entry with populated img relation
        const uploadEntry = await strapi
          .documents('api::your-upload.your-upload')
          .findOne({
            documentId: documentId,
            filters: {
              user: {
                id: user.id,
              },
            },
            populate: {
              img: {
                fields: ['id'],
              },
              user: true,
            },
          });
        // Check if entry exists
        if (!uploadEntry) {
          return ctx.notFound('Image not found or not owned by user');
        }

        // Delete the associated file from the upload plugin
        if (uploadEntry.img?.id) {
          try {
            await strapi.plugins.upload.services.upload.remove(
              uploadEntry.img.id
            );
          } catch (fileError) {
            console.error('Failed to delete associated file:', fileError);
            // Continue with deletion even if file removal fails (optional)
          }
        }

        // Delete the your-upload entry
        await strapi.documents('api::your-upload.your-upload').delete({
          documentId: documentId,
        });

        // Return success response
        return ctx.send({
          data: {
            documentId,
            message: 'Image deleted successfully',
          },
          meta: {},
        });
      } catch (error) {
        console.error('Remove image error:', error);
        return ctx.internalServerError(
          'An error occurred while deleting the image'
        );
      }
    },
    async getUserImages(ctx: Context) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }
      const images = await strapi.entityService.findMany(
        'api::your-upload.your-upload',
        {
          filters: { user: user.id },
          populate: {
            img: {
              fields: ['url', 'mime', 'width', 'height', 'formats'],
            },
          },
        }
      );
      return this.transformResponse(images);
    },
  })
);
