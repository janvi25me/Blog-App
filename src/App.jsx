import "./App.css";
import Home from "./Components/Home";
import BlogDetails from "./Components/BlogDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollButton from "./Components/ScrollButton";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<BlogDetails />} />
        </Routes>
        <ScrollButton />
      </Router>
    </>
  );
}

export default App;
