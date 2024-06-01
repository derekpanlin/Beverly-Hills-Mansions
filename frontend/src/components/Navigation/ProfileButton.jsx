import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { RxAvatar } from "react-icons/rx";
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();


    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const profileDropdownClass = "profile-dropdown" + (showMenu ? "" : " hidden");


    return (
        <div className="profile-button-container">
            <button onClick={toggleMenu}>
                <RxAvatar size={40} />
            </button>
            <ul className={profileDropdownClass} ref={ulRef}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </div>
    );
}




export default ProfileButton;
