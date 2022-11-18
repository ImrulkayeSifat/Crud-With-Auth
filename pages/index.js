import Head from 'next/head'
import Link from 'next/link'
import { useSession, getSession, signOut } from 'next-auth/react'
import { BiUserPlus, BiX, BiCheck } from 'react-icons/bi'
import Table from '../components/table'
import Form from '../components/form'
import { useSelector, useDispatch } from 'react-redux'
import { toggleChangeAction, deleteAction } from '../redux/reducer'
import { useQueryClient } from 'react-query'
import { deleteUser, getUsers } from '../lib/helper'

export default function Home() {
  const visible = useSelector((state) => state.app.client.toggleForm)
  const dispatch = useDispatch()
  const deleteId = useSelector((state) => state.app.client.deleteId)
  const queryclient = useQueryClient()

  const handler = () => {
    dispatch(toggleChangeAction())
  }
  const deletehandler = async () => {
    if (deleteId) {
      await deleteUser(deleteId)
      await queryclient.prefetchQuery('users', getUsers)
      await dispatch(deleteAction(null))
    }
  }

  const canclehandler = async () => {
    await dispatch(deleteAction(null))
  }
  const { data: session } = useSession()
  return (
    <div>
      <Head>
        <title>Home Page</title>
      </Head>

      {session
        ? User({
            session,
            handler,
            visible,
            deletehandler,
            canclehandler,
            deleteId,
          })
        : Guest()}
    </div>
  )
}


function Guest() {
  return (
    <main className="container mx-auto text-center py-20">
      <h3 className="text-4xl font-bold">Guest Homepage</h3>

      <div className="flex justify-center">
        <Link legacyBehavior href={'/login'}>
          <a className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50">
            Sign In
          </a>
        </Link>
      </div>
    </main>
  )
}


function User({
  session,
  handler,
  visible,
  deletehandler,
  canclehandler,
  deleteId,
}) {
  return (
    <main className="container mx-auto text-center py-5">
      <div className="details">
        <h5><b><u>User Name :</u></b>{' '}{session.user.name}{' '}<b><u>Email:</u></b> {session.user.email}</h5>
        <button
          onClick={() => signOut()}
          className="mt-5 px-10 py-1 rounded-sm  bg-gray-50"
        >
          Sign Out
        </button>
      </div>

      <div className="py-0">
        <div className="container mx-auto flex justify-between py-5 border-b">
          <div className="left flex gap-3">
            <button
              onClick={handler}
              className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-grary-50 hover:border-indigo-500 hover:text-gray-800"
            >
              Add Employee{' '}
              <span className="px-1">
                <BiUserPlus size={23}></BiUserPlus>
              </span>
            </button>
          </div>
          {deleteId ? DeleteComponent({ deletehandler, canclehandler }) : <></>}
        </div>


        {visible ? <Form></Form> : <></>}
      </div>

      <div className='max-w-6xl mx-auto my-3'>
        <div className='flex flex-col'>
          <div className='overflow-x-auto shadow-md sm:rounded-lg'>
            <div className='inline-block min-w-full align-middle'>
              <div className='overflow-hidden'>
                <Table></Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  )
}

function DeleteComponent({ deletehandler, canclehandler }) {
  return (
    <div className="flex gap-5">
      <button>Are you sure?</button>
      <button
        onClick={deletehandler}
        className="flex bg-red-500 text-white px-4 py-2 border rounded-md hover:bg-rose-500 hover:border-red-500 hover:text-gray-50"
      >
        Yes{' '}
        <span className="px-1">
          <BiX color="rgb(255 255 255)" size={25} />
        </span>
      </button>
      <button
        onClick={canclehandler}
        className="flex bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gree-500 hover:border-green-500 hover:text-gray-50"
      >
        No{' '}
        <span className="px-1">
          <BiCheck color="rgb(255 255 255)" size={25} />
        </span>
      </button>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
