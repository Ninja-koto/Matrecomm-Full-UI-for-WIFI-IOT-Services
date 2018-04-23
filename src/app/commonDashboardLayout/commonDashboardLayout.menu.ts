export const COMMONDASHBOARDLAYOUT_MENU = [
  /*{   
        path: 'dashboardLayout',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
  }*/
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
    path: 'commonDashboardLayout',
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
