const { Pool } = require('pg')
require('dotenv').config()
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    allowExitOnIdle: true
})

const getUser = async () => {
    const { rows: eventos } = await pool.query("SELECT * FROM eventos WHERE id = $1 ")
    return eventos
}
const registerUser = async (user) => {
    let { email, password, rol, lenguage } = user
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada, rol, lenguage]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    await pool.query(consulta, values)
    }

const verifyCredentials = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
    throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
    }

module.exports = {registerUser, verifyCredentials, getUser}