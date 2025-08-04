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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    danhMuc: false,
    theLoai: false,
    quocGia: false,
  });

  // Danh sách các type_list
  const typeList = [
    { value: "phim-bo", name: "Phim Bộ" },
    { value: "phim-le", name: "Phim Lẻ" },
    { value: "tv-shows", name: "TV Shows" },
    { value: "hoat-hinh", name: "Hoạt Hình" },
    { value: "phim-vietsub", name: "Phim Vietsub" },
    { value: "phim-thuyet-minh", name: "Phim Thuyết Minh" },
    { value: "phim-long-tieng", name: "Phim Lồng Tiếng" },
  ];

  useEffect(() => {
    // Fetch categories
    fetch("https://my-movies-be.onrender.com/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch countries
    fetch("https://my-movies-be.onrender.com//api/country")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleMobileDropdownToggle = (dropdown: keyof typeof mobileDropdowns) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const closeMobileMenuAndDropdowns = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdowns({
      danhMuc: false,
      theLoai: false,
      quocGia: false,
    });
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
<div className="flex items-center space-x-2">
  <Link
    to="/"
    onClick={closeMobileMenuAndDropdowns}
    className="flex items-center group"
  >
    <span className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent transform transition-transform hover:scale-105 duration-300 drop-shadow-lg font-['Montserrat',sans-serif] tracking-wider">
      CineStream
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
            
            {/* Danh mục Dropdown */}
            <li className="relative group">
              <div className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-green-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full cursor-pointer flex items-center gap-2">
                Danh mục
              </div>
              <div className="absolute top-full left-0 mt-2 w-[320px] bg-gray-800 rounded-lg shadow-xl py-2 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                {typeList.map((type) => (
                  <Link
                    key={type.value}
                    to={`/filter?type=${type.value}`}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            </li>

            {/* Categories Dropdown */}
            <li className="relative group">
              <div className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full cursor-pointer flex items-center gap-2">
                Thể Loại
              </div>
              <div className="absolute top-full right-0 mt-2 w-[480px] bg-gray-800 rounded-lg shadow-xl py-2 z-50 grid grid-cols-3 gap-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/filter?category=${category.slug}`}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </li>

            {/* Countries Dropdown */}
            <li className="relative group">
              <div className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-pink-400 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full cursor-pointer flex items-center gap-2">
                Quốc Gia
              </div>
              <div className="absolute top-full right-0 mt-2 w-[480px] bg-gray-800 rounded-lg shadow-xl py-2 z-50 grid grid-cols-3 gap-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                {countries.map((country) => (
                  <Link
                    key={country._id}
                    to={`/filter?country=${country.slug}`}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 md:hidden z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenuAndDropdowns}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                Trang chủ
              </Link>

              {/* Mobile Danh mục */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMobileDropdownToggle("danhMuc")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  <span>Danh mục</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileDropdowns.danhMuc ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileDropdowns.danhMuc && (
                  <div className="pl-4 py-2 space-y-1 bg-gray-700 rounded-md mt-1">
                    {typeList.map((type) => (
                      <Link
                        key={type.value}
                        to={`/filter?type=${type.value}`}
                        onClick={closeMobileMenuAndDropdowns}
                        className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-600 hover:text-white rounded-md"
                      >
                        {type.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Categories */}
              <div className="space-y-1">
                <button
                  onClick={() => handleMobileDropdownToggle("theLoai")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  <span>Thể Loại</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileDropdowns.theLoai ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileDropdowns.theLoai && (
                  <div className="pl-4 py-2 space-y-1 bg-gray-700 rounded-md mt-1">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/filter?category=${category.slug}`}
                        onClick={closeMobileMenuAndDropdowns}
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
                  onClick={() => handleMobileDropdownToggle("quocGia")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  <span>Quốc Gia</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileDropdowns.quocGia ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileDropdowns.quocGia && (
                  <div className="pl-4 py-2 space-y-1 bg-gray-700 rounded-md mt-1">
                    {countries.map((country) => (
                      <Link
                        key={country._id}
                        to={`/filter?country=${country.slug}`}
                        onClick={closeMobileMenuAndDropdowns}
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