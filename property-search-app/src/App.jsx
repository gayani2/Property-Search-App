import React, {useState,useEffect} from 'react';
import { Home ,search} from 'lucide-react';
import './App.css';


const PropertySearchApp = () => {
    const [properties,setProperties] =useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
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
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PropertySearchApp;