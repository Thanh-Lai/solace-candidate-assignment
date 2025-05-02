"use client";

import { useEffect, useState } from "react";
import "./styles/page.css";

interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number | string; 
  phoneNumber: string | number;
}

function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = phoneNumberString.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumberString;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
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
      })
      .catch(error => {
        console.error("Error fetching advocates:", error);
      });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = e.target.value;
    }

    if (term.trim() === "") {
      setFilteredAdvocates(advocates);
      return;
    }

    const filtered = advocates.filter((advocate) => {
      const firstName = String(advocate.firstName).toLowerCase();
      const lastName = String(advocate.lastName).toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const city = String(advocate.city).toLowerCase();
      const degree = String(advocate.degree).toLowerCase();
      const yearsOfExperience = String(advocate.yearsOfExperience).toLowerCase();
      
      const matchesBasicInfo = 
        firstName.includes(term) ||
        lastName.includes(term) ||
        fullName.includes(term) ||
        city.includes(term) ||
        degree.includes(term) ||
        yearsOfExperience.includes(term);
      
      const matchesSpecialties = advocate.specialties.some(specialty => 
        String(specialty).toLowerCase().includes(term)
      );
      
      return matchesBasicInfo || matchesSpecialties;
    });
    
    setFilteredAdvocates(filtered);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
    const searchInput = document.querySelector(".search-input") as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = "";
    }
  };

  return (
    <main className="container">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <h2 className="search-title">Search</h2>
        <p className="search-term-display">
          Searching for: <span id="search-term" className="search-term-highlight"></span>
        </p>
        <input className="search-input" onChange={onChange} value={searchTerm} />
        <button className="reset-button" onClick={onClick}>
          Reset Search
        </button>
      </div>
      <br />
      <br />
      <div className="table-container">
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
                  key={advocate.id || index} 
                  className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
                >
                  <td className="table-cell">{advocate.firstName}</td>
                  <td className="table-cell">{advocate.lastName}</td>
                  <td className="table-cell">{advocate.city}</td>
                  <td className="table-cell">{advocate.degree}</td>
                  <td className="table-cell">
                    <div className="specialties-container">
                      {advocate.specialties.map((specialty, i) => (
                        <div key={i} className="specialty-tag">
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
      </div>
    </main>
  );
}
