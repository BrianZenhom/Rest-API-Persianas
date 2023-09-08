import { randomUUID } from 'node:crypto'
import { Router } from 'express'

import { validateCita, validatePartialCita } from '../schemas/citas'

import { readJSON } from './utils.js'

const citas = readJSON('./citas.json')
export const citasRouter = Router()

citasRouter.get('/', (req, res) => {
  const { date } = req.query
  if (date) {
    const filteredCitas = citas.filter(cita =>
      cita.date.some(g => g.toLowerCase() === date.toLowerCase())
    )
    return res.json(filteredCitas)
  }
  res.json(citas)
})

citasRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const cita = citas.find(cita => cita.id === id)
  if (cita) return res.json(cita)

  res.status(404).json({ message: 'Cita not found' })
})

citasRouter.post('/', (req, res) => {
  const result = validateCita(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newCita = {
    id: randomUUID(),
    ...result.data
  }
  citas.push(newCita)

  res.status(201).json(newCita)
})

citasRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const citaIndex = citas.findIndex(cita => cita.id === id)

  if (citaIndex === -1) {
    return res.status(404).json({ message: 'Cita no encontrada' })
  }

  citas.splice(citaIndex, 1)

  return res.json({ message: 'Cita completada ✔' })
})

citasRouter.patch('/:id', (req, res) => {
  const result = validatePartialCita(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const citaIndex = citas.findIndex(cita => cita.id === id)

  if (citaIndex === -1) {
    return res.status(404).json({ message: 'Cita no encontrada' })
  }

  const updateCita = {
    ...citas[citaIndex],
    ...result.data
  }

  citas[citaIndex] = updateCita

  return res.json(updateCita)
})
