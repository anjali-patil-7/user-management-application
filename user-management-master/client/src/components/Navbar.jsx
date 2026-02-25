import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth/authSlice"
import { logoutUser } from "../features/auth/authService"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const logoutHandler = async () => {
    await logoutUser()
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">User Management</h1>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm">
              Welcome, {user.name}
            </span>

            <Link to="/profile" className="bg-gray-700 px-3 py-1 rounded">
              Profile
            </Link>

            <button
              onClick={logoutHandler}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar