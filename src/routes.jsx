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

// Internal Order -------------------------------------------------------

// ----- PR Catering -----
import PRCatering from './pages/internal-order/pr-catering'
import AddPRCatering from './pages/internal-order/pr-catering/Add'
import EditPRCatering from './pages/internal-order/pr-catering/Edit'

// ----- PO Catering -----
import POCatering from './pages/internal-order/po-catering'
import AddPOCatering from './pages/internal-order/po-catering/Add'
import EditPOCatering from './pages/internal-order/po-catering/Edit'

// ----- PO Supplier Catering -----
import POSupplierCatering from './pages/internal-order/po-supplier-catering'
import AddPOSupplierCatering from './pages/internal-order/po-supplier-catering/Add'
import EditPOSupplierCatering from './pages/internal-order/po-supplier-catering/Edit'

// ----- DO Catering -----
import DOCatering from './pages/internal-order/do-catering'
import AddDOCatering from './pages/internal-order/do-catering/Add'
import EditDOCatering from './pages/internal-order/do-catering/Edit'

// ----------------------------------------------------------------------


// Eksternal Order -------------------------------------------------------

// ----- PR Customer ------
import PRCustomer from './pages/external-order/pr-customer'
import AddPRCustomer from './pages/external-order/pr-customer/Add'
import EditPRCustomer from './pages/external-order/pr-customer/Edit'

// ----- Quotation ------
import Quotation from './pages/external-order/quotation'
import AddQuotation from './pages/external-order/quotation/Add'
import EditQuotation from './pages/external-order/quotation/Edit'

// ----- PO Customer ------
import POCustomer from './pages/external-order/po-customer'
import AddPOCustomer from './pages/external-order/po-customer/Add'
import EditPOCustomer from './pages/external-order/po-customer/Edit'

// ----- PO Supplier Customer -----
import POSupplierCustomer from './pages/external-order/po-supplier-customer'
import AddPOSupplierCustomer from './pages/external-order/po-supplier-customer/Add'
import EditPOSupplierCustomer from './pages/external-order/po-supplier-customer/Edit'

// ----- DO Catering -----
import DOCustomer from './pages/external-order/do-customer'
import AddDOCustomer from './pages/external-order/do-customer/Add'
import EditDOCustomer from './pages/external-order/do-customer/Edit'

// ----------------------------------------------------------------------


// Purchase Request
import InputPurchaseRequest from './pages/purchase-request/input-purchase-request'
import AddInputPurchaseRequest from './pages/purchase-request/input-purchase-request/Add'
import EditInputPurchaseRequest from './pages/purchase-request/input-purchase-request/Edit'



// Purchase Order
import POMasuk from './pages/purchase-order/po-masuk'
import AddPOMasuk from './pages/purchase-order/po-masuk/Add'
import EditPOMasuk from './pages/purchase-order/po-masuk/Edit'

// import POCatering from './pages/purchase-order/po-catering'
// import AddPOCatering from './pages/purchase-order/po-catering/Add'
// import EditPOCatering from './pages/purchase-order/po-catering/Edit'

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

import MealSheetReport from './pages/meal-sheet/meal-sheet-report'

import MealSheetDetail from './pages/meal-sheet/meal-sheet-detail'
import AddMealSheetDetail from './pages/meal-sheet/meal-sheet-detail/Add'
import EditMealSheetDetail from './pages/meal-sheet/meal-sheet-detail/Edit'

import PrintPreviewMealSheetDetail from './pages/print-preview/meal-sheet-detail'
import PrintPreviewMealSheetMonthly from './pages/print-preview/meal-sheet-monthly'

// Stock Management
import StockManagement from './pages/stock-management'
import StockByLocation from './pages/stock-management/stock-by-location'

import StockDetailProduct from './pages/stock-management/stock-by-location/product/detail'
import AddMOR from './pages/stock-management/stock-by-location/mor/Add'
import EditMORDaily from './pages/stock-management/stock-by-location/mor/Edit'

// File Management
import FileManagement from './pages/file-management/Edit'

