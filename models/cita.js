import { randomUUID } from 'node:crypto'
import { readJSON } from '../utils.js'

const citas = readJSON('./citas.json')

export class CitaModel {
  static async getAll ({ date }) {
    if (date) {
      return citas.filter(
        cita => cita.date.some(g => g.toLowerCase() === date.toLowerCase())
      )
    }
    return citas
  }

  static async getById ({ id }) {
    const cita = citas.find(cita => cita.id === id)
    if (cita) return cita
  }

  static async create ({ input }) {
    const newCita = {
      id: randomUUID(),
      ...input
    }
    citas.push(newCita)

    return newCita
  }

  static async delete ({ id }) {
    const citaIndex = citas.findIndex(cita => cita.id === id)
    if (citaIndex === -1) return false

    citas.splice(citaIndex, 1)

    return true
  }

  static async update ({ id, input }) {
    const citaIndex = citas.findIndex(cita => cita.id === id)
    if (citaIndex === -1) return false

    citas[citaIndex] = {
      ...citas[citaIndex],
      ...input
    }

    return citas[citaIndex]
  }
}
