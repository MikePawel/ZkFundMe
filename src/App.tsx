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
                        <img src="src/assets/LOGO.svg" alt="Logo" className="logo" />
                    </div>
                </Link>
            </div>

            <div className="content">
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
            </div>


                <nav className="footer">
                    <ul>
                        <li>
                            <Link to="/Home">Home</Link>
                        </li>
                        <li>
                            <Link to="/Create">Campagne Create</Link>
                        </li>
                        <li>
                            <Link to="/Details">Campagne Details</Link>
                        </li>
                        <li>
                            <Link to="/List">Campagne List</Link>
                        </li>
                        <li>
                            <Link to="/Test">Test</Link>
                        </li>
                        <li>
                            <Link to="/TestMetamask">TestMetamask</Link>
                        </li>
                    </ul>
                </nav>
        </>
    )
}

export default App;
