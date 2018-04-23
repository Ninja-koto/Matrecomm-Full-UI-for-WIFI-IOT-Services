export const DASHBOARDLAYOUT_MENU = [
  {
    path: 'vehicle',
    children: [
      {
        path: 'manager',
        data: {
          menu: {
            title: 'Vehicle Wi-Fi Manager',
            icon: 'fa fa-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }]
  },
  {
    path: 'vehicle',
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
