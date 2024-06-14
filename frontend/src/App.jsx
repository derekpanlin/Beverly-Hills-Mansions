// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import Spots from './components/Spots';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpotsForm from './components/CreateSpotsForm';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpotsForm from './components/UpdateSpotsForm/UpdateSpotsForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Spots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/new',
        element: <CreateSpotsForm />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotsForm />
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
