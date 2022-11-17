import connectMongo from '../../../database/connection'
import {
  getUsers,
  postUser,
  putUser,
  deleteUser,
} from '../../../database/controllers'
export default async function handler(req, res) {
  await connectMongo()

  // type of request
  const { method } = req

  switch (method) {
    case 'GET':
      getUsers(req, res)
      break
    case 'POST':
      postUser(req, res)
      break
    case 'PUT':
      putUser(req, res)
      break
    case 'DELETE':
      deleteUser(req, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allow`)
      break
  }
}
