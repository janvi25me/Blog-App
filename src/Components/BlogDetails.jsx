import { Link, useParams } from "react-router-dom";
import { useFetch } from "./useFetch";
const BlogDetails = () => {
  const { id } = useParams();
  const { data, isPending, error } = useFetch(
    `http://localhost:8000/posts/${id}`
  );

  return (
    <>
      <section className="details-container">
        {isPending && <p>Loading blog details...</p>}
        {error && <p>{error}</p>}
        {data ? (
          <>
            <Link className="backBtn" to="/">
              <i className="fa-solid fa-house"></i>
              {/* Home */}
            </Link>
            <h2>Posted by: {data.user}</h2>
            <h3>{data.title}</h3>
            <div className="data-img">
              <img src={data.image} alt={data.title} />
            </div>
            <p className="detail-body">{data.body}</p>

            <p>{data.tag}</p>

            <p>
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                day: "numeric",
                month: "long",
              })}
            </p>
          </>
        ) : (
          !isPending && <p>Blog post not found.</p>
        )}
      </section>
    </>
  );
};

export default BlogDetails;
