"use client";

import { useEffect, useState } from "react";
import { formatPhoneNumber } from "./utils/formatters";
import { filterAdvocates, Advocate } from "./utils/filtering";
import "./styles/page.css";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/advocates")
      .then((response) => response.json())
      .then((jsonResponse) => {
        const formattedData = jsonResponse.data.map((advocate: Advocate) => ({
          ...advocate,
          yearsOfExperience: String(advocate.yearsOfExperience),
          phoneNumber: String(advocate.phoneNumber)
        }));
        setAdvocates(formattedData);
        setFilteredAdvocates(formattedData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching advocates:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = filterAdvocates(advocates, searchTerm);
    setFilteredAdvocates(filtered);
  }, [searchTerm, advocates]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  return (
    <main className="container">
      <h1>Solace Advocates</h1>
      
      <div className="search-section">
        <h2 className="search-title">Search</h2>
        <p className="search-term-display">
          Searching for: <span className="search-term-highlight">{searchTerm}</span>
        </p>
        <div className="search-controls">
          <input 
            className="search-input" 
            onChange={handleSearchChange} 
            value={searchTerm}
            placeholder="Enter search term"
            aria-label="Search advocates"
          />
          <button 
            className="reset-button" 
            onClick={handleResetSearch}
            disabled={searchTerm === ""}
          >
            Reset Search
          </button>
        </div>
      </div>
      
      <div className="table-container">
        {isLoading ? (
          <div className="loading-message">Loading data...</div>
        ) : (
          <table className="advocates-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">First Name</th>
                <th className="table-header-cell">Last Name</th>
                <th className="table-header-cell">City</th>
                <th className="table-header-cell">Degree</th>
                <th className="table-header-cell" style={{ width: '50%' }}>Specialties</th>
                <th className="table-header-cell">Years of Experience</th>
                <th className="table-header-cell" style={{ width: '15%' }}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.length > 0 ? (
                filteredAdvocates.map((advocate, index) => (
                  <tr 
                    key={advocate.id || `advocate-${advocate.firstName}-${advocate.lastName}-${index}`} 
                    className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
                  >
                    <td className="table-cell">{advocate.firstName}</td>
                    <td className="table-cell">{advocate.lastName}</td>
                    <td className="table-cell">{advocate.city}</td>
                    <td className="table-cell">{advocate.degree}</td>
                    <td className="table-cell">
                      <div className="specialties-container">
                        {advocate.specialties.map((specialty, i) => (
                          <div 
                            key={`${advocate.id || index}-specialty-${i}-${specialty.replace(/\s+/g, '-')}`} 
                            className="specialty-tag"
                            title={specialty}
                          >
                            {specialty}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">{advocate.yearsOfExperience}</td>
                    <td className="table-cell">
                      <span className="phone-number">
                        {formatPhoneNumber(String(advocate.phoneNumber))}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-cell" style={{ textAlign: 'center' }}>
                    No results found. Try a different search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
