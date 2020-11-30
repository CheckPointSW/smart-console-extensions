/*******************************************************************************
 *
 * Demo file contain mock data to simulte extension behaviour
 * Names, IDs and IP address are not real and are used for demo purposes
 *
 ******************************************************************************/
import { uuid } from "smart-console-interactions";

const context = {
  extension: {
    name: "Connectivity Check",
    vendor: "extensions@checkpoint.com",
    version: "1.0"
  },
  "client-extensions-api": { version: "1.3", locale: "en-US" },
  "management-server-api": {
    url: "https://127.0.0.1:443/web_api",
    "certificate-fingerprint": {
      sha1: "B93FE25FC9A691A051FC8649C2684117213E579C"
    },
    version: "1.4",
    sid: "XAkxwATNIw7UCMnm3NlZx7CWVI39Ed6DxAZOtZhTSwg"
  },
  "work-session": {
    uid: "2d9f065d-95c1-4f45-ae05-061dbd23faf9",
    type: "session",
    domain: {
      uid: "41e821a0-3720-11e3-aa6e-0800200c9fde",
      name: "SMC User",
      "domain-type": "domain"
    },
    "meta-info": {
      lock: "unlocked",
      "validation-state": "ok",
      "last-modify-time": {
        posix: 1543855902687,
        "iso-8601": "2018-12-03T18:51+0200"
      },
      "last-modifier": "roniz",
      "creation-time": {
        posix: 1543855864126,
        "iso-8601": "2018-12-03T18:51+0200"
      },
      creator: "roniz"
    },
    tags: [],
    "read-only": true,
    comments: "",
    color: "theme-blue",
    icon: "Objects/worksession",
    state: "open",
    "user-name": "roniz",
    description: "",
    "last-login-time": {
      posix: 1543856146837,
      "iso-8601": "2018-12-03T18:55+0200"
    },
    "expired-session": false,
    application: "SmartConsole",
    changes: 0,
    "in-work": true,
    "ip-address": "10.10.10.10",
    locks: 0,
    "connection-mode": "read write",
    "session-timeout": 30
  },
  event: {
    objects: [
      {
        uid: "980c48fc-3af9-4bcd-beae-ee8055973c4a",
        name: "Corporate-GW",
        type: "simple-gateway",
        domain: {
          uid: "41e821a0-3720-11e3-aa6e-0800200c9fde",
          name: "SMC User",
          "domain-type": "domain"
        },
        "meta-info": {
          lock: "unlocked",
          "validation-state": "ok",
          "last-modify-time": {
            posix: 1544345069792,
            "iso-8601": "2018-12-09T10:44+0200"
          },
          "last-modifier": "roniz",
          "creation-time": {
            posix: 1544344961878,
            "iso-8601": "2018-12-09T10:42+0200"
          },
          creator: "roniz"
        },
        tags: [],
        "read-only": false,
        comments: "First Office gateway",
        color: "theme-blue",
        icon: "NetworkObjects/gateway"
      }
    ],
    "trigger-id": "get-work-session"
  }
};

