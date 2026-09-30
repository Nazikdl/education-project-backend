/**
 * @openapi
 * tags:
 *   - name: Upload
 *     description: File upload management endpoints (single/multi file upload and removal)
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 *
 *     SingleUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: string
 *           example: uploads/1712345678901-image.jpg
 *           description: The uploaded file name/path
 *         message:
 *           type: string
 *           example: upload file successfully
 *
 *     MultiUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: upload files successfully
 *         data:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - uploads/1712345678901-image1.jpg
 *             - uploads/1712345678902-image2.jpg
 *
 *     RemoveFileRequest:
 *       type: object
 *       required:
 *         - filename
 *       properties:
 *         filename:
 *           type: string
 *           example: uploads/1712345678901-image.jpg
 *           description: File path or filename to remove
 *
 *     RemoveFilesRequest:
 *       type: object
 *       required:
 *         - filenames
 *       properties:
 *         filenames:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - uploads/1712345678901-image1.jpg
 *             - uploads/1712345678902-image2.jpg
 *           description: Array of file paths or filenames to remove
 *
 *     RemoveFileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: remove file successfully
 */

/**
 * @openapi
 * /api/uploads:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload single file
 *     description: |
 *       Upload a single file. **Admin/SuperAdmin only**.
 *       
 *       **Allowed file types** (depending on `uploadOption` config):
 *       - Images: JPEG, PNG, WEBP, GIF, SVG
 *       - Videos: MP4, WEBM, OGG
 *       
 *       **Max size**: Depends on `uploadOption` config
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleUploadResponse'
 *             example:
 *               success: true
 *               data: uploads/1712345678901-image.jpg
 *               message: upload file successfully
 *       400:
 *         description: No file provided or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: upload filed
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin permission required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: You do not have permission to perform this action
 *
 *   delete:
 *     tags:
 *       - Upload
 *     summary: Remove single file
 *     description: |
 *       Remove a single file from server. **Admin/SuperAdmin only**.
 *       - Accepts full path or just filename
 *       - If file doesn't exist, it silently succeeds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveFileRequest'
 *           example:
 *             filename: uploads/1712345678901-image.jpg
 *     responses:
 *       200:
 *         description: File removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RemoveFileResponse'
 *             example:
 *               success: true
 *               message: remove file successfully
 *       400:
 *         description: Filename is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: filename is required
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin permission required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @openapi
 * /api/uploads/multi:
 *   post:
 *     tags:
 *       - Upload
 *     summary: Upload multiple files
 *     description: |
 *       Upload multiple files at once. **Admin/SuperAdmin only**.
 *       - Uses field name `files`
 *       - Max 10 files per request
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
 *                 description: Files to upload (max 10)
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MultiUploadResponse'
 *             example:
 *               success: true
 *               message: upload files successfully
 *               data:
 *                 - uploads/1712345678901-image1.jpg
 *                 - uploads/1712345678902-image2.jpg
 *       400:
 *         description: No files provided or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: upload filed
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin permission required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     tags:
 *       - Upload
 *     summary: Remove multiple files
 *     description: |
 *       Remove multiple files from server. **Admin/SuperAdmin only**.
 *       - Accepts array of full paths or filenames
 *       - Files that don't exist are silently skipped
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RemoveFilesRequest'
 *           example:
 *             filenames:
 *               - uploads/1712345678901-image1.jpg
 *               - uploads/1712345678902-image2.jpg
 *     responses:
 *       200:
 *         description: Files removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RemoveFileResponse'
 *             example:
 *               success: true
 *               message: remove files successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin permission required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */