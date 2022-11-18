import { BiEdit, BiTrashAlt } from 'react-icons/bi'
import { getUsers } from '../lib/helper'
import { useQuery } from 'react-query'
import { useSelector, useDispatch } from 'react-redux'
import {
  toggleChangeAction,
  updateAction,
  deleteAction,
} from '../redux/reducer'

export default function Table() {
  const { isLoading, isError, data, error } = useQuery('users', getUsers)
  if (isLoading) return <div>Employee data is loading... </div>
  if (isError) return <div>Got Error {error}</div>

  return (
    <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
      <thead className='bg-gray-100 dark:bg-gray-700'>
        <tr>
          <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            Name
          </th>
          <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            Email
          </th>
          <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            Salary
          </th>
          <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            Birthday
          </th>
          <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            Status
          </th>
          <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
        {data.map((obj, i) => (
          <Tr {...obj} key={i} />
        ))}
      </tbody>
    </table>
  )
}

function Tr({ _id, name, avatar, email, salary, date, status }) {
  const visible = useSelector((state) => state.app.client.toggleForm)
  const dispatch = useDispatch()

  const onUpdate = () => {
    dispatch(toggleChangeAction(_id))
    if (visible) {
      dispatch(updateAction(_id))
    }
  }

  const onDelete = () => {
    if (!visible) {
      dispatch(deleteAction(_id))
    }
  }

  return (
    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
      <td className="p-4 w-4">
        <img
          src={avatar || '#'}
          alt=""
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-center ml-2 font-semibold">
          {name || 'Unknown'}
        </span>
      </td>
      <td className="p-4 w-4">
        <span>{email || 'Unknown'}</span>
      </td>
      <td className="p-4 w-4">
        <span>{salary || 'Unknown'}</span>
      </td>
      <td className="p-4 w-4">
        <span>{date || 'Unknown'}</span>
      </td>
      <td className="p-4 w-4">
        <button className="cursor">
          <span
            className={`${
              status == 'Active' ? 'bg-green-500' : 'bg-rose-500'
            } text-white px-5 py-1 rounded-full`}
          >
            {status || 'Unknown'}
          </span>
        </button>
      </td>
      <td className="p-4 w-4">
        <button className="cursor" onClick={onUpdate}>
          <BiEdit size={25} color={'rgb(34,197,94)'}></BiEdit>
        </button>
        <button className="cursor" onClick={onDelete}>
          <BiTrashAlt size={25} color={'rgb(244,63,94)'}></BiTrashAlt>
        </button>
      </td>
    </tr>
  )
}
