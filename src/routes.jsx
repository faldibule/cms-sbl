import { Navigate, useRoutes } from 'react-router-dom';
import Middleware from './middleware';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// Not Auth
import Login from './pages/Login';
import Logout from './pages/Logout';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------
import ActivityLog from './pages/activity-log';
import Report from './pages/report';
import DashboardApp from './pages/DashboardApp';

// User Management
import UserList from './pages/user-management/user-list';
import AddUserList from './pages/user-management/user-list/Add';
import EditUserList from './pages/user-management/user-list/Edit';
import UserRole from './pages/user-management/user-role';

// Master Data
import ItemProduct from './pages/master-data/item-product';
import AddItemProduct from './pages/master-data/item-product/Add';
import EditItemProduct from './pages/master-data/item-product/Edit';

import Client from './pages/master-data/client';
import Customer from './pages/master-data/customer';
import Department from './pages/master-data/department';
import Discount from './pages/master-data/discount';
import ItemCategory from './pages/master-data/item-category';
import SiteLocation from './pages/master-data/site-location';
import Supplier from './pages/master-data/supplier';

import Formula from './pages/master-data/formula';
import AddFormula from './pages/master-data/formula/Add';
import EditFormula from './pages/master-data/formula/Edit';

import MealRate from './pages/master-data/meal-rate';
import AddMealRate from './pages/master-data/meal-rate/Add';
import EditMealRate from './pages/master-data/meal-rate/Edit';

// Internal Order -------------------------------------------------------

// ----- PR Catering -----
import PRCatering from './pages/internal-order/pr-catering';
import AddPRCatering from './pages/internal-order/pr-catering/Add';
import EditPRCatering from './pages/internal-order/pr-catering/Edit';

// ----- History PR Catering -----
import HistoryPRCatering from './pages/internal-order/pr-catering/history-pr-catering';
import DetailHistoryPRCatering from './pages/internal-order/pr-catering/history-pr-catering/Detail';

// ----- PO Catering -----
import POCatering from './pages/internal-order/po-catering';
import AddPOCatering from './pages/internal-order/po-catering/Add';
import EditPOCatering from './pages/internal-order/po-catering/Edit';

// ----- PO Supplier Catering -----
import POSupplierCatering from './pages/internal-order/po-supplier-catering';
import AddPOSupplierCatering from './pages/internal-order/po-supplier-catering/Add';
import EditPOSupplierCatering from './pages/internal-order/po-supplier-catering/Edit';

// ----- DO Catering -----
import DOCatering from './pages/internal-order/do-catering';
import AddDOCatering from './pages/internal-order/do-catering/Add';
import EditDOCatering from './pages/internal-order/do-catering/Edit';

// ----------------------------------------------------------------------


// Eksternal Order -------------------------------------------------------

// ----- PR Customer ------
import PRCustomer from './pages/external-order/pr-customer';
import AddPRCustomer from './pages/external-order/pr-customer/Add';
import EditPRCustomer from './pages/external-order/pr-customer/Edit';

// ----- History PR Catering -----
import HistoryPRCustomer from './pages/external-order/pr-customer/history-pr-customer';
import DetailHistoryPRCustomer from './pages/external-order/pr-customer/history-pr-customer/Detail';

// ----- Quotation ------
import Quotation from './pages/external-order/quotation';
import AddQuotation from './pages/external-order/quotation/Add';
import EditQuotation from './pages/external-order/quotation/Edit';

// ----- PO Customer ------
import POCustomer from './pages/external-order/po-customer';
import AddPOCustomer from './pages/external-order/po-customer/Add';
import EditPOCustomer from './pages/external-order/po-customer/Edit';

// ----- PO Supplier Customer -----
import POSupplierCustomer from './pages/external-order/po-supplier-customer';
import AddPOSupplierCustomer from './pages/external-order/po-supplier-customer/Add';
import EditPOSupplierCustomer from './pages/external-order/po-supplier-customer/Edit';

// ----- DO Catering -----
import DOCustomer from './pages/external-order/do-customer';
import AddDOCustomer from './pages/external-order/do-customer/Add';
import EditDOCustomer from './pages/external-order/do-customer/Edit';

// ----------------------------------------------------------------------

// Sheet Detail
import MealSheatGroup from './pages/meal-sheet/meal-sheet-group';
import AddMealSheatGroup from './pages/meal-sheet/meal-sheet-group/Add';
import EditMealSheatGroup from './pages/meal-sheet/meal-sheet-group/Edit';

import MealSheetReport from './pages/meal-sheet/meal-sheet-report';

import MealSheetDetail from './pages/meal-sheet/meal-sheet-detail';
import AddMealSheetDetail from './pages/meal-sheet/meal-sheet-detail/Add';
import EditMealSheetDetail from './pages/meal-sheet/meal-sheet-detail/Edit';

import PrintPreviewMealSheetDetail from './pages/print-preview/meal-sheet-detail';
import PrintPreviewMealSheetMonthly from './pages/print-preview/meal-sheet-monthly';

// Stock Management
import StockManagement from './pages/stock-management';
import StockByLocation from './pages/stock-management/stock-by-location';

import AddMICS from './pages/stock-management/stock-by-location/mics-daily/Add';
import EditMICSDaily from './pages/stock-management/stock-by-location/mics-daily/Edit';

import AddMICSMonthly from './pages/stock-management/stock-by-location/mics-monthly/Add';
import DetailMICSMonthly from './pages/stock-management/stock-by-location/mics-monthly/Detail';

import StockDetailProduct from './pages/stock-management/stock-by-location/product/detail';

// File Management
import FileManagement from './pages/file-management/Edit';

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
                { path: "department", element: <Department /> },
                { path: "supplier", element: <Supplier /> },
                { path: "discount", element: <Discount /> },
                { path: "customer", element: <Customer /> },

                { path: "formula", element: <Formula /> },
                { path: "formula/add", element: <AddFormula /> },
                { path: "formula/edit/:id", element: <EditFormula /> },
                
                { path: "meal-rate", element: <MealRate /> },
                { path: "meal-rate/add", element: <AddMealRate /> },
                { path: "meal-rate/edit/:id", element: <EditMealRate /> },
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

                // History PR Catering
                { path: "history-pr-catering/:pr_catering_id", element: <HistoryPRCatering /> },
                { path: "history-pr-catering/:pr_catering_id/detail/:id", element: <DetailHistoryPRCatering /> },

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

                // History PR Customer
                { path: "history-pr-customer/:pr_customer_id", element: <HistoryPRCustomer /> },
                { path: "history-pr-customer/:pr_customer_id/detail/:id", element: <DetailHistoryPRCustomer /> },

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

                // MICS Daily
                {
                    path: "stock-by-location/:location_id/mics-daily",
                    element: <StockByLocation />,
                },
                {
                    path: "stock-by-location/:location_id/mics-daily/add",
                    element: <AddMICS />,
                },
                {
                    path: "stock-by-location/:location_id/mics-daily/edit/:date",
                    element: <EditMICSDaily />,
                },

                // MICS Month
                {
                    path: "stock-by-location/:location_id/mics-monthly",
                    element: <StockByLocation />,
                },
                {
                    path: "stock-by-location/:location_id/mics-monthly/add",
                    element: <AddMICSMonthly />,
                },
                {
                    path: "stock-by-location/:location_id/mics-monthly/detail/:id",
                    element: <DetailMICSMonthly />,
                },
            ],
        },
        {
            path: "/report",
            element: (
                <Middleware.After>
                    <DashboardLayout />,
                </Middleware.After>
            ),
            children: [{ path: "", element: <Report /> }],
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
