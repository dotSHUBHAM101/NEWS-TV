import { useState } from 'react'
import './App.css'
import useNews from './Custom_hook/useNews.jsx'
import useDebounce from './Custom_hook/useDebounce.jsx'

function App() {
  const [country, setCountry] = useState('us') 
  const [category, setCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState('On')
  const [bg, setBg] = useState('white')

  // Theme Logic
  const textColor = bg === 'white' ? '#1a1a1a' : '#f0f0f0';
  const cardBg = bg === 'white' ? '#ffffff' : '#1e1e1e';

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  // Debounce the search input specifically
  const debouncedSearch = useDebounce(searchQuery, 600);

  // LOGIC: If there is a search term, use 'everything' endpoint. Otherwise, use 'top-headlines'
  const currentUrl = debouncedSearch 
    ? `https://newsapi.org/v2/everything?q=${debouncedSearch}&apiKey=${API_KEY}`
    : `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`;

  const { data, loading, error } = useNews(currentUrl);

  const toggleTheme = () => {
    if (status === 'On') {
      setStatus('Off');
      setBg('#121212'); 
    } else {
      setStatus('On');
      setBg('white'); 
    }
  }

  return (
    <div className="container" style={{ backgroundColor: bg, color: textColor }}>
      <div className="box">
        
        <header className="main-header">
          <h1 className="logo">NEWS<span>TV</span></h1>
          <button className='theme-toggle' onClick={toggleTheme}>
            {status === 'On' ? '🌙 Night' : '☀️ Day'}
          </button>
        </header>

        {/* Search Bar Section */}
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search topics (e.g. Bitcoin, AI, Cricket)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ backgroundColor: cardBg, color: textColor }}
          />
        </div>

        {/* Filters Section (Only show if not searching) */}
        {!searchQuery && (
          <nav className="filter-nav">
            <div className="categories">
              {['General', 'Business', 'Technology', 'Sports', 'Health'].map((cat) => (
                <button 
                  key={cat}
                  className={category === cat.toLowerCase() ? 'active' : ''}
                  onClick={() => setCategory(cat.toLowerCase())}
                  style={{ color: textColor }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="country-select">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                style={{ backgroundColor: cardBg, color: textColor }}
              >
                <option value="in">🇮🇳 India</option>
                <option value="us">🇺🇸 USA</option>
                <option value="gb">🇬🇧 UK</option>
                <option value="ca">🇨🇦 Canada</option>
              </select>
            </div>
          </nav>
        )}

        <div className="content_area">
          {searchQuery && <p className="search-status">Showing results for: <strong>{searchQuery}</strong></p>}
          
          {loading && <div className="loader">Scanning the globe for news...</div>}
          {error && <p className="error-msg">⚠️ Error: {error}</p>}
          
          <div className="news_grid">
            {!loading && data?.articles?.map((article, index) => (
              <div key={index} className="news_card" style={{ backgroundColor: cardBg }}>
                <div className="card-img">
                  <img 
                    src={article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop'} 
                    alt="news" 
                  />
                </div>
                <div className="card-body">
                  <span className="source-tag">{article.source.name}</span>
                  <h3 className="card-title">{article.title?.slice(0, 70)}...</h3>
                  <p className="card-desc">{article.description?.slice(0, 100) || "No description available for this breaking story."}...</p>
                  <a href={article.url} target="_blank" rel="noreferrer" className="read-more-btn">
                    Read Story →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {!loading && data?.totalResults === 0 && (
            <div className="no-results">
              <h3>No results found.</h3>
              <p>Try different keywords or check your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App