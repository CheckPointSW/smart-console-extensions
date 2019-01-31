/*******************************************************************************
 *
 * This file contain default configuration.
 * Here you can customization and enhancement the extension basic logic.
 *
 * This file is included directly in index.html so there is no need to build
 * after editing this file.
 *
 ******************************************************************************/

/**
 *  Definition of extension default tag
 */
window["ConnectivityTag"] = "ConnectivityCheck";

/**
 * Define connectivty test procedures
 * @description
 * 1. Choose connectivity test method (e.g. ping -c, nc -vz etc).
 * 2. Support various object property for the connectivity test (e.g. ports, domain name etc.).
 */
window["getConnectivityCommand"] = object => {
  console.debug("getConnectivityCommand: " + JSON.stringify(object));
  if (object["ipv4-address"]) return "ping -c 1 " + object["ipv4-address"];
};