const whereUsed = {
  "used-directly": {
    total: 6,
    objects: [
      {
        uid: "8e7d82a3-8194-994e-98da-6de4d92c09f8",
        name: "mgmt",
        type: "CpmiHostCkp",
        domain: {
          uid: "41e821a0-3720-11e3-aa6e-0800200c9fde",
          name: "SMC User",
          "domain-type": "domain"
        },
        color: "theme-blue",
        natSummaryText: "None",
        primaryManagement: true,
        versionName: "R80.20",
        "meta-info": {
          "validation-state": "ok",
          "last-modify-time": {
            posix: 1546088975484,
            "iso-8601": "2018-12-29T13:09+0000"
          },
          "last-modifier": "System",
          "creation-time": {
            posix: 1545561330204,
            "iso-8601": "2018-12-23T10:35+0000"
          },
          creator: "System"
        },
        tags: [],
        icon: "NetworkObjects/management",
        comments: "",
        "display-name": "",
        customFields: null,
        "ipv4-address": "10.0.185.157",
        "ipv6-address": ""
      },
      {
        uid: "a623fc09-6e07-4251-8165-c5d24cb8ebdf",
        name: "RemoteBranchGw",
        type: "simple-gateway",
        domain: {
          uid: "41e821a0-3720-11e3-aa6e-0800200c9fde",
          name: "SMC User",
          "domain-type": "domain"
        },
        interfaces: [
          {
            name: "eth0",
            "ipv4-address": "98.51.100.120",
            "ipv4-network-mask": "255.255.255.0",
            "ipv4-mask-length": 24,
            "ipv6-address": "",
            topology: "external",
            "anti-spoofing": false,
            "security-zone": false
          },
          {
            name: "eth1",
            "ipv4-address": "172.0.113.112",
            "ipv4-network-mask": "255.255.255.128",
            "ipv4-mask-length": 25,
            "ipv6-address": "",
            topology: "internal",
            "topology-settings": {
              "ip-address-behind-this-interface":
                "network defined by the interface ip and net mask",
              "interface-leads-to-dmz": false
            },
            "anti-spoofing": false,
            "security-zone": false
          }
        ],
        "ipv4-address": "198.51.100.120",
        "dynamic-ip": false,
        version: "R77.30",
        "os-name": "Gaia",
        hardware: "Open server",
        "sic-name": "",
        "sic-state": "uninitialized",
        firewall: true,
        "firewall-settings": {
          "auto-maximum-limit-for-concurrent-connections": true,
          "maximum-limit-for-concurrent-connections": 25000,
          "auto-calculate-connections-hash-table-size-and-memory-pool": true,
          "connections-hash-size": 131072,
          "memory-pool-size": 6,
          "maximum-memory-pool-size": 30
        },
        vpn: false,
        "application-control": false,
        "url-filtering": false,
        ips: true,
        "content-awareness": false,
        "anti-bot": false,
        "anti-virus": false,
        "threat-emulation": false,
        "threat-extraction": false,
        "save-logs-locally": false,
        "send-alerts-to-server": ["mgmt"],
        "send-logs-to-server": ["mgmt"],
        "send-logs-to-backup-server": [],
        "logs-settings": {
          "rotate-log-by-file-size": false,
          "rotate-log-file-size-threshold": 1000,
          "rotate-log-on-schedule": false,
          "alert-when-free-disk-space-below-metrics": "mbytes",
          "alert-when-free-disk-space-below": true,
          "alert-when-free-disk-space-below-threshold": 20,
          "alert-when-free-disk-space-below-type": "popup alert",
          "delete-when-free-disk-space-below-metrics": "mbytes",
          "delete-when-free-disk-space-below": true,
          "delete-when-free-disk-space-below-threshold": 5000,
          "before-delete-keep-logs-from-the-last-days": false,
          "before-delete-keep-logs-from-the-last-days-threshold": 0,
          "before-delete-run-script": false,
          "before-delete-run-script-command": "",
          "stop-logging-when-free-disk-space-below-metrics": "mbytes",
          "stop-logging-when-free-disk-space-below": true,
          "stop-logging-when-free-disk-space-below-threshold": 100,
          "reject-connections-when-free-disk-space-below-threshold": false,
          "reserve-for-packet-capture-metrics": "mbytes",
          "reserve-for-packet-capture-threshold": 500,
          "delete-index-files-when-index-size-above-metrics": "mbytes",
          "delete-index-files-when-index-size-above": false,
          "delete-index-files-when-index-size-above-threshold": 100000,
          "delete-index-files-older-than-days": false,
          "delete-index-files-older-than-days-threshold": 14,
          "forward-logs-to-log-server": false,
          "perform-log-rotate-before-log-forwarding": false,
          "update-account-log-every": 3600,
          "detect-new-citrix-ica-application-names": false,
          "turn-on-qos-logging": true
        },
        comments: "RemoteBranchGw",
        color: "theme-blue",
        icon: "NetworkObjects/gateway",
        tags: [],
        "meta-info": {
          lock: "unlocked",
          "validation-state": "ok",
          "last-modify-time": {
            posix: 1545562468828,
            "iso-8601": "2018-12-23T10:54+0000"
          },
          "last-modifier": "roniz",
          "creation-time": {
            posix: 1545562403796,
            "iso-8601": "2018-12-23T10:53+0000"
          },
          creator: "roniz"
        },
        "read-only": false
      },
      {
        name: "Check Point Cloud",
        color: "theme-blue",
        icon: "Objects/host",
        type: "host",
        uid: "41e821a0-3720-11e3-aa6e-0800200c9fd1"
      },
      {
        name: "Corporate Mail Server",
        color: "theme-blue",
        icon: "Objects/host",
        type: "host",
        uid: "41e821a0-3720-11e3-aa6e-0800200c9fd2"
      },
      {
        name: "Corporate Portal",
        color: "theme-blue",
        icon: "Objects/host",
        type: "host",
        uid: "41e821a0-3720-11e3-aa6e-0800200c9fd3"
      },
      {
        name: "DMZ Zone",
        color: "theme-blue",
        icon: "NetworkObjects/zone",
        type: "host",
        uid: "41e821a0-3720-11e3-aa6e-0800200c9fd4"
      }
    ],
    "threat-prevention-rules": [],
    "nat-rules": [],
    "access-control-rules": []
  }
};

