import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import './ManageSpots.css'

function ManageSpots() {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="manage-spots-container">
            <div className="manage-spots-header">
                <h2>Manage Your Spots</h2>
                <div>
                    {sessionUser && (
                        <div>
                            <NavLink to="/spots/new" className="create-spot-link">Create a New Spot</NavLink>
                        </div>

                    )}
                </div>
            </div>
        </div>

    );
}

export default ManageSpots;
