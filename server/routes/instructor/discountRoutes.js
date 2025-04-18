import express from 'express'
const router = express.Router()

import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscounts,
} from '../../controllers/instructor/discountController.js'

router.post('/:instructorId', createDiscount)
router.get('/:instructorId', getDiscounts)
router.put('/:instructorId/:id', updateDiscount)
router.delete('/:instructorId/:id', deleteDiscount)

export default router