const objects = [
  {
    from: 1,
    to: 2,
    total: 2,
    objects: [
      {
        uid: "fca63268-19e9-469b-9e28-51fc1dd15dd2",
        name: "mgmt ConnectivityCheck",
        type: "tag",
        domain: {
          uid: "41e821a0-3720-11e3-aa6e-0800200c9fde",
          name: "SMC User",
          "domain-type": "domain"
        }
      },
      {
        uid: "fca63268-19e9-469b-9e28-51fc1dd15dd1",
        name: "ConnectivityCheck",
        type: "tag",
        domain: {
          uid: "41e821a0-3720-11e3-aa6e-0800200c9fde",
          name: "SMC User",
          "domain-type": "domain"
        }
      }
    ]
  }
];

const tasks = {
  "ffee403f-fc7c-429a-a85e-f8c5b48427bc": {
    tasks: [
      {
        "task-id": "ffee403f-fc7c-429a-a85e-f8c5b48427bc",
        "task-name": "mgmt - Check Connectivity from mgmt to Branch",
        status: "failed",
        "progress-percentage": 100,
        suppressed: false
      }
    ]
  },
  "13e4ed6f-bd38-458f-9f76-95e5c84cb916": {
    tasks: [
      {
        "task-id": "13e4ed6f-bd38-458f-9f76-95e5c84cb916",
        "task-name": "mgmt - Check Connectivity from mgmt to Google",
        status: "succeeded",
        "progress-percentage": 100,
        suppressed: false
      }
    ]
  },
  "demo-task": {
    tasks: [
      {
        "task-id": "13e4ed6f-bd38-458f-9f76-95e5c84cb917",
        "task-name": "demo-task",
        status: "succeeded",
        "progress-percentage": 100,
        suppressed: false
      }
    ]
  }
};
const status = [
  "in progress",
  "in progress",
  "failed",
  "succeeded",
  "succeeded"
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getResponse(functionName, parameters, callbackFunctionName) {
  switch (functionName) {
    case "get-context":
      return context;

    case "request-commit":
      let reply = [];
      parameters.commands.forEach(element => {
        reply.push({
          tasks: [{ target: "mgmt", "task-id": uuid() }]
        });
      });
      return reply;

    case "run-readonly-command":
      switch (parameters.command) {
        case "show-task":
          let task = tasks["demo-task"];
          task.tasks[0]["task-id"] = parameters.parameters["task-id"];
          task.tasks[0].status =
            status[Math.floor(Math.random() * (status.length - 1))];
          return task;
        case "where-used":
          return whereUsed;

        case "show-objects":
          if (parameters.parameters.type === "tag") {
            return objects[0];
          }
          if (whereUsed["used-directly"]) {
            const res = Math.floor(Math.random() * 6) + 1;
            let randomRes = whereUsed["used-directly"];
            randomRes.total = res;
            randomRes.objects = randomRes.objects.slice(0, res);
            return randomRes;
          } else
            return {
              objects: [
                {
                  name: "Demo name",
                  color: "gold",
                  icon: "Objects/host",
                  type: "host",
                  uid: "41e821a0-3720-11e3-aa6e-0800200c9fde"
                }
              ]
            };

        case "show-object":
          if (objects[parameters.parameters.uid])
            return objects[parameters.parameters.uid];
          else
            return {
              name: "Demo name",
              color: "gold",
              icon: "Objects/host",
              type: "host",
              uid: "41e821a0-3720-11e3-aa6e-0800200c9fde"
            };
        default:
          return;
      }
    default:
      return;
  }
}
export default async function demoInteraction(
  functionName,
  parameters,
  callbackFunctionName
) {
  console.debug(
    "demoInteraction",
    functionName,
    parameters,
    callbackFunctionName
  );
  const res = getResponse(functionName, parameters, callbackFunctionName);
  const sleepTime = Math.floor(Math.random() * 200) + 50;
  await sleep(sleepTime);
  window[callbackFunctionName](res);
}
