import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 33061,
  password: 'mypassword',
  database: 'citasdb'
}

const connection = await mysql.createConnection(config)

export class CitaModel {
  static async getAll ({ date }) {
    const [citas] = await connection.query(
      'SELECT name, phone, address, building, floor, date, BIN_TO_UUID(id) id FROM cita;'
    )
    return citas
  }

  static async getById ({ id }) {

  }

  static async create ({ input }) {

  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
