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

// Master Data
// Item Category
import ItemCategory from './pages/master-data/item-category'
import SiteLocation from './pages/master-data/site-location'
import CostCenter from './pages/master-data/cost-center'
import Department from './pages/master-data/department'
import Supplier from './pages/master-data/supplier'
import Pricelist from './pages/master-data/pricelist'
import Discount from './pages/master-data/discount'
import Customer from './pages/master-data/customer'

// Purchase Request
import InputPurchaseRequest from './pages/purchase-request/input-purchase-request'
import AddInputPurchaseRequest from './pages/purchase-request/input-purchase-request/Add'
import EditInputPurchaseRequest from './pages/purchase-request/input-purchase-request/Edit'

import ApprovalPurchaseRequest from './pages/purchase-request/approval-purchase-request'
import EditApprovalPurchaseRequest from './pages/purchase-request/approval-purchase-request/Edit'

// Purchase Order
import InputPurchaseOrder from './pages/purchase-order/input-purchase-order'
import AddInputPurchaseOrder from './pages/purchase-order/input-purchase-order/Add'
import EditInputPurchaseOrder from './pages/purchase-order/input-purchase-order/Edit'

import ApprovalPurchaseOrder from './pages/purchase-order/approval-purchase-order'
import EditApprovalPurchaseOrder from './pages/purchase-order/approval-purchase-order/Edit'

// Delivery Order
import DeliveryOrderKeluar from './pages/delivery-order/do-keluar'
import AddDeliveryOrderKeluar from './pages/delivery-order/do-keluar/Add'
import EditDeliveryOrderKeluar from './pages/delivery-order/do-keluar/Edit'

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
        { path: 'item-category', element: <ItemCategory /> },
        { path: 'site-location', element: <SiteLocation /> },
        { path: 'cost-center', element: <CostCenter /> },
        { path: 'department', element: <Department /> },
        { path: 'supplier', element: <Supplier /> },
        { path: 'pricelist', element: <Pricelist /> },
        { path: 'discount', element: <Discount /> },
        { path: 'customer', element: <Customer /> },
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
      path: '/purchase-order',
      element: <DashboardLayout />,
      children: [
        // input PR
        { path: 'input-purchase-order', element: <InputPurchaseOrder /> },
        { path: 'input-purchase-order/add', element: <AddInputPurchaseOrder /> },
        { path: 'input-purchase-order/edit/:id', element: <EditInputPurchaseOrder /> },

        // Approval PR
        { path: 'approval-purchase-order', element: <ApprovalPurchaseOrder /> },
        { path: 'approval-purchase-order/edit/:id', element: <EditApprovalPurchaseOrder /> },
      ],
    },
    {
      path: '/delivery-order',
      element: <DashboardLayout />,
      children: [
        // DO Masuk
        { path: 'do-masuk', element: <DeliveryOrderKeluar /> },
        
        // DO Keluar
        { path: 'do-keluar', element: <DeliveryOrderKeluar /> },
        { path: 'do-keluar/add', element: <AddDeliveryOrderKeluar /> },
        { path: 'do-keluar/edit/:id', element: <EditDeliveryOrderKeluar /> },

        // Do Approval
        { path: 'do-approval', element: <DeliveryOrderKeluar /> },
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
