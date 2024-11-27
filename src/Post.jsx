import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Post() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [title, setTitle] = useState("");
  const [newPost, setNewPost] = useState("");
  const [media, setMedia] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const maxChars = 280;

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "" || (newPost.trim() === "" && !media)) {
      alert("Title and post content cannot be empty!");
      return;
    }

    if (editingPost) {
      const updatedPosts = posts.map((post) =>
        post.id === editingPost.id
          ? { ...post, title: title.trim(), content: newPost, media }
          : post
      );
      setPosts(updatedPosts);
      alert("Post updated successfully!");
      setEditingPost(null);
    } else {
      const post = {
        id: Date.now(),
        title: title.trim(),
        content: newPost,
        media,
        timestamp: new Date().toISOString(),
      };
      setPosts([post, ...posts]);
    }

    setTitle("");
    setNewPost("");
    setMedia(null);
    setCharCount(0);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setNewPost(post.content);
    setMedia(post.media);
  };

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center" style={{ color: '#6b4423' }}>{editingPost ? "Edit Post" : "Create Post"}</h1>

      <form onSubmit={handlePostSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-3"
          rows="3"
          placeholder="What's happening?"
          value={newPost}
          onChange={(e) => {
            const input = e.target.value;
            if (input.length <= maxChars) {
              setNewPost(input);
              setCharCount(input.length);
            }
          }}
        ></textarea>
        <div className="text-end">
          <small>{charCount}/{maxChars}</small>
        </div>
        <input
          type="file"
          accept="image/,video/"
          className="form-control mb-3"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setMedia({ type: file.type, src: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button type="submit" className="btn" style={{ backgroundColor: '#D2B48C', color: '#fff' }}>
          {editingPost ? "Update Post" : "Post"}
        </button>
      </form>

      <div className="mt-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search posts"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <h2 className="mt-5" style={{ color: '#6b4423' }}>Posts</h2>
      {filteredPosts.length > 0 ? (
        <ul className="list-group">
          {filteredPosts.map((post) => (
            <li key={post.id} className="list-group-item">
              <h5 style={{ color: '#6b4423' }}>{post.title}</h5>
              <p>{post.content}</p>
              {post.media && (
                <>
                  {post.media.type.startsWith('image/') && (
                    <img src={post.media.src} alt="Post media" className="img-fluid" />
                  )}
                  {post.media.type.startsWith('video/') && (
                    <video src={post.media.src} controls className="img-fluid" />
                  )}
                </>
              )}
              <small className="text-muted">{new Date(post.timestamp).toLocaleString()}</small>
              <div className="mt-2">
                <button
                  className="btn btn-secondary btn-sm me-2"
                  style={{ backgroundColor: '#D2B48C', color: '#fff' }}
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found!</p>
      )}
    </div>
  );
}

export default Post;