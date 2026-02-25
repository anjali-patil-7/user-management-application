import api from "../../services/api"

// Fetch users with search and pagination
const getUsers = async (search = "", page = 1) => {
    const response = await api.get(`admin/users?search=${search}&page=${page}`)

    return response.data
}

// Delete user
const deleteUser = async (id) => {
    const response = await api.delete(`admin/users/${id}`)

    return response.data
}

// Update user
const updateUser = async (id, userData) => {
    const response = await api.put(`admin/users/${id}`, userData)

    return response.data
}

// Create user
const createUser = async (userData) => {
    const response = await api.post("admin/users", userData)

    return response.data
}

const toggleBlockUser = async (id) => {
    const response = await api.patch(`admin/users/${id}/toggle-block`)
    return response.data
}

const adminService = {
    getUsers,
    deleteUser,
    updateUser,
    createUser,
    toggleBlockUser,
}

export default adminService
