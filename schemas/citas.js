import z from 'zod'

const citaSchema = z.object({
  firstName: z.string({
    required_error: 'Es necesario ingresar tu nombre.'
  }),
  lastName: z.string({
    required_error: 'Es necesario ingresar tu apellido.'
  }),
  tel: z.number({
    required_error: 'Es necesario ingresar un movil.'
  }).int().positive(),
  address: z.string({
    required_error: 'Ingresa tu domicilio.'
  }),
  floor: z.string('Ingresa tu piso'),
  city: z.string({
    required_error: 'Ingresa tu ciudad'
  }),
  date: z.string(),
  time: z.string()
})

export function validateCita (object) {
  return citaSchema.safeParse(object)
}

export function validatePartialCita (object) {
  return citaSchema.partial().safeParse(object)
}
