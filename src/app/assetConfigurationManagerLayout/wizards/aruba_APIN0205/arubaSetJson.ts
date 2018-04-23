export var ARUBASETJSON=
  {
  "global": {
    "dhcp": {
      "pools": [
        {
          "id": 1502354073040,
          "poolName": "pool1",
          "network": "192.168.0.0",
          "subnet": "255.255.255.0",
          "gateway": "192.168.0.1",
          "poolType": "Local",
          "vlan": 2,
          "excludeAddress": "192.168.0.2",
          "dnsServer": "8.8.8.8",
          "domainName": "jkj",
          "leaseTime": 12
        }
      ]
    },
    "radiusTemplate": {
      "radiusTemplates": [
        {
          "id": 1502354120906,
          "radiusTemplate": "radius1",
          "sharedKey": "123456",
          "authPort": 15,
          "acctPort": 4,
          "serverIP": "125.16.32.2",
          "name": "radius1"
        }
      ]
    },
    "routes": {
      "routes": [
        {
          "id": 1502354256104,
          "destinationIP": "6.6.6.6",
          "subnet": "255.255.255.0",
          "gateway": "6.3.6.6"
        }
      ]
    }
  },
  "captivePortal": {
    "captivePortals": [
      {
        "id": 1502354162871,
        "portalName": "portal1",
        "port": 56,
        "serverAddress": "103.254.219.125",
        "portalUrl": "/captivePortal.com",
        "useHTTPs": "enable",
        "disableAutoWhitelist": "enable"
      }
    ]
  },
  "VPN": {
    "vpnPrimaryServer": "105.125.125.2",
    "vpnBackupServer": "2.2.2.2",
    "vpnIkepsk": "1234565",
    "vpnUserName": "admin",
    "vpnPassword": "admin",
    "vpnFastFailover": "enable",
    "vpnPreemption": "enable",
    "vpnHoldTime": 122,
    "reconnectUserOnFailover": "enable",
    "reconnectTimeOnFailover": 65,
    "vpnMonitorPktLostCnt": 123,
    "vpnMonitorPktSendFreq": 60
  },
  "WLAN": {
    "radioProfiles": {
      "radioDetails": [
        {
          "id": 1502354282079,
          "legacyMode": "disable",
          "frequencyType": "2.4GHz",
          "interferenceImmunityLevel": "1",
          "RF": "enable",
          "beaconPeriod": 65,
          "spectrumMonitor": "enable"
        }
      ]
    },
    "serviceSetProfiles": {
      "profileList": [
        {
          "id": 1502354332848,
          "wlanStatus": "Enabled",
          "broadcastSSID": "Enabled",
          "assetSSID": "ssid1",
          "accessType": "guest",
          "bandType": "2.4",
          "inactivityTimeout": 60,
          "dtimInterval": "1",
          "maxClientsThreshold": 65,
          "vlan": 2,
          "captivePortalType": "external",
          "portalName": "portal1",
          "radiusAccounting": "Enabled",
          "accountingMode": "user-association",
          "accountingInterval": 56,
          "authServers": [
            {
              "radiusTemplate": "radius1"
            }
          ]
        }
      ]
    }
  },
  "SNMP": {
    "snmpHostList": [
      {
        "id": 1502354373913,
        "snmpHostAddress": "3.3.3.3",
        "snmpVersion": "1",
        "snmpName": "adsfd"
      }
    ],
    "snmpCommunityList": [
      {
        "id": 1502354355631,
        "readCommunity": "adsfd"
      }
    ]
  },
  "date": "2017-08-10T08:40:03.804Z"
}