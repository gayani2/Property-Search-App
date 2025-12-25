import React from 'react';
import { Home } from 'lucide-react';
import './App.css';


const PropertySearchApp = () => {

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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PropertySearchApp;