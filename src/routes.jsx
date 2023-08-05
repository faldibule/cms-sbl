import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// Not Auth
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';

// ----------------------------------------------------------------------
import DashboardApp from './pages/DashboardApp';
import ActivityLog from './pages/activity-log'

// Purchase Request
import InputPurchaseRequest from './pages/purchase-request/input-purchase-request'
import AddInputPurchaseRequest from './pages/purchase-request/input-purchase-request/Add'
import EditInputPurchaseRequest from './pages/purchase-request/input-purchase-request/Edit'

import ApprovalPurchaseRequest from './pages/purchase-request/approval-purchase-request'
import EditApprovalPurchaseRequest from './pages/purchase-request/approval-purchase-request/Edit'

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
      path: '/purchase-request',
      element: <DashboardLayout />,
      children: [
        // input PR
        { path: 'input-purchase-request', element: <InputPurchaseRequest /> },
        { path: 'input-purchase-request/add', element: <AddInputPurchaseRequest /> },
        { path: 'input-purchase-request/edit/:id', element: <EditInputPurchaseRequest /> },

        // Approval PR
        { path: 'approval-purchase-request', element: <ApprovalPurchaseRequest /> },
        { path: 'approval-purchase-request/edit/:id', element: <EditApprovalPurchaseRequest /> },
      ],
    },
    {
      path: '/activity-log',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <ActivityLog /> },
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
