import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogList = ({ posts }) => {
  const [searchItem, setSearchItem] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredPosts(filteredItems);
  };

  const storeUserSetPreference = (pref) => {
    localStorage.setItem("theme", pref);
  };

  const getUserSetPreference = () => {
    return localStorage.getItem("theme");
  };

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    storeUserSetPreference(newTheme);
    document.body.dataset.theme = theme;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const userSetPreference = getUserSetPreference();

    if (userSetPreference) {
      setTheme(userSetPreference);
    }
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <div className="bloglist-topContainer">
        <section className="blogList-container">
          <section className="header">
            <div>
              <h1>Blog List</h1>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
              <i
                className={
                  menuOpen
                    ? "fa-solid fa-square-xmark close-btn"
                    : "fa-solid fa-bars"
                }
              ></i>
            </div>

            {menuOpen && (
              <div className="nav">
                <div className="nav-links-mobile">
                  <div className="search-bar-mobile">
                    <input
                      type="text"
                      id="search"
                      className="search"
                      placeholder="Search title"
                      value={searchItem}
                      onChange={handleInputChange}
                    />
                    <button className="searchBtn">Search</button>
                  </div>

                  <button className="themeBtn" onClick={handleToggle}>
                    {theme === "light" ? (
                      <span>
                        <i className="fa-solid fa-sun"></i>&nbsp; Light Mode
                      </span>
                    ) : (
                      <span>
                        <i className="fa-solid fa-moon"></i>&nbsp; Dark Mode
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {!menuOpen && (
              <>
                <div className="search-bar">
                  <input
                    type="text"
                    id="search"
                    className="search"
                    placeholder="search title"
                    value={searchItem}
                    onChange={handleInputChange}
                  />
                  <button className="searchBtn">Search</button>
                </div>

                <div className="dark-light-mode">
                  <button className="themeBtn" onClick={handleToggle}>
                    {theme === "light" ? (
                      <span>
                        <i className="fa-solid fa-sun"></i>&nbsp;
                      </span>
                    ) : (
                      <span>
                        <i className="fa-solid fa-moon"></i>&nbsp;
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="cards">
            {(searchItem ? filteredPosts : posts).map((post) => (
              <div key={post.id} className="card">
                <div className="card-container">
                  <a href={`/posts/${post.id}`} className="card-img-link">
                    <div
                      className="card-img"
                      style={{ backgroundImage: `url(${post.image})` }}
                    >
                      <span className="tag">{post.tag}</span>
                    </div>
                  </a>

                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-body">{post.body.slice(0, 35) + " ..."}</p>
                  <p className="card-date">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <Link to={`/posts/${post.id}`} className="card-link">
                    <button className="card-button">View full details</button>
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </section>
      </div>
    </>
  );
};

// Adding propTypes for validation
BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      userName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string,
      createdAt: PropTypes.string,
      slug: PropTypes.string,
    })
  ).isRequired,
};

export default BlogList;
