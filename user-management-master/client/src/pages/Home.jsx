import Navbar from "../components/Navbar"
import { useSelector } from "react-redux"

function Home() {
     const {user} = useSelector((state)=>state.auth)

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          Home Page
        </h2>

        <div className="bg-white shadow p-6 rounded">
          <p className="text-lg">
            Logged in as: <strong>{user?.email}</strong>
          </p>

        
        </div>
      </div>
    </>
  )
}

export default Home