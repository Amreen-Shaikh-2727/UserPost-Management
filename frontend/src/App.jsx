
import { useEffect, useState } from "react";
import { addUser, addPost, getPosts, getUsers } from "./api/api";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPosts();
      setPosts(response.data);
    } catch {
      setError("Unable to load posts. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  let ignore = false;

  const fetchData = async () => {
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        getPosts(),
        getUsers(),
      ]);

      if (!ignore) {
        setPosts(postsResponse.data);
        setUsers(usersResponse.data);
        setError("");
      }
    } catch {
      if (!ignore) {
        setError("Unable to load data. Please check your backend.");
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  fetchData();

  return () => {
    ignore = true;
  };
}, []);
  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await addUser({ name, email });
      const newUser = response.data.user;

      setUsers((previousUsers) => [...previousUsers, newUser]);
      setUserId(newUser._id);
      setName("");
      setEmail("");
      setMessage("User added successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add user.");
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await addPost({ title, content, userId });

      setTitle("");
      setContent("");
      setMessage("Post created successfully!");

      await loadPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create post.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>User & Post Management</h1>
        <p>Create users, publish posts, and view their authors.</p>
      </header>

      <main className="container">
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        <div className="forms">
          <section className="panel">
            <h2>Add User</h2>

            <form onSubmit={handleAddUser}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit">Add User</button>
            </form>
          </section>

          <section className="panel">
            <h2>Create Post</h2>

            <form onSubmit={handleAddPost}>
              <label htmlFor="title">Post Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                placeholder="Write your post"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />

              <label htmlFor="user">Select Author</label>
              <select
                id="user"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">Choose a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              <button type="submit">Publish Post</button>
            </form>
          </section>
        </div>

        <section className="posts-section">
          <div className="posts-heading">
            <h2>All Posts</h2>
            <button className="refresh-button" onClick={loadPosts}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="status">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="status">No posts found. Create your first post!</p>
          ) : (
            <div className="posts">
              {posts.map((post) => (
                <article className="post-card" key={post._id}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>

                  <div className="author">
                    <strong>Author:</strong>{" "}
                    {post.user?.name || "Unknown user"}
                  </div>

                  <div className="author">
                    <strong>Email:</strong>{" "}
                    {post.user?.email || "Not available"}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
