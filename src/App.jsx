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

  const textColor = bg === 'white' ? '#1a1a1a' : '#f0f0f0';
  const cardBg = bg === 'white' ? '#ffffff' : '#1e1e1e';

  const API_KEY = import.meta.env.VITE_API_KEY;

  const debouncedSearch = useDebounce(searchQuery, 600);

  // GNews specific endpoints
  const currentUrl = debouncedSearch 
    ? `https://gnews.io/api/v4/search?q=${debouncedSearch}&apikey=${API_KEY}&lang=en`
    : `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&apikey=${API_KEY}&lang=en`;

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
          {searchQuery && <p className="search-status">Results for: <strong>{searchQuery}</strong></p>}
          
          {loading && <div className="loader">Updating your feed...</div>}
          
          {/* We only show the error if we don't have any data to display */}
          {error && !data && <p className="error-msg">⚠️ {error === "Fetch failed: 429" ? "API Limit Reached (Daily limit is 100)" : error}</p>}
          
          <div className="news_grid">
            {data?.articles?.map((article, index) => (
              <div key={index} className="news_card" style={{ backgroundColor: cardBg }}>
                <div className="card-img">
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'} 
                    alt="news" 
                  />
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span className="source-tag">{article.source?.name || "News"}</span>
                  </div>
                  <h3 className="card-title" style={{ color: textColor }}>{article.title?.slice(0, 70)}...</h3>
                  <p className="card-desc" style={{ color: textColor }}>{article.description?.slice(0, 100) || "Read the full story to get the latest updates on this topic."}...</p>
                  
                  {/* SLICK BUTTON ADDED HERE */}
                  <a href={article.url} target="_blank" rel="noreferrer" className="read-more-btn">
                    Read Full Story
                  </a>
                </div>
              </div>
            ))}
          </div>

          {!loading && data?.articles?.length === 0 && (
            <div className="no-results">
              <h3>No results found.</h3>
              <p>Try different keywords or check your connection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App