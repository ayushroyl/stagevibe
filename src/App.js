import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from './components/Nav.jsx';
import Home from './pages/Home.js';
import About from './components/About.jsx';
import Team from './components/Team.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {" "}
                <Home /> <About /> <Team />{" "}
              </>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
