import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  
import Auth from './pages/auth';
import Home from './pages/home';
import CreateNote from './pages/createNote';

function App() {

  return (
    <>
    <Router>
      {/* <Navbar/> */}
      <Routes>
        {/* Element is the component that is rendered when going to path.  */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/createnote" element={<CreateNote />} />
      </Routes>
    </Router>
    </>
  )
}

export default App