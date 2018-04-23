export const ORG_MENU = [
  /*{
    path: 'org',
    children: [
      {
        path: 'organization',
        data: {
          menu: {
            title: 'Organization Manager',
            icon: 'fa fa-building',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
    ]
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
  /*{
    path: 'dashboardLayout',
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
  },*/
  {
    path: '',
    data: {
      menu: {
        title: 'Campus',
        icon: 'fa fa-building',
        selected: false,
        expanded: false,
        order: 0
      }
    },
    children: [
      {
        path: ['/nocDashboardLayout/dashboard'],
        data: {
          menu: {
            title: 'NOC Dashboard',
            icon: 'fa fa-dashboard',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/addMgmtDashboardLayout/dashboard'],
        data: {
          menu: {
            title: 'Adds Analytics',
            icon: 'fa fa-dashboard',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/commonDashboardLayout/dashboard'],
        data: {
          menu: {
            title: 'Common Dashboard',
            icon: 'fa fa-dashboard',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/org/organization'],
        data: {
          menu: {
            title: 'Organization Manager',
            icon: 'fa fa-briefcase',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
       {
        path: '',
        data: {
          menu: {
            title: 'Assets',
            icon: 'fa fa-wifi',
            selected: false,
            expanded: false,
            order: 0
          }
        },
          children: [
          {
            path: ['/org/assetRegistration'],
            data: {
              menu: {
                title: 'Registration Manager',
                icon: 'fa fa-arrow-right'
              }
            }
          },
          {
            path: ['/org/assetConfigurationTemplates'],
            data: {
              menu: {
                title: 'Configuration Templates',
                icon: 'fa fa-arrow-right'
              }
            }
          },
          {
            path: ['/org/assetInventory'],
            data: {
              menu: {
                title: 'Inventory',
                icon: 'fa fa-arrow-right'
              }
            }
          },
          {
            path: ['/org/assetAuthorization'],
            data: {
              menu: {
                title: 'Authorization',
                icon: 'fa fa-arrow-right'
              }
            }
          },
          {
            path: ['/floorMapLayout'],
            data: {
              menu: {
                title: 'Floor Map Manager',
                icon: 'fa fa-arrow-right'
              }
            }
          },
          {   
          path: ['/assetConfigurationManagerLayout'],
          data: {
            menu: {
              title: 'Asset Configuration Manager',
              icon: 'fa fa-arrow-right'
            }
          }
        }
          
        ]
        
      },
      {
        path: ['/org/locationManagement'],
        data: {
          menu: {
            title: 'Location Management',
            icon: 'fa fa-building',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/org/alertManager'],
        data: {
          menu: {
            title: 'Alert Definitions',
            icon: 'fa fa-exclamation-triangle',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
       {
        path: ['/org/customizedCaptivePortal'],
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
        path: ['/org/eventManagement'],
        data: {
          menu: {
            title: 'Event Management',
            icon: 'fa fa-institution',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/org/apnUserManagement'],
        data: {
          menu: {
            title: 'APN User Management',
            icon: 'fa fa-user-secret',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: ['/org/userManagement'],
        data: {
          menu: {
            title: 'User Management',
            icon: 'fa fa-user',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }, {
        path: ['/org/historicalLogs'],
        data: {
          menu: {
            title: 'Historical Logs',
            icon: 'fa fa-tasks',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
       
    ]
  },
    {
    path: '',
    data: {
      menu: {
        title: 'Media',
        icon: 'fa fa-video-camera',
        selected: false,
        expanded: false,
        order: 0
      }
    },
    children: [
      {   
        path: ['/mediaMgmt/mediaStore'],
        data: {
          menu: {
            title: 'Media Store',
            icon: 'fa fa-picture-o'
          }
        }
      },
      {   
        path: ['/mediaMgmt/mediaProfile'],
        data: {
          menu: {
            title: 'Media Profile',
            icon: 'fa fa-file-video-o'
          }
        }
      },
      {   
        path: ['/mediaMgmt/mediaAssetInventory'],
        data: {
          menu: {
            title: 'Media Asset Inventory ',
            icon: 'fa fa-file-video-o'
          }
        }
      },
      {   
        path: ['/mediaMgmt/mediaAssetGroup'],
        data: {
          menu: {
            title: 'Media Asset Group ',
            icon: 'fa fa-file-video-o'
          }
        }
      },
      {   
        path: ['/mediaMgmt/mediaAssetBlock'],
        data: {
          menu: {
            title: 'Media Asset Block',
            icon: 'fa fa-file-video-o'
          }
        }
      },
      {   
        path: ['/mediaMgmt/mediaProfileDeployment'],
        data: {
          menu: {
            title: 'Media Profile Deployment',
            icon: 'fa fa-file-video-o'
          }
        }
      },
      {   
        path: ['/mediaMgmt/mediaDashboard'],
        data: {
          menu: {
            title: 'Media Dashboard',
            icon: 'ion-stats-bars'
          }
        }
      } 


    ]
  },
  {
    path: '',
    data: {
      menu: {
        title: 'Hotel',
        icon: 'fa fa-building',
        selected: false,
        expanded: false,
        order: 0
      }
    },
    children: [
      {   
        path: ['/hotelMgmt/userManagement'],
        data: {
          menu: {
            title: 'User Management',
            icon: 'fa fa-picture-o'
          }
        }
      }
    ]
  },
  {
    path: '',
    data: {
      menu: {
        title: 'Vehicles',
        icon: 'fa fa-bus',
        selected: false,
        expanded: false,
        order: 0
      }
    },
    children: [
      {   
        path: ['/org/vehicleManager'],
        data: {
          menu: {
            title: 'Vehicle Wifi Management',
            icon: 'fa fa-bus'
          }
        }
      }/*,
      {
        path: ['/vehicle/dashboard'],
        data: {
          menu: {
            title: 'Vehicle Dashboard',
            icon: 'fa fa-dashboard'
          }
        }
      }*/
    ]
  }
];
