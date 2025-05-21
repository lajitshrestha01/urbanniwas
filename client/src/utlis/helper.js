export const formatPrice = price => {
  return new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Format area with proper unit
export const formatArea = area => {
  return `${area} sq.ft`;
};

// Generate URL-friendly slugs
export const generateSlug = text => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
};

// Filter properties by city
export const filterPropertiesByCity = (properties, city) => {
  return properties.filter(property =>
    property.location.toLowerCase().includes(city.toLowerCase())
  );
};
