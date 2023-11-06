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
        title: 'Item Product',
        path: 'item-product'
      },
      {
        title: 'Client',
        path: 'client'
      },
      {
        title: 'Site Location',
        path: 'site-location'
      },
      // {
      //   title: 'Cost Center',
      //   path: 'cost-center'
      // },
      {
        title: 'Department',
        path: 'department'
      },
      {
        title: 'supplier',
        path: 'supplier'
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
    title: 'Quotation',
    icon: getIcon('ph:note'),
    path: '/quotation',
  },
  {
    title: 'Purchase Request',
    icon: getIcon('bxs:purchase-tag'),
    path: '/purchase-request/input-purchase-request',
  },
  {
    title: 'Purchase Order',
    icon: getIcon('icon-park-solid:transaction-order'),
    path: '/purchase-order',
    children: [
      {
        title: 'PO Masuk',
        path: 'po-masuk'
      },
      {
        title: 'PO Catering',
        path: 'po-catering'
      },
      {
        title: 'PO Keluar Quotation',
        path: 'po-quotation'
      },
      // {
      //   title: 'Approval PO',
      //   path: 'approval-purchase-order'
      // },
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
        title: 'DO Catering',
        path: 'do-catering'
      },
      {
        title: 'DO Keluar Food Supply',
        path: 'do-food'
      },
      // {
      //   title: 'Approval DO',
      //   path: 'do-approval'
      // },
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
    ]
  },
  {
    title: 'Stock Management',
    icon: getIcon('iconamoon:box-fill'),
    path: '/stock-management',
    children: [
      {
        title: 'Data Stock Masuk', // Tampilan mengikuti form excel stock management
        path: 'data-stock-masuk'
      },
      {
        title: 'Data Stock Kapal',
        path: 'data-stock-kapal'
      },
    ]
  },
  {
    title: 'Activity Log',
    path: '/activity-log',
    icon: getIcon('material-symbols:browse-activity-sharp'),
  },
  // {
  //   title: 'Report',
  //   icon: getIcon('icon-park-solid:table-report'),
  //   path: '/report',
  //   children: [
  //     {
  //       title: 'PR Report',
  //       path: 'pR-report'
  //     },
  //     {
  //       title: 'PO Report',
  //       path: 'po-report'
  //     },
  //     {
  //       title: 'DO Report',
  //       path: 'Do-report'
  //     },
  //     {
  //       title: 'Meal Sheet Summary',
  //       path: 'meal-report'
  //     },
  //     {
  //       title: 'Stock Report',
  //       path: 'stock-report'
  //     },
  //   ]
  // },

];

export default navConfig;
