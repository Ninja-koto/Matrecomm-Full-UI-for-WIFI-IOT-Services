export const VEHICLELAYOUT_MENU = [
  {
    path: 'vehicle',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'Vehicle Dashboard',
            icon: 'fa fa-dashboard',
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
        path: 'manager',
        data: {
          menu: {
            title: 'Vehicle Wi-Fi Management',
            icon: 'fa fa-bus',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'customizedCaptivePortal',
        data: {
          menu: {
            title: 'Portal Settings',
            icon: 'fa fa-cogs',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'userManagement',
        data: {
          menu: {
            title: 'Vehicle User Management',
            icon: 'fa fa-user',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'historicalLogs',
        data: {
          menu: {
            title: 'Historical Logs',
            icon: 'fa fa-tasks',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
      ]
  }
];