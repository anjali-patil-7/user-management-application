import React, { useState, useEffect } from "react"
import { FaTimes } from "react-icons/fa"

const UserModal = ({ isOpen, onClose, onSubmit, user, title }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "",
            })
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
            })
        }
        setErrors({})
    }, [user, isOpen])

    const validateField = (name, value) => {
        let error = ""
        if (name === "name") {
            if (!value.trim()) error = "Name is required"
            else if (value.trim().length < 2) error = "Name must be at least 2 characters"
        }
        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!value) error = "Email is required"
            else if (!emailRegex.test(value)) error = "Invalid email format"
        }
        if (name === "password" && !user) {
            if (!value) error = "Password is required"
            else if (value.length < 6) error = "Password must be at least 6 characters"
        }
        return error
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Real-time validation
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Final Validation check
        const newErrors = {}
        const fieldsToValidate = user ? ["name", "email"] : ["name", "email", "password"]

        fieldsToValidate.forEach(key => {
            const error = validateField(key, formData[key])
            if (error) newErrors[key] = error
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Please fix the errors in the form")
            return
        }

        const submissionData = { ...formData }
        if (user) {
            delete submissionData.password
        }
        onSubmit(submissionData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="hover:opacity-80 font-bold"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2`}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`w-full px-4 py-2 border rounded-lg outline-none transition ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'} focus:ring-2`}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Temporary Password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition shadow-md">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserModal
