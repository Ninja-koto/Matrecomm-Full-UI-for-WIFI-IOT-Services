export const SERVICEPROVIDER_MENU = [
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
      },
      {
        path: 'manager',
        data: {
          menu: {
            title: 'ServiceProvider Manager',
            icon: 'fa fa-briefcase',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/serviceProviderDashboardLayout/dashboard'],
        data: {
          menu: {
            title: 'ServiceProvider Dashboard',
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