export default function Router() {
    return useRoutes([
        {
            path: "login",
            element: (
                <Middleware.Before>
                    <Login />,
                </Middleware.Before>
            ),
        },
        // {
        //   path: 'register',
        //   element: <Register />,
        // },
        {
            path: "/dashboard",
            element: (
                <Middleware.After>
                    <DashboardLayout />
                </Middleware.After>
            ),
            children: [{ path: "", element: <DashboardApp /> }],
        },
        {
            path: "/file/:id/:reference_type",
            element: (
                <Middleware.After>
                    <DashboardLayout />
                </Middleware.After>
            ),
            children: [{ path: "", element: <FileManagement /> }],
        },
        {
            path: "/user",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [
                { path: "user-role", element: <UserRole /> },
                { path: "user-list", element: <UserList /> },
                { path: "user-list/add", element: <AddUserList /> },
                { path: "user-list/edit/:id", element: <EditUserList /> },
            ],
        },
        {
            path: "/master-data",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [
                { path: "item-category", element: <ItemCategory /> },
                { path: "item-product", element: <ItemProduct /> },
                { path: "item-product/add", element: <AddItemProduct /> },
                { path: "item-product/edit/:id", element: <EditItemProduct /> },
                { path: "client", element: <Client /> },
                { path: "site-location", element: <SiteLocation /> },
                { path: "cost-center", element: <CostCenter /> },
                { path: "department", element: <Department /> },
                { path: "supplier", element: <Supplier /> },
                { path: "pricelist", element: <Pricelist /> },
                { path: "discount", element: <Discount /> },
                { path: "customer", element: <Customer /> },
            ],
        },

        {
            path: "/internal-order",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [
                // PR Catering
                { path: "pr-catering", element: <PRCatering /> },
                { path: "pr-catering/add", element: <AddPRCatering /> },
                { path: "pr-catering/edit/:id", element: <EditPRCatering /> },

                // PO Catering
                { path: "po-catering", element: <POCatering /> },
                { path: "po-catering/add", element: <AddPOCatering /> },
                { path: "po-catering/edit/:id", element: <EditPOCatering /> },

                // PO Supplier Catering
                { path: "po-supplier-catering", element: <POSupplierCatering />, },
                { path: "po-supplier-catering/add", element: <AddPOSupplierCatering />, },
                { path: "po-supplier-catering/edit/:id", element: <EditPOSupplierCatering />, },

                // DO Catering
                { path: "do-catering", element: <DOCatering /> },
                { path: "do-catering/add", element: <AddDOCatering /> },
                { path: "do-catering/edit/:id", element: <EditDOCatering /> },
            ],
        },

        {
            path: "/external-order",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [
                // PR Catering
                { path: "pr-customer", element: <PRCustomer /> },
                { path: "pr-customer/add", element: <AddPRCustomer /> },
                { path: "pr-customer/edit/:id", element: <EditPRCustomer /> },

                // PR Catering
                { path: "quotation", element: <Quotation /> },
                { path: "quotation/add", element: <AddQuotation /> },
                { path: "quotation/edit/:id", element: <EditQuotation /> },

                // PO Customer
                { path: "po-customer", element: <POCustomer /> },
                { path: "po-customer/add", element: <AddPOCustomer /> },
                { path: "po-customer/edit/:id", element: <EditPOCustomer /> },

                // PO Supplier Customer
                { path: "po-supplier-customer", element: <POSupplierCustomer />, },
                { path: "po-supplier-customer/add", element: <AddPOSupplierCustomer />, },
                { path: "po-supplier-customer/edit/:id", element: <EditPOSupplierCustomer />, },

                // DO Customer
                { path: "do-customer", element: <DOCustomer /> },
                { path: "do-customer/add", element: <AddDOCustomer /> },
                { path: "do-customer/edit/:id", element: <EditDOCustomer /> },
            ],
        },

// ------------------------- OLD Menu -------------------------
        // {
        //     path: "/purchase-request",
        //     element: (
        //         <Middleware.After>
        //             <DashboardLayout />,
        //         </Middleware.After>
        //     ),
        //     children: [
        //         // input PR
        //         {
        //             path: "input-purchase-request",
        //             element: <InputPurchaseRequest />,
        //         },
        //         {
        //             path: "input-purchase-request/add",
        //             element: <AddInputPurchaseRequest />,
        //         },
        //         {
        //             path: "input-purchase-request/edit/:id",
        //             element: <EditInputPurchaseRequest />,
        //         },
        //     ],
        // },
        // {
        //     path: "/quotation",
        //     element: (
        //         <Middleware.After>
        //             <DashboardLayout />,
        //         </Middleware.After>
        //     ),
        //     children: [
        //         // input PR
        //         { path: "", element: <Quotation /> },
        //         { path: "add", element: <AddQuotation /> },
        //         { path: "edit/:id", element: <EditQuotation /> },
        //     ],
        // },
        // {
        //     path: "/purchase-order",
        //     element: (
        //         <Middleware.After>
        //             <DashboardLayout />,
        //         </Middleware.After>
        //     ),
        //     children: [
        //         // PO-Masuk
        //         { path: "po-masuk", element: <POMasuk /> },
        //         { path: "po-masuk/add", element: <AddPOMasuk /> },
        //         { path: "po-masuk/edit/:id", element: <EditPOMasuk /> },

        //         // PO-Catering
        //         { path: "po-catering", element: <POCatering /> },
        //         { path: "po-catering/add", element: <AddPOCatering /> },
        //         { path: "po-catering/edit/:id", element: <EditPOCatering /> },

        //         // PO-Quotation
        //         { path: "po-quotation", element: <POQuotation /> },
        //         { path: "po-quotation/add", element: <AddPOQuotation /> },
        //         { path: "po-quotation/edit/:id", element: <EditPOQuotation /> },
        //     ],
        // },
        // {
        //     path: "/delivery-order",
        //     element: (
        //         <Middleware.After>
        //             <DashboardLayout />,
        //         </Middleware.After>
        //     ),
        //     children: [
        //         // DO Masuk
        //         { path: "do-masuk", element: <DeliveryOrderMasuk /> },
        //         { path: "do-masuk/add", element: <AddDeliveryOrderMasuk /> },
        //         {
        //             path: "do-masuk/edit/:id",
        //             element: <EditDeliveryOrderMasuk />,
        //         },

        //         // DO Quotation
        //         { path: "do-catering", element: <DeliveryOrderCatering /> },
        //         {
        //             path: "do-catering/add",
        //             element: <AddDeliveryOrderCatering />,
        //         },
        //         {
        //             path: "do-catering/edit/:id",
        //             element: <EditDeliveryOrderCatering />,
        //         },

        //         // DO Keluar Food Supply
        //         { path: "do-food", element: <DeliveryOrderFood /> },
        //         { path: "do-food/add", element: <AddDeliveryOrderFood /> },
        //         {
        //             path: "do-food/edit/:id",
        //             element: <EditDeliveryOrderFood />,
        //         },
        //     ],
        // },
// ------------------------- OLD Menu -------------------------

        {
            path: "/meal-sheet",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [
                { path: "group", element: <MealSheatGroup /> },
                { path: "group/add", element: <AddMealSheatGroup /> },
                { path: "group/edit/:id", element: <EditMealSheatGroup /> },

                {
                    path: "report/:group_id/daily",
                    element: <MealSheetReport />,
                },
                {
                    path: "report/:group_id/monthly",
                    element: <MealSheetReport />,
                },

                {
                    path: "detail/:group_id/:daily_id",
                    element: <MealSheetDetail />,
                },
                {
                    path: "detail/:group_id/:daily_id/add",
                    element: <AddMealSheetDetail />,
                },
                {
                    path: "detail/:group_id/:daily_id/edit/:id",
                    element: <EditMealSheetDetail />,
                },

                {
                    path: "print-preview/daily/:group_id/:daily_id/:id",
                    element: <PrintPreviewMealSheetDetail />,
                },
                {
                    path: "print-preview/monthly/:group_id/:id",
                    element: <PrintPreviewMealSheetMonthly />,
                },
            ],
        },
        {
            path: "/activity-log",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [{ path: "", element: <ActivityLog /> }],
        },
        {
            path: "/stock-management",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [
                { path: "", element: <StockManagement /> },
                {
                    path: "stock-by-location/:location_id/product",
                    element: <StockByLocation />,
                },
                {
                    path: "stock-by-location/:location_id/detail/:item_product_id",
                    element: <StockDetailProduct />,
                },

                {
                    path: "stock-by-location/:location_id/mor",
                    element: <StockByLocation />,
                },
                {
                    path: "stock-by-location/:location_id/mor/add",
                    element: <AddMOR />,
                },
                {
                    path: "stock-by-location/:location_id/mor/edit/:date",
                    element: <EditMORDaily />,
                },
            ],
        },
        {
            path: "/logout",
            element: (
                <Middleware.After>
                    <Logout />
                </Middleware.After>
            ),
        },
        {
            path: "/",
            element: <LogoOnlyLayout />,
            children: [
                { path: "/", element: <Navigate to="/login" /> },
                { path: "404", element: <NotFound /> },
                { path: "*", element: <Navigate to="/404" /> },
            ],
        },
        {
            path: "*",
            element: <Navigate to="/404" replace />,
        },
    ]);
}
