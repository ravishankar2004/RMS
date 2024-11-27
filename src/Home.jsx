import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [posts, setPosts] = useState([]);

  const buttonStyle = {
    backgroundColor: '#fdfaf1',
    border: '1px solid #d2b48c',
    color: '#d2b48c',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const hoverButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#d2b48c',
    color: '#fff',
  };

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  return (
    <div className="container mt-4 mx-6" style={{ backgroundColor: '#f5f5dc' }}>
      <div className="row">
        {/* Sidebar - Trending Topics */}
        <div className="col-md-4"> {/* Increased column width */}
          <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#fff' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#d2b48c', fontSize: '2rem' }}>
                Trending Topics
              </h5>
              <div className="d-flex flex-column">
                {['technology', 'sports', 'politics', 'entertainment', 'bussiness'].map((topic, index) => (
                  <Link to={`/${topic}`} key={index}>
                    <img
                      src={`/${topic}.png`}
                      alt={`#${topic}`}
                      className="mb-3"
                      style={{
                        width: '100%',
                        height: '75px',
                        border: '1px solid #d2b48c',
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="col-md-8"> {/* Adjusted width to balance layout */}
          {/* Post Input */}
          <div className="card mb-3 shadow-sm border-0" style={{ backgroundColor: '#fff' }}>
            <div className="card-body">
              <p className="mt-0 pt-4 mx-5" style={{ color: '#D2B48C', fontSize: '2rem' }}>
                What's on your mind?
              </p>
              <Link to="/post">
                <button
                  className="btn mt-2 float-end"
                  style={{ backgroundColor: '#d2b48c', color: '#fff' }}
                  onMouseEnter={() => setHoveredButton('post')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Post
                </button>
              </Link>
            </div>
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="card mb-3 shadow-sm border-0" style={{ backgroundColor: '#fff' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src="https://via.placeholder.com/50"
                      alt="User"
                      className="rounded-circle me-2"
                      style={{ width: '50px', height: '50px' }}
                    />
                    <h6 className="mb-0" style={{ color: '#d2b48c' }}>
                      {post.title}
                    </h6>
                  </div>
                  <p>{post.content}</p>
                  {post.media && (
                    <div>
                      {post.media.type.startsWith('image/') && (
                        <img src={post.media.src} alt="Post media" className="img-fluid" />
                      )}
                      {post.media.type.startsWith('video/') && (
                        <video src={post.media.src} controls className="img-fluid" />
                      )}
                    </div>
                  )}
                  <small className="text-muted">{new Date(post.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
