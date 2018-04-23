export const NOCDASHBOARDLAYOUT_MENU = [
    {
      path: 'org',
      children: [
        {
          path: 'orgHome',
          data: {
            menu: {
              title: 'Organization Home',
              icon: 'fa fa-home',
              selected: false,
              expanded: false,
              order: 0
            }
          }
        }]
    },
    {
      path: 'nocDashboardLayout',
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
  