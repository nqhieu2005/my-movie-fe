import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Interface cho một đối tượng phim
interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
  country: {
    id: string;
    name: string;
    slug: string;
  }[];
}

// Interface cho phản hồi từ API
interface ApiResponse {
  status: boolean;
  msg: string;
  data: {
    seoOnPage: {
      titleHead: string;
      descriptionHead: string;
    };
    items: Movie[];
    params: {
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

// Interface cho danh sách thể loại và quốc gia
interface FilterItem {
  name: string;
  slug: string;
}

function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [cdnImage, setCdnImage] = useState("");
    const [seoInfo, setSeoInfo] = useState({ title: "", description: "" });

    // States cho filters
    const [typeList, setTypeList] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [sortField, setSortField] = useState<string>("modified.time");
    const [sortType, setSortType] = useState<string>("desc");
    const [sortLang, setSortLang] = useState<string>("");

    // States cho danh sách categories và countries
    const [categories, setCategories] = useState<FilterItem[]>([]);
    const [countries, setCountries] = useState<FilterItem[]>([]);

    // Logic này sẽ đọc các tham số từ URL và cập nhật state tương ứng
    useEffect(() => {
        const typeFromUrl = searchParams.get("type");
        const categoryFromUrl = searchParams.get("category");
        const countryFromUrl = searchParams.get("country");
        
        // Cập nhật state nếu có tham số từ URL
        if (typeFromUrl) {
            setTypeList(typeFromUrl);
        } else if (categoryFromUrl) {
            setTypeList("phim-le"); // Gán type mặc định khi chỉ có category
        } else if (countryFromUrl) {
            setTypeList("phim-le"); // Gán type mặc định khi chỉ có country
        } else {
            setTypeList("");
        }

        if (categoryFromUrl) {
            setCategory(categoryFromUrl);
        } else {
            setCategory("");
        }

        if (countryFromUrl) {
            setCountry(countryFromUrl);
        } else {
            setCountry("");
        }

        setCurrentPage(1); 
        // Reset các filters khác để tránh xung đột
        setYear("");
        setSortField("modified.time");
        setSortType("desc");
        setSortLang("");
    }, [searchParams]);

    // Fetch categories và countries (giữ nguyên)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, countriesRes] = await Promise.all([
                    fetch("https://my-movies-be.onrender.com/api/categories"),
                    fetch("https://my-movies-be.onrender.com/api/country"),
                ]);
                const [categoriesData, countriesData] = await Promise.all([
                    categoriesRes.json(),
                    countriesRes.json(),
                ]);
                setCategories(categoriesData);
                setCountries(countriesData);
            } catch (error) {
                console.error("Error fetching filter data:", error);
            }
        };
        fetchData();
    }, []);

    // Logic fetch movies (giữ nguyên)
    useEffect(() => {
        const fetchMovies = async () => {
            if (!typeList) {
                setMovies([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const filters: { [key: string]: string } = {
                    page: currentPage.toString(),
                    limit: "30",
                    sort_field: sortField,
                    sort_type: sortType,
                };

                if (category) filters.category = category;
                if (country) filters.country = country;
                if (year) filters.year = year;
                if (sortLang) filters.sort_lang = sortLang;

                const queryParams = new URLSearchParams(filters).toString();
                const url = `https://my-movies-be.onrender.com/api/movies/${typeList}?${queryParams}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (data.status) {
                    setMovies(data.data.items);
                    setTotalPages(data.data.params.pagination.totalPages);
                    setCdnImage(data.data.APP_DOMAIN_CDN_IMAGE);
                    setSeoInfo({
                        title: data.data.seoOnPage.titleHead,
                        description: data.data.seoOnPage.descriptionHead,
                    });
                } else {
                    console.error("API Error:", data.msg);
                    setMovies([]);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage, typeList, category, country, year, sortField, sortType, sortLang]);

  const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => 2025 - i);

  // Xử lý khi thay đổi filters
  const handleFilterChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTypeList(value);
    setCurrentPage(1);
    // Reset các filter khác khi thay đổi loại phim
    setCategory("");
    setCountry("");
    setYear("");
    setSortField("modified.time");
    setSortType("desc");
    setSortLang("");

    // Cập nhật URL
    if (value) {
      setSearchParams({ type: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      {/* Filters Section */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Bộ lọc phim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Loại phim */}
          <select
            value={typeList}
            onChange={handleTypeChange}
            className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
          >
            <option value="">Chọn loại phim</option>
            <option value="phim-bo">Phim Bộ</option>
            <option value="phim-le">Phim Lẻ</option>
            <option value="tv-shows">TV Shows</option>
            <option value="hoat-hinh">Hoạt Hình</option>
            <option value="phim-vietsub">Phim Vietsub</option>
            <option value="phim-thuyet-minh">Phim Thuyết Minh</option>
            <option value="phim-long-tieng">Phim Lồng Tiếng</option>
          </select>

          {/* Các filter chỉ hiển thị khi đã chọn loại phim */}
          {typeList && (
            <>
              {/* Thể loại */}
              <select
                value={category}
                onChange={handleFilterChange(setCategory)}
                className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
              >
                <option value="">Tất cả thể loại</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Quốc gia */}
              <select
                value={country}
                onChange={handleFilterChange(setCountry)}
                className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
              >
                <option value="">Tất cả quốc gia</option>
                {countries.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Năm phát hành */}
              <select
                value={year}
                onChange={handleFilterChange(setYear)}
                className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
              >
                <option value="">Tất cả năm</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Sắp xếp */}
              <select
                value={sortField}
                onChange={handleFilterChange(setSortField)}
                className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
              >
                <option value="modified.time">Thời gian cập nhật</option>
                <option value="_id">ID Phim</option>
                <option value="year">Năm phát hành</option>
              </select>

              <select
                value={sortType}
                onChange={handleFilterChange(setSortType)}
                className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
              >
                <option value="desc">Giảm dần</option>
                <option value="asc">Tăng dần</option>
              </select>

              {/* Ngôn ngữ */}
              <select
                value={sortLang}
                onChange={handleFilterChange(setSortLang)}
                className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none"
              >
                <option value="">Tất cả ngôn ngữ</option>
                <option value="vietsub">Vietsub</option>
                <option value="thuyet-minh">Thuyết minh</option>
                <option value="long-tieng">Lồng tiếng</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Movie List Section */}
      {typeList && seoInfo.title && (
        <>
          <h1 className="text-3xl font-bold mb-2">{seoInfo.title}</h1>
          <p className="text-gray-400 mb-6">{seoInfo.description}</p>
        </>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-700 h-[300px] rounded-lg"></div>
          ))}
        </div>
      ) : !typeList ? (
        <div className="text-center text-gray-400 mt-10 text-xl">
          Vui lòng chọn loại phim để xem danh sách.
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie.slug}`}
              className="group relative block"
            >
              <div className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={`${cdnImage}/${movie.poster_url}`}
                  alt={movie.name}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white truncate">
                    {movie.name}
                  </h3>
                  <p className="text-sm text-gray-300 truncate">{movie.origin_name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-600 rounded-full text-white">
                      {movie.quality}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-600 rounded-full text-white">
                      {movie.lang}
                    </span>
                  </div>
                </div>
                {movie.episode_current && (
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 bg-red-600 rounded-full text-white font-bold">
                    {movie.episode_current}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-10 text-xl">
          Không tìm thấy phim phù hợp với bộ lọc.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-3 rounded-full bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-500 hover:bg-gray-700 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <span className="text-lg font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-3 rounded-full bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-500 hover:bg-gray-700 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterPage;