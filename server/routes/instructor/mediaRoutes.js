import express from 'express'
import multer from 'multer'
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from '../../helper/cloudinary.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const uploadResult = await uploadMediaToCloudinary(req.file.path)
    res.status(200).json({
      success: true,
      data: uploadResult,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({
      success: false,
      message: 'Upload failed',
    })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'No Asset ID',
      })
    }

    await deleteMediaFromCloudinary(id)
    res.status(200).json({
      success: true,
      message: 'Asset Deleted !',
    })
  } catch (error) {
    console.log(e)
    res.status(500).json({
      success: false,
      message: 'Upload failed',
    })
  }
})

router.post('/bulk-upload', upload.array('files', 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    )

    const results = await Promise.all(uploadPromises)

    res.status(200).json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error in bulk uploading' })
  }
})

export default router
