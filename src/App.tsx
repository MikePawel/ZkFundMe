import './App.css'
import { Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CampagneCreate from './pages/CampagneCreate';
import CampagneDetails from './pages/CampagneDetails';
import CampagneList from './pages/CampagneList';
import NotFound from './pages/NotFound';
import Test from './pages/Test';
import Test2 from './pages/Test2';
import Picture_Upload from './components/Picture_Upload';
import TetsMetamask from './pages/TetsMetamask';


const App = () => {

    
    return (
        <>
            <div className="header">
                <div className="space-header"></div>
                <Link to="/Home" className="logo-link">
                    <div className="logo">
                        <img src="src/assets/logo.png" alt="Logo" className="logo" />
                    </div>
                </Link>
            </div>

                <Routes>
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Create" element={<CampagneCreate />} />
                    {/* <Route path="/Details" element={<CampagneDetails />} /> */}
                    <Route path="/TestMetamask" element={<TetsMetamask/>}/>
                    <Route path="/Details/:id" element={<CampagneDetails/>}/>
                    <Route path="/List" element={<CampagneList />} />
                    <Route path="/Test/:id" element={<Test />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

        </>
    )
}

export default App;
