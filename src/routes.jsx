import { Navigate, useRoutes } from 'react-router-dom';
import Middleware from './middleware'

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// Not Auth
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/Page404';
import Register from './pages/Register';

// ----------------------------------------------------------------------
import DashboardApp from './pages/DashboardApp';
import ActivityLog from './pages/activity-log'

// User Management
import UserRole from './pages/user-management/user-role'
import UserList from './pages/user-management/user-list'
import AddUserList from './pages/user-management/user-list/Add'
import EditUserList from './pages/user-management/user-list/Edit'

// Master Data
import ItemProduct from './pages/master-data/item-product'
import AddItemProduct from './pages/master-data/item-product/Add'
import EditItemProduct from './pages/master-data/item-product/Edit'

import ItemCategory from './pages/master-data/item-category'
import SiteLocation from './pages/master-data/site-location'
import Client from './pages/master-data/client'
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

// Quotation
import Quotation from './pages/quotation'
import AddQuotation from './pages/quotation/Add'
import EditQuotation from './pages/quotation/Edit'

// Purchase Order
import POMasuk from './pages/purchase-order/po-masuk'
import AddPOMasuk from './pages/purchase-order/po-masuk/Add'
import EditPOMasuk from './pages/purchase-order/po-masuk/Edit'

import POCatering from './pages/purchase-order/po-catering'
import AddPOCatering from './pages/purchase-order/po-catering/Add'
import EditPOCatering from './pages/purchase-order/po-catering/Edit'

import POQuotation from './pages/purchase-order/po-quotation'
import AddPOQuotation from './pages/purchase-order/po-quotation/Add'
import EditPOQuotation from './pages/purchase-order/po-quotation/Edit'

// Delivery Order
// DO Masuk
import DeliveryOrderMasuk from './pages/delivery-order/do-masuk'
import AddDeliveryOrderMasuk from './pages/delivery-order/do-masuk/Add'
import EditDeliveryOrderMasuk from './pages/delivery-order/do-masuk/Edit'

// Do Catering
import DeliveryOrderCatering from './pages/delivery-order/do-catering'
import AddDeliveryOrderCatering from './pages/delivery-order/do-catering/Add'
import EditDeliveryOrderCatering from './pages/delivery-order/do-catering/Edit'

// DO Keluar Food
import DeliveryOrderFood from './pages/delivery-order/do-food'
import AddDeliveryOrderFood from './pages/delivery-order/do-food/Add'
import EditDeliveryOrderFood from './pages/delivery-order/do-food/Edit'

// Sheet Detail
import MealSheatGroup from './pages/meal-sheet/meal-sheet-group'
import AddMealSheatGroup from './pages/meal-sheet/meal-sheet-group/Add'
import EditMealSheatGroup from './pages/meal-sheet/meal-sheet-group/Edit'

import MealSheetDaily from './pages/meal-sheet/meal-sheet-daily'

import MealSheetDetail from './pages/meal-sheet/meal-sheet-detail'
import AddMealSheetDetail from './pages/meal-sheet/meal-sheet-detail/Add'
import EditMealSheetDetail from './pages/meal-sheet/meal-sheet-detail/Edit'

// File Management
import FileManagement from './pages/file-management/Edit'

export default function Router() {
  return useRoutes([
    {
      path: 'login',
      element:
      <Middleware.Before>
        <Login />,
      </Middleware.Before> 
    },
    // {
    //   path: 'register',
    //   element: <Register />,
    // },
    {
      path: '/dashboard',
      element: 
        <Middleware.After>
          <DashboardLayout />
        </Middleware.After>,
      children: [
        { path: '', element: <DashboardApp /> },
      ],
    },
    {
      path: '/file/:id/:reference_type',
      element: 
        <Middleware.After>
          <DashboardLayout />
        </Middleware.After>,
      children: [
        { path: '', element: <FileManagement /> },
      ],
    },
    {
      path: '/user',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        { path: 'user-role', element: <UserRole /> },
        { path: 'user-list', element: <UserList /> },
        { path: 'user-list/add', element: <AddUserList /> },
        { path: 'user-list/edit/:id', element: <EditUserList /> },
      ],
    },
    {
      path: '/master-data',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>, 
      children: [
        { path: 'item-category', element: <ItemCategory /> },
        { path: 'item-product', element: <ItemProduct /> },
        { path: 'item-product/add', element: <AddItemProduct /> },
        { path: 'item-product/edit/:id', element: <EditItemProduct /> },
        { path: 'client', element: <Client /> },
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
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        // input PR
        { path: 'input-purchase-request', element: <InputPurchaseRequest /> },
        { path: 'input-purchase-request/add', element: <AddInputPurchaseRequest /> },
        { path: 'input-purchase-request/edit/:id', element: <EditInputPurchaseRequest /> },
      ],
    },
    {
      path: '/quotation',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        // input PR
        { path: '', element: <Quotation /> },
        { path: 'add', element: <AddQuotation /> },
        { path: 'edit/:id', element: <EditQuotation /> },
      ],
    },
    {
      path: '/purchase-order',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        // PO-Masuk
        { path: 'po-masuk', element: <POMasuk /> },
        { path: 'po-masuk/add', element: <AddPOMasuk /> },
        { path: 'po-masuk/edit/:id', element: <EditPOMasuk /> },

        // PO-Catering
        { path: 'po-catering', element: <POCatering /> },
        { path: 'po-catering/add', element: <AddPOCatering /> },
        { path: 'po-catering/edit/:id', element: <EditPOCatering /> },

        // PO-Quotation
        { path: 'po-quotation', element: <POQuotation /> },
        { path: 'po-quotation/add', element: <AddPOQuotation /> },
        { path: 'po-quotation/edit/:id', element: <EditPOQuotation /> },
        
      ],
    },
    {
      path: '/delivery-order',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        // DO Masuk
        { path: 'do-masuk', element: <DeliveryOrderMasuk /> },
        { path: 'do-masuk/add', element: <AddDeliveryOrderMasuk /> },
        { path: 'do-masuk/edit/:id', element: <EditDeliveryOrderMasuk /> },

        // DO Quotation
        { path: 'do-catering', element: <DeliveryOrderCatering /> },
        { path: 'do-catering/add', element: <AddDeliveryOrderCatering /> },
        { path: 'do-catering/edit/:id', element: <EditDeliveryOrderCatering /> },
        
        // DO Keluar Food Supply
        { path: 'do-food', element: <DeliveryOrderFood /> },
        { path: 'do-food/add', element: <AddDeliveryOrderFood /> },
        { path: 'do-food/edit/:id', element: <EditDeliveryOrderFood /> },
      ],
    },
    {
      path: '/meal-sheet',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        { path: 'group', element: <MealSheatGroup /> },
        { path: 'group/add', element: <AddMealSheatGroup /> },
        { path: 'group/edit/:id', element: <EditMealSheatGroup /> },

        { path: 'daily/:group_id', element: <MealSheetDaily /> },

        { path: 'detail/:group_id/:daily_id', element: <MealSheetDetail /> },
        { path: 'detail/:group_id/:daily_id/add', element: <AddMealSheetDetail /> },
        { path: 'detail/:group_id/:daily_id/edit/:id', element: <EditMealSheetDetail /> },
      ],
    },
    {
      path: '/activity-log',
      element: 
      <Middleware.After>
        <DashboardLayout />,
      </Middleware.After>,
      children: [
        { path: '', element: <ActivityLog /> },
      ],
    },
    {
      path: '/logout',
      element: 
      <Middleware.After>
        <Logout />
      </Middleware.After>,
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
