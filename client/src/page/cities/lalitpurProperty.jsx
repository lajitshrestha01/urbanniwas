import { useEffect, useState } from "react"
import api from "../../utlis/axios"
import { Home, MapPin, DollarSign, Bed, Bath, Square, Loader2, AlertCircle } from "lucide-react"

const LalitpurProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("properties/city/lalitpur");
        setProperties(res.data)
        setError(false)
      } catch (error) {
        console.error("Error fetching bhatapur Properties:", error)
        setError(true)
      }
      setLoading(false)
    }
    fetchProperties()
  }, [])

  // Format price to Nepali Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-600">Loading properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-red-50 rounded-lg p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load properties</h2>
        <p className="text-gray-600 text-center">
          We encountered an error while fetching properties in Lalitpur. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Home className="w-6 h-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Properties in Lalitpur</h1>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {property.image && (
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                      e.currentTarget.alt = "Property image unavailable"
                    }}
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">{property.title}</h2>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  <span className="text-sm">{property.location || "Lalitpur"}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>

                <div className="flex flex-wrap gap-3 mb-4">
                  {property.bedrooms && (
                    <div className="flex items-center text-gray-700">
                      <Bed className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="text-sm">{property.bedrooms} Beds</span>
                    </div>
                  )}

                  {property.bathrooms && (
                    <div className="flex items-center text-gray-700">
                      <Bath className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="text-sm">{property.bathrooms} Baths</span>
                    </div>
                  )}

                  {property.area && (
                    <div className="flex items-center text-gray-700">
                      <Square className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="text-sm">{property.area} sq.ft</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center text-blue-600 font-bold">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <span>{property.price ? formatPrice(property.price) : "Price on request"}</span>
                  </div>

                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-600 mb-2">No properties found for Lalitpur</p>
          <p className="text-gray-500">Check back later for new listings or try a different location.</p>
        </div>
      )}
    </div>
  )
}

export default LalitpurProperties;
