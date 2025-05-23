import { useState, useEffect } from 'react';
import { ChevronDown, Filter, MapPin, DollarSign, Home, X, Loader } from 'lucide-react';
import api from '../utlis/axios.js';
import PropertyCardBuySale from '../component/common/propertyCardForBuySale.jsx';
import Navbar from '../component/common/navbar.jsx';
import Footer from '../component/common/footer.jsx';

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
  });

  const fetchProperties = async (newPage = 1, newFilters = filters) => {
    setIsLoading(true);
    try {
      const res = await api.get('/properties/buy', {
        params: {
          page: newPage,
          ...newFilters,

        },
      });

      const newProperties = res?.data?.properties || [];
      setProperties(newPage === 1 ? newProperties : [...properties, ...newProperties]);
      setHasMore(res?.data?.hasMore ?? false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]); // Clear properties on error
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]); // Re-fetch when filters change

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage); // Fetch the next page
  };

  const propertyTypes = [
    { id: 'APARTMENT', name: 'Apartment' },
    { id: 'HOUSE', name: 'House' },
    { id: 'COMMERCIAL', name: 'Commercial' },
    { id: 'LAND', name: 'Land' },
  ];

  // Custom disclosure component to replace headlessUI
  const Disclosure = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="py-6 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-gray-400 hover:text-gray-500"
        >
          <span className="font-medium text-gray-900 flex items-center">
            {icon}
            {title}
          </span>
          <ChevronDown
            className={`${isOpen ? 'transform rotate-180' : ''} h-5 w-5 transition-transform duration-200`}
          />
        </button>
        {isOpen && <div className="pt-6">{children}</div>}
      </div>
    );
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-10 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Properties for Sale
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Find your dream property in the most desirable locations
            </p>
          </div>

          {/* Mobile filter dialog */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 flex z-40 lg:hidden">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-25"
                onClick={() => setMobileFiltersOpen(false)}
              />

              {/* Slide-in panel */}
              <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Mobile filters */}
                <div className="mt-4 border-t border-gray-200">
                  <Disclosure
                    title="Property Type"
                    icon={<Home className="h-4 w-4 mr-2 text-gray-500" />}
                  >
                    <div className="space-y-4">
                      {propertyTypes.map(option => (
                        <div key={option.id} className="flex items-center">
                          <input
                            id={`filter-mobile-${option.id}`}
                            name="propertyType"
                            value={option.id}
                            type="radio"
                            checked={filters.propertyType === option.id}
                            onChange={e => setFilters({ ...filters, propertyType: e.target.value })}
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-mobile-${option.id}`}
                            className="ml-3 min-w-0 flex-1 text-gray-500"
                          >
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Disclosure>
                </div>
              </div>
            </div>
          )}

          <div className="pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="hidden lg:block">
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-500" />
                    Filters
                  </h3>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      Location
                    </h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="location"
                        value={filters.location}
                        onChange={e => setFilters({ ...filters, location: e.target.value })}
                        placeholder="Enter location"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Price Range
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="min-price" className="sr-only">
                          Minimum Price
                        </label>
                        <input
                          type="number"
                          id="min-price"
                          name="minPrice"
                          value={filters.minPrice}
                          onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                          placeholder="Min"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="max-price" className="sr-only">
                          Maximum Price
                        </label>
                        <input
                          type="number"
                          id="max-price"
                          name="maxPrice"
                          value={filters.maxPrice}
                          onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                          placeholder="Max"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <Home className="h-4 w-4 mr-2 text-gray-500" />
                      Property Type
                    </h3>
                    <div className="mt-2 space-y-3">
                      {propertyTypes.map(option => (
                        <div key={option.id} className="flex items-center">
                          <input
                            id={`filter-${option.id}`}
                            name="propertyType"
                            value={option.id}
                            type="radio"
                            checked={filters.propertyType === option.id}
                            onChange={e => setFilters({ ...filters, propertyType: e.target.value })}
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${option.id}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setFilters({
                          location: '',
                          minPrice: '',
                          maxPrice: '',
                          propertyType: '',
                        });
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Reset all filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Property listing */}
              <div className="lg:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center lg:hidden text-gray-500 hover:text-gray-700"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <Filter className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Filters</span>
                    </button>
                  </div>
                </div>

                {isLoading && page === 1 ? (
                  <div className="text-center py-12">
                    <Loader className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-gray-500">Loading properties...</p>
                  </div>
                ) : (
                  <>
                    {properties.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {properties.map(property => (
                          <PropertyCardBuySale key={property.id} property={property} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow p-12 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No properties found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your search filters to find more properties.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                    >
                      {isLoading && page > 1 ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Loading...
                        </>
                      ) : (
                        'Load More Properties'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Buy;
