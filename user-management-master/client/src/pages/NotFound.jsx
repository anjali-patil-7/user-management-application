import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const NotFound = () => {
    const { user, accessToken } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const getHomePath = () => {
        if (!accessToken) return "/login"
        return user?.role === "admin" ? "/admin/dashboard" : "/home"
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <h1 className="text-9xl font-extrabold text-indigo-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to={getHomePath()}
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound
