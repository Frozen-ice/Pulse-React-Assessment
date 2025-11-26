import { useState, useEffect, useCallback, useMemo } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { debounce } from '../utils/debounce';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = useCallback(async (search = searchTerm, sort = sortBy) => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        sort,
        ...(search && { search })
      };
      
      const response = await getProducts(params);
      
      if (response.success) {
        setProducts(response.data.products || []);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'An error occurred while fetching products. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((search) => {
      fetchProducts(search, sortBy);
    }, 500),
    [sortBy, fetchProducts]
  );

  useEffect(() => {
    fetchProducts();
  }, [sortBy]); // Only refetch when sortBy changes

  useEffect(() => {
    if (searchTerm !== '') {
      debouncedSearch(searchTerm);
    } else {
      fetchProducts('', sortBy);
    }
  }, [searchTerm, debouncedSearch, fetchProducts, sortBy]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    fetchProducts(searchTerm, sortBy);
  }, [searchTerm, sortBy, fetchProducts]);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleSearchInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading && products.length === 0) {
    return (
      <div className="products-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        <p className="products-subtitle">Browse our collection of products</p>
      </div>

      <div className="products-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="sort-controls">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {products.length === 0 && !loading && !error && (
        <div className="no-products">
          <p>No products found. Try adjusting your search or filters.</p>
        </div>
      )}

      {loading && products.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
