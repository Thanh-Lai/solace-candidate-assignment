/**
 * Interface for advocate data
 */
export interface Advocate {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number | string;
  phoneNumber: string | number;
}

/**
 * Filters advocates based on a search term
 * @param advocates - Array of advocates to filter
 * @param searchTerm - Term to search for
 * @returns Filtered array of advocates
 */
export function filterAdvocates(advocates: Advocate[], searchTerm: string): Advocate[] {
  if (!searchTerm || searchTerm.trim() === "") {
    return advocates;
  }

  const term = searchTerm.toLowerCase();
  
  return advocates.filter((advocate) => {
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
} 