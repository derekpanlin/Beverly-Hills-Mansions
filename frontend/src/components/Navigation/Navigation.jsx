import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { CiHome } from "react-icons/ci";
import './Navigation.css';


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <nav className="nav-bar">
            <ul className="nav-list">
                <li>
                    <NavLink to="/"><CiHome className="home-icon" size={30} /></NavLink>
                </li>
            </ul>
            {isLoaded && (
                <div className="profile-button-container">
                    <ProfileButton user={sessionUser} />
                </div>
            )}
        </nav>
    );
}

export default Navigation;
