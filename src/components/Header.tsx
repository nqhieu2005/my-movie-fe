import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Category[]>([]);
  const [isHoveringCategory, setIsHoveringCategory] = useState(false);
  const [isHoveringCountry, setIsHoveringCountry] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));

    // Fetch countries
    fetch('http://localhost:4000/api/country')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center group">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-10 w-14 object-contain transform transition-transform hover:scale-110 duration-300" 
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ml-2 hover:from-purple-500 hover:to-blue-400 transition-all duration-300">
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-8">
            <li className="relative">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-blue-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                Trang chủ
              </Link>
            </li>
            
            {/* Categories Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setIsHoveringCategory(true)}
              onMouseLeave={() => setIsHoveringCategory(false)}
            >
              <div className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full cursor-pointer flex items-center gap-2">
                Thể Loại
                <svg className={`w-4 h-4 transition-transform duration-200 ${isHoveringCategory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isHoveringCategory && (
                <div className="absolute top-full right-0 mt-2 w-[480px] bg-gray-800 rounded-lg shadow-xl py-2 z-50 grid grid-cols-3 gap-1">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/category/${category.slug}`}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Countries Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setIsHoveringCountry(true)}
              onMouseLeave={() => setIsHoveringCountry(false)}
            >
              <div className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-pink-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full cursor-pointer flex items-center gap-2">
                Quốc Gia
                <svg className={`w-4 h-4 transition-transform duration-200 ${isHoveringCountry ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isHoveringCountry && (
                <div className="absolute top-full right-0 mt-2 w-[480px] bg-gray-800 rounded-lg shadow-xl py-2 z-50 grid grid-cols-3 gap-1">
                  {countries.map((country) => (
                    <Link
                      key={country._id}
                      to={`/country/${country.slug}`}
                      className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 md:hidden z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                Trang chủ
              </Link>
              
              {/* Mobile Categories */}
              <div className="space-y-1">
                <button
                  onClick={() => setIsHoveringCategory(!isHoveringCategory)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  <span>Thể Loại</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isHoveringCategory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isHoveringCategory && (
                  <div className="pl-4 py-2 space-y-1 bg-gray-700 rounded-md mt-1">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/category/${category.slug}`}
                        className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white rounded-md"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Countries */}
              <div className="space-y-1">
                <button
                  onClick={() => setIsHoveringCountry(!isHoveringCountry)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  <span>Quốc Gia</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isHoveringCountry ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isHoveringCountry && (
                  <div className="pl-4 py-2 space-y-1 bg-gray-700 rounded-md mt-1">
                    {countries.map((country) => (
                      <Link
                        key={country._id}
                        to={`/country/${country.slug}`}
                        className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white rounded-md"
                      >
                        {country.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;