// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'User Management',
    icon: getIcon('eva:people-fill'),
    path: '/user',
    children: [
      {
        title: 'User Role',
        path: 'user-role'
      },
      {
        title: 'User List',
        path: 'user-list'
      }
    ]
  },
  {
    title: 'Master Data',
    icon: getIcon('ic:baseline-dataset'),
    path: '/master-data',
    children: [
      {
        title: 'Item Category',
        path: 'item-category'
      },
      {
        title: 'Site Location',
        path: 'site-location'
      },
      {
        title: 'Cost Center',
        path: 'cost-center'
      },
      {
        title: 'Department',
        path: 'department'
      },
      {
        title: 'supplier',
        path: 'supplier'
      },
      {
        title: 'Pricelist',
        path: 'pricelist'
      },
      {
        title: 'Customer',
        path: 'customer'
      },
      {
        title: 'Discount',
        path: 'discount'
      },
    ]
  },
  {
    title: 'Purchase Request',
    icon: getIcon('bxs:purchase-tag'),
    path: '/purchase-request',
    children: [
      {
        title: 'Input PR',
        path: 'input-purchase-request'
      },
      {
        title: 'Approval PR',
        path: 'approval-purchase-request'
      },
    ]
  },
  {
    title: 'Purchase Order',
    icon: getIcon('icon-park-solid:transaction-order'),
    path: '/purchase-order',
    children: [
      {
        title: 'Input PO',
        path: 'input-purchase-order'
      },
      {
        title: 'Approval PO',
        path: 'approval-purchase-order'
      },
    ]
  },
  {
    title: 'Delivery Order',
    icon: getIcon('iconamoon:delivery-fill'),
    path: '/delivery-order',
    children: [
      {
        title: 'DO Masuk',
        path: 'do-masuk'
      },
      {
        title: 'DO Keluar',
        path: 'do-keluar'
      },
      {
        title: 'Approval DO',
        path: 'do-approval'
      },
    ]
  },
  {
    title: 'Meal Sheet',
    icon: getIcon('game-icons:meal'),
    path: '/meal-sheet',
    children: [
      {
        title: 'Sheet Detail',
        path: 'sheet-detail'
      },
      {
        title: 'Sheet Summary',
        path: 'sheet-summary'
      },
    ]
  },
  {
    title: 'Stock Management',
    icon: getIcon('iconamoon:box-fill'),
    path: '/stock-management',
    children: [
      {
        title: 'Stock',
        path: 'stock'
      },
      {
        title: 'Stock Opname',
        path: 'stock-opname'
      },
    ]
  },
  {
    title: 'Activity Log',
    path: '/activity-log',
    icon: getIcon('material-symbols:browse-activity-sharp'),
  },
  {
    title: 'Report',
    icon: getIcon('icon-park-solid:table-report'),
    path: '/report',
    children: [
      {
        title: 'PR Report',
        path: 'pR-report'
      },
      {
        title: 'PO Report',
        path: 'po-report'
      },
      {
        title: 'DO Report',
        path: 'Do-report'
      },
      {
        title: 'Meal Sheet Report',
        path: 'meal-report'
      },
      {
        title: 'Stock Report',
        path: 'stock-report'
      },
    ]
  },

];

export default navConfig;
