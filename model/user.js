import { Schema, models, model } from 'mongoose'

const employeSchema = new Schema({
  name: String,
  avatar: String,
  email: String,
  salary: Number,
  date: String,
  status: String,
})

const Employees = models.employee || model('employee', employeSchema)

export default Employees
