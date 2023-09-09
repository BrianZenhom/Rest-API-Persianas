import { CitaModel } from '../models/cita'

import { validateCita, validatePartialCita } from './../schemas/citas.js'

export class CitaController {
  static async getAll (req, res) {
    const { date } = req.query
    const citas = await CitaModel.getAll({ date })
    res.json(citas)
  }

  static async getById (req, res) {
    const { id } = req.params
    const cita = await CitaModel.getById({ id })
    if (cita) return res.json(cita)

    res.status(404).json({ message: 'Cita not found' })
  }

  static async create (req, res) {
    const result = validateCita(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newCita = await CitaModel.create({ input: result.data })

    res.status(201).json(newCita)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await CitaModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Cita no encontrada' })
    }

    return res.json({ message: 'Cita completada ✔' })
  }

  static async update (req, res) {
    const result = validatePartialCita(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updatedCita = await CitaModel.update({
      id, input: result.data
    })

    return res.json(updatedCita)
  }
}
