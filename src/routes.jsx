import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <DashboardApp /> },
      ],
    },
    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        { path: 'user-role', element: <DashboardApp /> },
        { path: 'user-list', element: <DashboardApp /> },
        { path: 'user-list', element: <DashboardApp /> },
      ],
    },
    {
      path: '/master-data',
      element: <DashboardLayout />,
      children: [
        { path: 'category', element: <DashboardApp /> },
        { path: 'site-location', element: <DashboardApp /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
