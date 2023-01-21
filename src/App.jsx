import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Draw from './pages/Draw';
import Logo from './pages/Logo';
import UploadImg from './components/UploadImg';
import UploadLogo from './components/UploadLogo';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence>
          <Routes>
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/home" element={<Home></Home>}></Route>
            <Route path="/about" element={<About></About>}></Route>
            <Route path="/contact" element={<Contact></Contact>}></Route>
            <Route path="/draw" element={<Draw></Draw>}></Route>
            <Route path="/logo" element={<Logo></Logo>}></Route>
            <Route path='/uploaddraw' element={<UploadImg></UploadImg>}></Route>
            <Route path='/uploadlogo' element={<UploadLogo></UploadLogo>}></Route>
            <Route path="/*" element={<NotFound></NotFound>}></Route>
          </Routes>
        </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
