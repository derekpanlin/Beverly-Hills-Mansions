import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { CiHome } from "react-icons/ci";
import './Navigation.css';


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    console.log(sessionUser);

    return (
        <nav className="nav-bar">
            <ul className="nav-list">
                <li>
                    <NavLink to="/"><CiHome className="home-icon" size={30} /></NavLink>
                </li>
            </ul>
            <div className="nav-right">
                {isLoaded && (
                    <>
                        {sessionUser && (
                            <div>
                                <NavLink to="/spots/new" className="create-spot-link">Create a New Spot</NavLink>
                            </div>

                        )}
                        < div className="profile-button-container">
                            <ProfileButton user={sessionUser} />
                        </div>
                    </>
                )}
            </div>
        </nav >
    );
}

export default Navigation;
