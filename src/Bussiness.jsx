import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Bussiness() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          'https://newsdata.io/api/1/news', 
          {
            params: {
              apikey: 'pub_6048140fdcde1f829a6ffc47708eeaef316ad',
              q: 'business',
              country: 'cn,in,jp,gb,us',
              language: 'en',
              category: 'business',
            }
          }
        );
        setNews(response.data.results || []);
      } catch (err) {
        setError('Error fetching news data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Empty dependency array ensures the API call is made once on mount

  return (
    <div className="container mt-5">
      {/* <h1 className="text-center">Business News</h1> */}
      {loading && <div className="text-center mt-4">Loading...</div>}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
      <div className="row">
        {news.length > 0 ? (
          news.map((article, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{article.title}</h5>
                  <p className="card-text">
                    {article.description || 'No description available.'}
                  </p>
                  {article.link && (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Read More
                    </a>
                  )}
                </div>
                {article.image_url && (
                  <img
                    src={article.image_url}
                    className="card-img-top"
                    alt="News"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center">No news to display.</p>
        )}
      </div>
    </div>
  );
}

export default Bussiness;