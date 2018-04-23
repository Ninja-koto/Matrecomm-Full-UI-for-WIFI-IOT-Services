export const DASHBOARDLAYOUT_MENU = [
  {
    path: 'serviceProvider',
    children: [
      {
        path: 'home',
        data: {
          menu: {
            title: 'ServiceProvider Home',
            icon: 'fa fa-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }]
  },
  {
    path: 'serviceProviderDashboardLayout',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'Dashboard',
            icon: 'fa fa-dashboard',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
    ]
  }
];
