import { Router } from 'express'

import { CitaController } from '../controllers/citas.js'

export const citasRouter = Router()

citasRouter.get('/', CitaController.getAll)
citasRouter.get('/:id', CitaController.getById)
citasRouter.post('/', CitaController.create)
citasRouter.delete('/:id', CitaController.delete)
citasRouter.patch('/:id', CitaController.update)
