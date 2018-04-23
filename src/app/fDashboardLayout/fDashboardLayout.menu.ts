export const FDASHBOARDLAYOUT_MENU = [
  /*{
    path: 'org',
    children: [
      {
        path: ['only/manager'],
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
  },*/
  {
    path: 'org',
    children: [
  {
      path: 'onlyDashboard',
      data: {
        menu: {
          title: 'Dashboard',
          icon: 'fa fa-dashboard',
          selected: false,
          expanded: false,
          order: 0
        }
      }
    },
    {
      path: 'onlyHLogs',
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
    ]}

];
