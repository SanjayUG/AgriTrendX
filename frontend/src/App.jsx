import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const featureVariants = {
  hiddenLeft: { opacity: 0, x: -100 },
  hiddenRight: { opacity: 0, x: 100 },
  hiddenBottom: { opacity: 0, y: 100 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1 } },
};

const App = () => {
  const [page, setPage] = useState("home");
  const [commodity, setCommodity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [showGraph, setShowGraph] = useState(false);

  const goToHome = () => {
    setPage("home");
  };

  const handleGoClick = () => {
    if (state && district && commodity) {
      setShowGraph(true);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container" onClick={goToHome} style={{ cursor: "pointer" }}>
          <img src="/images/logo.avif" alt="AgriTrendX Logo" className="logo" />
          <h1>AgriTrendX</h1>
        </div>
        <div className="nav-links">
          <a href="#supply" onClick={() => setPage("supply")}>Supply</a>
          <a href="#price" onClick={() => setPage("price")}>Price</a>
          <a href="#demand" onClick={() => setPage("demand")}>Demand</a>
        </div>
      </nav>

      {/* Hero Section */}
      {page === "home" && (
        <div className="hero-section" id="main">
          <motion.div 
            className="hero-content" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }}
          >
            <h1 className="hero-title" id="head">Empowering Farmers with Real-Time Insights</h1>
            <p className="hero-description" id="body">
              Unlock market trends, monitor supply and demand, and make data-driven decisions with AgriTrendX.
              Your trusted companion for smarter agricultural strategies.
            </p>
            <div className="cta-container">
              <button className="cta-btn" onClick={() => setPage("supply")}>Explore Supply</button>
              <button className="cta-btn secondary" onClick={() => setPage("price")}>Explore Price</button>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-image" 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
          >
             
          </motion.div>
        </div>
      )}

      {/* Feature Cards */}
      {page === "home" && (
        <div className="features-section">
          <motion.div className="feature-card" id="bg2" onClick={() => setPage("supply")}
            initial="hiddenLeft" whileInView="visible" variants={featureVariants} viewport={{ once: true }}>
            <h2>🌾 Real-time Supply Insights</h2>
            <p>Get real-time data on crop supply from various regions, helping you make informed decisions.</p>
          </motion.div>

          <motion.div className="feature-card" id="bg1" onClick={() => setPage("demand")}
            initial="hiddenRight" whileInView="visible" variants={featureVariants} viewport={{ once: true }}>
            <h2>📊 Accurate Demand Forecasting</h2>
            <p>Leverage AI-powered forecasting to predict future crop demands with precision.</p>
          </motion.div>

          <motion.div className="feature-card" id="bg3" onClick={() => setPage("price")}
            initial="hiddenBottom" whileInView="visible" variants={featureVariants} viewport={{ once: true }}>
            <h2>💰 Price Trends and Recommendations</h2>
            <p>Monitor price trends and receive recommendations for the best-selling opportunities.</p>
          </motion.div>
        </div>
      )}

      {/* Dropdown + Graph Section */}
      {page !== "home" && (
        <div className="graph-page">
          <h1>{page.charAt(0).toUpperCase() + page.slice(1)} Trends</h1>

          {/* Dropdowns */}
          <div className="dropdowns">
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Select State</option>
              <option value="karnataka">Karnataka</option>
              <option value="tamilnadu">Tamil Nadu</option>
              <option value="maharashtra">Maharashtra</option>
            </select>

            <select value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">Select District</option>
              <option value="bangalore">Bangalore</option>
              <option value="chennai">Chennai</option>
              <option value="mumbai">Mumbai</option>
            </select>

            <select value={commodity} onChange={(e) => setCommodity(e.target.value)}>
              <option value="">Select Commodity</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
            </select>

            <button onClick={handleGoClick}>Go</button>
          </div>

          {/* Graph Display */}
          {showGraph && (
            <div className="graph-container">
              <h2>Graph for {commodity} in {district}, {state}</h2>
              <div className="graph-placeholder">📊 Graph goes here</div>
            </div>
          )}

          {/* Back Button */}
          <button className="cta-btn" onClick={goToHome}>Back to Home</button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 AgriTrendX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;






