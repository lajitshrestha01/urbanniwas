import { useEffect, useState } from "react"
import api from "../utlis/axios"
import PropertyCard from "../component/common/propertyCard"
import Navbar from '../component/common/navbar'
import DashboardLayout from "../component/layout/dashboardLayout"

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true)
        const { data } = await api.get("/favorites", {
          withCredentials: true,
        })
        setFavorites(data)
      } catch (error) {
        console.error("Fetch favorites error:", error)
        setError("Failed to load favorites. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  return (
    <>
    <div className="sticky top-0 z-10 bg-white shadow">
      <DashboardLayout>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Favorites</h2>
        <p className="mt-2 text-sm text-gray-500">
          {isLoading
            ? "Loading your favorite properties..."
            : favorites.length
              ? `You have ${favorites.length} favorite ${favorites.length === 1 ? "property" : "properties"}`
              : "Add properties to your favorites to see them here"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : !favorites.length ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding properties to your favorites to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav, index) => (
            <div
              key={fav.property.id}
              className="transform transition duration-300 hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard property={fav.property} />
            </div>
          ))}
        </div>
      )}
    </div>
      </DashboardLayout>
    </div>

    </>
   
  )
}

export default FavoritesPage;
