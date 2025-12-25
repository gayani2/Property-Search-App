import React, { useState, useEffect } from 'react';
import { Heart, X, Trash2, Search, MapPin, Home, Bed, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import './App.css';

/**
 * PROPERTY SEARCH APPLICATION
 * Complete real estate search and listing application
 *
 * Features:
 * - Load properties from JSON file
 * - Multi-criteria search (type, price, bedrooms, location)
 * - Favourites system with localStorage
 * - Drag and drop to add/remove favourites
 * - Image gallery with 6-8 images per property
 * - Tabs for description, floor plan, and map
 * - Responsive design for mobile and desktop
 */

const PropertySearchApp = () => {
    // State variables
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [draggedProperty, setDraggedProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search filters
    const [filters, setFilters] = useState({
        type: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        location: ''
    });

    // Load properties from JSON file on component mount
    useEffect(() => {
        setLoading(true);
        fetch('/properties.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load properties');
                return response.json();
            })
            .then(data => {
                setProperties(data.properties);
                setFilteredProperties(data.properties);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading properties:', error);
                setError('Failed to load properties. Please ensure properties.json exists in the public folder.');
                setLoading(false);
            });
    }, []);

    // Load favourites from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('propertyFavourites');
        if (saved) {
            try {
                setFavourites(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading favourites:', e);
            }
        }
    }, []);

    // Save favourites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('propertyFavourites', JSON.stringify(favourites));
    }, [favourites]);

    // Search handler - filters properties based on criteria
    const handleSearch = (e) => {
        e.preventDefault();
        let results = [...properties];

        if (filters.type) {
            results = results.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
        }
        if (filters.minPrice) {
            results = results.filter(p => p.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            results = results.filter(p => p.price <= parseInt(filters.maxPrice));
        }
        if (filters.bedrooms) {
            results = results.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
        }
        if (filters.location) {
            results = results.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
        }

        setFilteredProperties(results);
    };

    // Reset all filters
    const handleReset = () => {
        setFilters({ type: '', minPrice: '', maxPrice: '', bedrooms: '', location: '' });
        setFilteredProperties(properties);
    };

    // Add property to favourites (prevents duplicates)
    const addToFavourites = (property) => {
        if (!favourites.find(f => f.id === property.id)) {
            setFavourites([...favourites, property]);
        }
    };

    // Remove property from favourites
    const removeFromFavourites = (id) => {
        setFavourites(favourites.filter(f => f.id !== id));
    };

    // Clear all favourites with confirmation
    const clearFavourites = () => {
        if (window.confirm('Are you sure you want to clear all favourites?')) {
            setFavourites([]);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (property) => setDraggedProperty(property);
    const handleDragOver = (e) => e.preventDefault();
    const handleDropOnFavourites = (e) => {
        e.preventDefault();
        if (draggedProperty && !favourites.find(f => f.id === draggedProperty.id)) {
            setFavourites([...favourites, draggedProperty]);
        }
        setDraggedProperty(null);
    };
    const handleDropRemove = (e) => {
        e.preventDefault();
        if (draggedProperty) removeFromFavourites(draggedProperty.id);
        setDraggedProperty(null);
    };

    // Show property detail page if a property is selected
    if (selectedProperty) {
        return (
            <PropertyDetail
                property={selectedProperty}
                onBack={() => setSelectedProperty(null)}
                isFavourite={favourites.some(f => f.id === selectedProperty.id)}
                onToggleFavourite={() => {
                    if (favourites.some(f => f.id === selectedProperty.id)) {
                        removeFromFavourites(selectedProperty.id);
                    } else {
                        addToFavourites(selectedProperty);
                    }
                }}
            />
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Loading properties...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="loading-container">
                <div className="error-box">
                    <div className="error-icon">⚠️</div>
                    <h2 className="error-title">Error Loading Properties</h2>
                    <p className="error-text">{error}</p>
                    <button className="retry-button" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Main application UI
    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <h1 className="header-title">
                        <Home size={32} className="header-icon" />
                        Property Search
                    </h1>
                </div>
            </header>

            <div className="main-content">
                <div className="layout">

                    {/* Left Sidebar - Search & Favourites */}
                    <div className="sidebar">

                        {/* Search Form */}
                        <div className="card">
                            <h2 className="card-title">
                                <Search size={24} className="icon" />
                                Search Properties
                            </h2>

                            <form onSubmit={handleSearch} className="form">

                                <div className="form-group">
                                    <label className="label">Property Type</label>
                                    <select
                                        className="select"
                                        value={filters.type}
                                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                                    >
                                        <option value="">All Types</option>
                                        <option value="House">House</option>
                                        <option value="Flat">Flat</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Bungalow">Bungalow</option>
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="label">Min Price</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="£0"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Max Price</label>
                                        <input
                                            type="number"
                                            className="input"
                                            placeholder="£1,000,000"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="label">Minimum Bedrooms</label>
                                    <select
                                        className="select"
                                        value={filters.bedrooms}
                                        onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                        <option value="5">5+</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="label">Location</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Enter location..."
                                        value={filters.location}
                                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                                    />
                                </div>

                                <div className="button-group">
                                    <button type="submit" className="primary-button">Search</button>
                                    <button type="button" onClick={handleReset} className="secondary-button">Reset</button>
                                </div>
                            </form>
                        </div>

                        {/* Favourites List */}
                        <div
                            className="card"
                            onDragOver={handleDragOver}
                            onDrop={handleDropOnFavourites}
                        >
                            <div className="favourites-header">
                                <h2 className="card-title">
                                    <Heart size={24} className="icon" style={{color: '#ef4444'}} />
                                    Favourites ({favourites.length})
                                </h2>
                                {favourites.length > 0 && (
                                    <button onClick={clearFavourites} className="clear-button">
                                        <Trash2 size={16} />
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="favourites-drop-zone">
                                {favourites.length === 0 ? (
                                    <p className="empty-message">
                                        Drag properties here or click the heart icon to add favourites
                                    </p>
                                ) : (
                                    <div className="favourites-list">
                                        {favourites.map(property => (
                                            <div
                                                key={property.id}
                                                className="favourite-item"
                                                draggable
                                                onDragStart={() => handleDragStart(property)}
                                            >
                                                <div className="favourite-content" onClick={() => setSelectedProperty(property)}>
                                                    <p className="favourite-title">{property.type} - {property.bedrooms} bed</p>
                                                    <p className="favourite-location">{property.location}</p>
                                                    <p className="favourite-price">£{property.price.toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromFavourites(property.id)}
                                                    className="remove-button"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                className="remove-zone"
                                onDragOver={handleDragOver}
                                onDrop={handleDropRemove}
                            >
                                <Trash2 size={24} />
                                <p className="remove-zone-text">Drag here to remove from favourites</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Results */}
                    <div className="results-section">
                        <div className="card">
                            <h2 className="results-title">
                                {filteredProperties.length} Properties Found
                            </h2>

                            {filteredProperties.length === 0 ? (
                                <div className="no-results">
                                    <Home size={64} className="no-results-icon" />
                                    <p className="no-results-text">No properties match your search criteria</p>
                                    <button onClick={handleReset} className="primary-button">Reset Filters</button>
                                </div>
                            ) : (
                                <div className="results-grid">
                                    {filteredProperties.map(property => (
                                        <PropertyCard
                                            key={property.id}
                                            property={property}
                                            onSelect={() => setSelectedProperty(property)}
                                            onDragStart={() => handleDragStart(property)}
                                            isFavourite={favourites.some(f => f.id === property.id)}
                                            onToggleFavourite={() => {
                                                if (favourites.some(f => f.id === property.id)) {
                                                    removeFromFavourites(property.id);
                                                } else {
                                                    addToFavourites(property);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * PROPERTY CARD COMPONENT
 * Displays individual property in the search results
 */
const PropertyCard = ({ property, onSelect, onDragStart, isFavourite, onToggleFavourite }) => {
    const imageUrl = property.images?.[0] || '/images/default.jpg';

    return (
        <div
            className="property-card"
            draggable
            onDragStart={onDragStart}
        >
            <div className="image-container">
                <img
                    src={imageUrl}
                    alt={property.type}
                    className="property-image"
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite();
                    }}
                    className="heart-button"
                >
                    <Heart
                        size={20}
                        className={isFavourite ? "heart-filled" : "heart-empty"}
                    />
                </button>
            </div>

            <div className="property-card-content">
                <div className="property-card-header">
                    <span className="property-type">{property.type}</span>
                    <span className="property-tenure">{property.tenure}</span>
                </div>

                <h3 className="property-price">£{property.price.toLocaleString()}</h3>

                <div className="property-details">
                    <div className="property-detail">
                        <Bed size={16} />
                        <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="property-detail">
                        <MapPin size={16} />
                        <span>{property.location.split(',')[0]}</span>
                    </div>
                </div>

                <p className="property-description">{property.description}</p>

                <div className="property-date">
                    <Calendar size={14} />
                    <span>Added: {property.added.month} {property.added.day}, {property.added.year}</span>
                </div>

                <button onClick={onSelect} className="view-button">
                    View Details
                </button>
            </div>
        </div>
    );
};

/**
 * PROPERTY DETAIL COMPONENT
 * Full page view showing all property details with gallery and tabs
 */
const PropertyDetail = ({ property, onBack, isFavourite, onToggleFavourite }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    const images = property.images || ['/images/default.jpg'];

    const nextImage = () => setCurrentImageIndex((currentImageIndex + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);

    return (
        <div className="container">
            <header className="header">
                <div className="header-content">
                    <button onClick={onBack} className="back-button">
                        <ChevronLeft size={24} />
                        Back to Search
                    </button>
                </div>
            </header>

            <div className="detail-content">
                <div className="detail-container">

                    {/* Image Gallery */}
                    <div className="card">
                        <div className="gallery-main">
                            <img
                                src={images[currentImageIndex]}
                                alt={`Property ${currentImageIndex + 1}`}
                                className="gallery-image"
                            />

                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="gallery-button gallery-button-left">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={nextImage} className="gallery-button gallery-button-right">
                                        <ChevronRight size={24} />
                                    </button>
                                    <div className="image-counter">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="thumbnail-container">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={index === currentImageIndex ? "thumbnail-active" : "thumbnail"}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Property Info */}
                    <div className="card">
                        <div className="detail-header">
                            <div>
                                <h1 className="detail-title">{property.type} for Sale</h1>
                                <p className="detail-location">
                                    <MapPin size={20} />
                                    {property.location}
                                </p>
                            </div>
                            <button onClick={onToggleFavourite} className="detail-heart-button">
                                <Heart
                                    size={28}
                                    className={isFavourite ? "heart-filled" : "heart-empty"}
                                />
                            </button>
                        </div>

                        <div className="info-grid">
                            <div className="info-card">
                                <p className="info-label">Price</p>
                                <p className="info-value">£{property.price.toLocaleString()}</p>
                            </div>
                            <div className="info-card">
                                <p className="info-label">Bedrooms</p>
                                <p className="info-value">{property.bedrooms}</p>
                            </div>
                            <div className="info-card">
                                <p className="info-label">Tenure</p>
                                <p className="info-value">{property.tenure}</p>
                            </div>
                        </div>

                        <div className="brief-description">
                            <h3 className="brief-title">Brief Description</h3>
                            <p className="brief-text">{property.description}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="card">
                        <div className="tabs-header">
                            <button
                                className={activeTab === 'description' ? "tab-active" : "tab"}
                                onClick={() => setActiveTab('description')}
                            >
                                Full Description
                            </button>
                            <button
                                className={activeTab === 'floorplan' ? "tab-active" : "tab"}
                                onClick={() => setActiveTab('floorplan')}
                            >
                                Floor Plan
                            </button>
                            <button
                                className={activeTab === 'map' ? "tab-active" : "tab"}
                                onClick={() => setActiveTab('map')}
                            >
                                Location Map
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'description' && (
                                <div>
                                    <h3 className="tab-title">Full Property Description</h3>
                                    <p className="tab-text">{property.longDescription}</p>
                                </div>
                            )}

                            {activeTab === 'floorplan' && (
                                <div>
                                    <h3 className="tab-title">Floor Plan</h3>
                                    <div className="floor-plan-container">
                                        <img
                                            src={property.floorPlan}
                                            alt="Floor Plan"
                                            className="floor-plan-image"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'map' && (
                                <div>
                                    <h3 className="tab-title">Property Location</h3>
                                    <div className="map-container">
                                        <iframe
                                            title="Property Location"
                                            width="100%"
                                            height="450"
                                            style={{border: 0, borderRadius: '8px'}}
                                            loading="lazy"
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(property.location)}`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertySearchApp;