import PropTypes from "prop-types";
import BlogList from "./BlogList";
import { useFetch } from "./useFetch";
import Pagination from "./Pagination";
import { useState } from "react";

const Home = () => {
  const {
    data: posts,
    isPending,
    error,
  } = useFetch("http://localhost:8000/posts");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts
    ? posts.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <section className="homeContainer">
        {error && <p>{error}</p>}
        {isPending && <p>Loading posts...</p>}
        {posts && <BlogList posts={currentPosts} />}
      </section>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      userName: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
      createdAt: PropTypes.string,
      slug: PropTypes.string,
    })
  ).isRequired,
};

export default Home;
