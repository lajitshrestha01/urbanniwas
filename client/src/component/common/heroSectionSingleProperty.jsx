import { useState, useEffect } from "react"
import api from "../../utlis/axios.js"
import { useParams } from "react-router-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const HeroSection = () => {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [error, setError] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`)
        setProperty(response.data)
      } catch (error) {
        setError("Failed to load property!")
        console.error(error)
      }
    }

    fetchProperty()
  }, [id])

  // Handle the next and previous image navigation
  const nextImage = (e) => {
    if (e) e.stopPropagation()
    if (property && property.images) {
      setImageIndex((prevIndex) => (prevIndex + 1) % property.images.length)
    }
  }

  const prevImage = (e) => {
    if (e) e.stopPropagation()
    if (property && property.images) {
      setImageIndex((prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length)
    }
  }

  // Open lightbox to view full image
  const openLightbox = () => {
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  // Auto slide the image every 3 seconds, but only if not hovering
  useEffect(() => {
    if (isHovering) return // Don't auto-slide when user is hovering

    const interval = setInterval(nextImage, 3000)
    return () => clearInterval(interval)
  }, [property, isHovering])

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>
  if (!property) return <p className="text-center mt-4">Loading...</p>

  return (
    <>
      <div
        className="relative h-[70vh] w-full overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={openLightbox}
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src={property.images?.[imageIndex] || "https://via.placeholder.com/1200x600"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/70">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-playfair mb-4">{property.title}</h1>
          <p className="text-xl text-white font-lato">
            {property.city}, {property.address}
          </p>
        </div>

        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full z-20 text-sm">
          {imageIndex + 1} / {property.images?.length || 0}
        </div>

        {/* Left Arrow for Previous Image - Enhanced with better styling */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prevImage(e)
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-30 
                  bg-black/40 hover:bg-black/60 p-2 rounded-full transition-all duration-300
                  opacity-70 group-hover:opacity-100"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Arrow for Next Image - Enhanced with better styling */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            nextImage(e)
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-30 
                  bg-black/40 hover:bg-black/60 p-2 rounded-full transition-all duration-300
                  opacity-70 group-hover:opacity-100"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Lightbox for full image view */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-[#D4AF37] z-10"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full z-10">
              {imageIndex + 1} / {property.images?.length || 0}
            </div>

            {/* Image container - IMPROVED to fit full image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={property.images?.[imageIndex] || "https://via.placeholder.com/1200x600"}
                alt={property.title}
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage(e)
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#D4AF37] bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage(e)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#D4AF37] bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default HeroSection;
