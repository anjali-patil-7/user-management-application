import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, deleteUser, createUser, updateUser, resetAdmin, toggleBlockUser } from "../../features/admin/adminSlice"
import { logout } from "../../features/auth/authSlice"
import { toast } from "react-toastify"
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaSignOutAlt, FaLock, FaUnlock } from "react-icons/fa"
import UserModal from "../../components/admin/UserModal"

const AdminDashboard = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)

    const dispatch = useDispatch()
    const { users = [], pages = 1, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.admin || {}
    )

    useEffect(() => {
        dispatch(getUsers({ search: searchTerm, page }))
    }, [dispatch, page, searchTerm])

    useEffect(() => {
        if (isError) toast.error(message)
        if (isSuccess && message) toast.success(message)
        dispatch(resetAdmin())
    }, [isError, isSuccess, message, dispatch])

    const handleDelete = (id) => {
        const confirmToast = ({ closeToast }) => (
            <div className="flex flex-col gap-3 p-2">
                <p className="font-bold text-gray-800 text-sm">Are you sure you want to delete this user?</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            dispatch(deleteUser(id))
                            closeToast()
                        }}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={closeToast}
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )

        toast.warning(confirmToast, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false
        })
    }

    const openAddModal = () => {
        setCurrentUser(null)
        setIsModalOpen(true)
    }

    const openEditModal = (user) => {
        setCurrentUser(user)
        setIsModalOpen(true)
    }

    const handleModalSubmit = (formData) => {
        if (currentUser) {
            dispatch(updateUser({ id: currentUser._id, userData: formData }))
        } else {
            dispatch(createUser(formData))
        }
        setIsModalOpen(false)
    }

    const handleToggleBlock = (id) => {
        dispatch(toggleBlockUser(id))
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-indigo-700">
                            <FaUserPlus /> <span>Add User</span>
                        </button>
                        <button onClick={() => dispatch(logout())} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border rounded outline-none focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-gray-700">
                            {users && users.length > 0 ? users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50">
                                    <td className="p-3 font-medium">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                {u.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleToggleBlock(u._id)}
                                                className={`${u.isBlocked ? "text-green-600 hover:text-green-800" : "text-orange-600 hover:text-orange-800"}`}
                                                title={u.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                {u.isBlocked ? <FaUnlock /> : <FaLock />}
                                            </button>
                                            <button onClick={() => openEditModal(u)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                                            <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" className="p-10 text-center text-gray-400">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex justify-center items-center mt-6 gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1.5 border rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <div className="flex gap-2">
                            {[...Array(pages).keys()].map((p) => (
                                <button
                                    key={p + 1}
                                    onClick={() => setPage(p + 1)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold border transition ${page === p + 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {p + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={page === pages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1.5 border rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                user={currentUser}
                title={currentUser ? "Edit User" : "Add New User"}
            />
        </div>
    )
}

export default AdminDashboard
