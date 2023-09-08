const express = require('express')
const crypto = require('node:crypto')
const citas = require('./citas.json')
const cors = require('cors')
const { validateCita, validatePartialCita } = require('./schemas/citas')

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.disable('x-powered-by')

// Traer todas las citas
app.get('/citas', (req, res) => {
  const { date } = req.query
  if (date) {
    const filteredCitas = citas.filter(cita =>
      cita.date.some(g => g.toLowerCase() === date.toLowerCase())
    )
    return res.json(filteredCitas)
  }
  res.json(citas)
})

// Traer cita
app.get('/citas/:id', (req, res) => {
  const { id } = req.params
  const cita = citas.find(cita => cita.id === id)
  if (cita) return res.json(cita)

  res.status(404).json({ message: 'Cita not found' })
})

// Crear cita nueva
app.post('/citas', (req, res) => {
  const result = validateCita(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newCita = {
    id: crypto.randomUUID(),
    ...result.data
  }
  citas.push(newCita)

  res.status(201).json(newCita)
})

// Eliminar citas con id
app.delete('/citas/:id', (req, res) => {
  const { id } = req.params
  const citaIndex = citas.findIndex(cita => cita.id === id)

  if (citaIndex === -1) {
    return res.status(404).json({ message: 'Cita no encontrada' })
  }

  citas.splice(citaIndex, 1)

  return res.json({ message: 'Cita completada ✔' })
})

// Patchear citas con id
app.patch('/citas/:id', (req, res) => {
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

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
