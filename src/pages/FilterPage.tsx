import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cdnImage, setCdnImage] = useState("");
  const [seoInfo, setSeoInfo] = useState({ title: "", description: "" });

  // States cho filters
  const [typeList, setTypeList] = useState("");
  const [hasSelectedType, setHasSelectedType] = useState(false);
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [sortField, setSortField] = useState("modified.time");
  const [sortType, setSortType] = useState("desc");
  const [sortLang, setSortLang] = useState("");

  // States cho danh sách categories và countries
  const [categories, setCategories] = useState<
    { name: string; slug: string }[]
  >([]);
  const [countries, setCountries] = useState<{ name: string; slug: string }[]>(
    []
  );

  // Xử lý URL parameter từ Header
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    if (typeFromUrl) {
      setTypeList(typeFromUrl);
      setHasSelectedType(true);
    }
  }, [searchParams]);

  // Fetch categories và countries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, countriesRes] = await Promise.all([
          fetch("http://localhost:4000/api/categories"),
          fetch("http://localhost:4000/api/country"),
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

  // Fetch movies dựa trên filters
  useEffect(() => {
    const fetchMovies = async () => {
      if (!typeList) return; // Chỉ fetch khi đã chọn type_list

      try {
        setIsLoading(true);
        const filters: { [key: string]: string } = {
          page: currentPage.toString(),
          limit: "30",
        };

        if (category) filters.category = category;
        if (country) filters.country = country;
        if (year) filters.year = year;
        if (sortLang) filters.sort_lang = sortLang;
        if (sortField) filters.sort_field = sortField;
        if (sortType) filters.sort_type = sortType;

        const queryParams = new URLSearchParams(filters).toString();
        const url = `http://localhost:4000/api/movies/${typeList}?${queryParams}`;

        console.log("Fetching URL:", url);

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
  }, [
    currentPage,
    typeList,
    category,
    country,
    year,
    sortField,
    sortType,
    sortLang,
  ]);

  const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => 2025 - i);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTypeList(value);
    setHasSelectedType(!!value);
    setCurrentPage(1);
    // Reset other filters when changing type
    setCategory("");
    setCountry("");
    setYear("");
    setSortField("modified.time");
    setSortType("desc");
    setSortLang("");

    // Cập nhật URL parameter
    if (value) {
      setSearchParams({ type: value });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange =
    (setter: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setCurrentPage(1);
    };

  return (
    <div className="p-6">
      {/* Type List Selection - Always visible */}
      <div className="mb-8">
        <select
          value={typeList}
          onChange={handleTypeChange}
          className="w-full md:w-1/2 lg:w-1/3 bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors text-lg"
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
      </div>

      {/* Additional Filters - Only show after type_list is selected */}
      {hasSelectedType && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <select
            value={category}
            onChange={handleFilterChange(setCategory)}
            className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={country}
            onChange={handleFilterChange(setCountry)}
            className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <option value="">Tất cả quốc gia</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={handleFilterChange(setYear)}
            className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <option value="">Tất cả năm</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={sortField}
            onChange={handleFilterChange(setSortField)}
            className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <option value="modified.time">Thời gian cập nhật</option>
            <option value="_id">ID Phim</option>
            <option value="year">Năm phát hành</option>
          </select>

          <select
            value={sortType}
            onChange={handleFilterChange(setSortType)}
            className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      )}

      {/* Show SEO info only after type selection */}
      {hasSelectedType && seoInfo.title && (
        <>
          <h1 className="text-3xl font-bold text-white mb-2">
            {seoInfo.title}
          </h1>
          <p className="text-gray-400 mb-6">{seoInfo.description}</p>
        </>
      )}

      {/* Movies grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 h-[300px] rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      ) : !hasSelectedType ? (
        <div className="text-center text-gray-400 mt-10">
          Vui lòng chọn loại phim
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`${cdnImage}/${movie.poster_url}`}
                  alt={movie.name}
                  className="w-full h-[300px] object-cover transform transition-transform group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-medium truncate">
                    {movie.name}
                  </h3>
                  <p className="text-gray-300 text-sm truncate">
                    {movie.origin_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-600 rounded-full text-white">
                      {movie.quality}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-600 rounded-full text-white">
                      {movie.lang}
                    </span>
                  </div>
                </div>
                {movie.episode_current && (
                  <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-red-600 rounded-full text-white">
                    {movie.episode_current}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-10">
          Không tìm thấy phim phù hợp với bộ lọc
        </div>
      )}

      {/* Pagination */}
      {hasSelectedType && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-500 hover:bg-gray-700 transition-colors"
          >
            <FaChevronLeft />
          </button>
          <span className="text-white">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-800 text-white disabled:bg-gray-700 disabled:text-gray-500 hover:bg-gray-700 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterPage;
