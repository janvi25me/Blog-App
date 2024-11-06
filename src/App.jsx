import "./App.css";
import Home from "./Components/Home";
import BlogDetails from "./Components/BlogDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Fragment } from "react";
// import ScrollButton from "./Components/ScrollButton";
// import { Content } from "./Components/styles";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Fragment>
            <Content /> */}
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<BlogDetails />} />
          {/* <ScrollButton /> */}
          {/* </Fragment> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
