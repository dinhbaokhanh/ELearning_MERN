import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-2">Oops... You seem lost.</p>
      <p className="mb-6 text-center text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
      >
        Go back home
      </Link>
      <div className="mt-10 text-sm text-gray-500 italic">
        “Không phải ai đi lạc cũng muốn quay về...”
      </div>
    </div>
  )
}

export default NotFound
