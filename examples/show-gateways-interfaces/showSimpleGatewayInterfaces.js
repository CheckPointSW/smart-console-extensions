/*
 * internal topology types
 */
const internalTopologyType = {
  notDefined: "not defined",
  definedByInterfaceIpAndNetMask: "network defined by the interface ip and net mask",
  definedByRouting: "network defined by routing",
  specific: "specific"
};

/*
 * Topology configuration
 */
const topologyConf = {
  external: "external",
  internal: "internal",
  automatic: "automatic"
};

/*
 * svg path for interface icon
 */
const interfaceIcon =
  "M10.000,8.000 L10.000,7.000 L7.000,7.000 L6.000,7.000 L3.000,7.000 L3.000,8.000 L2.000,8.000 L2.000,7.000 L2.000,6.000 L3.000,6.000 L6.000,6.000 L6.000,5.000 L7.000,5.000 L7.000,6.000 L10.000,6.000 L11.000,6.000 L11.000,7.000 L11.000,8.000 L10.000,8.000 ZM8.000,4.000 L7.000,4.000 L7.000,4.000 L6.000,4.000 L6.000,4.000 L5.000,4.000 C4.448,4.000 4.000,3.552 4.000,3.000 L4.000,1.000 C4.000,0.447 4.448,-0.000 5.000,-0.000 L8.000,-0.000 C8.552,-0.000 9.000,0.447 9.000,1.000 L9.000,3.000 C9.000,3.552 8.552,4.000 8.000,4.000 ZM5.000,10.000 L5.000,12.000 C5.000,12.552 4.552,13.000 4.000,13.000 L1.000,13.000 C0.448,13.000 -0.000,12.552 -0.000,12.000 L-0.000,10.000 C-0.000,9.447 0.448,9.000 1.000,9.000 L1.000,9.000 L1.000,9.000 L4.001,9.000 C4.553,9.001 5.000,9.448 5.000,10.000 ZM9.000,9.000 L9.000,9.000 L9.000,9.000 L12.001,9.000 C12.553,9.001 13.000,9.448 13.000,10.000 L13.000,12.000 C13.000,12.552 12.552,13.000 12.000,13.000 L9.000,13.000 C8.448,13.000 8.000,12.552 8.000,12.000 L8.000,10.000 C8.000,9.447 8.448,9.000 9.000,9.000 Z";

/*
 * get interface name
 */
function getName(interface) {
  return interface["name"];
}

/*
 * get interface icon color
 */
function getColor(interface) {
  return interface["color"];
}

/*
 * get interface icon
 */
function getIcon(interface) {
  if (interface["icon"] == "NetworkObjects/network") {
    var xmlns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(xmlns, "svg");
    svg.setAttribute("class", "icon");
    var path = document.createElementNS(xmlns, "path");
    path.setAttributeNS(null, "d", interfaceIcon);
    // fill icon color
    path.setAttributeNS(null, "fill", colors[getColor(interface)]);
    path.setAttributeNS(null, "transform", "translate(1, 1)");
    svg.appendChild(path);
    return svg;
  }
}

/*
 * get internal topology string to topology column.
 */
function getInternalTopology(interface) {
  var type = interface["topology-settings"]["ip-address-behind-this-interface"];
  switch (type) {
    case internalTopologyType.notDefined:
      return "Undefined";
    case internalTopologyType.definedByInterfaceIpAndNetMask:
      return "This network";
    case internalTopologyType.definedByRouting:
      return "Defined by routes";
    case internalTopologyType.specific:
      return interface["topology-settings"]["specific-network"];
  }
}

/*
 * get external topology string to topology column.
 */
function getExternalTopology() {
  return "External";
}

/*
 * get topology interface
 * When topology is external (manual or automatic) return external.
 * When topology is internal (manual or automatic) return ip address behind this interface (Undefined, This network, Defined by routes or specific network).
 */
function getTopology(interface) {
  var automaticInternal = false;
  var topology = interface["topology"];
  if (topology == topologyConf.external) {
    return getExternalTopology();
  }
  if (topology == topologyConf.automatic) {
    var topologyAutomaticCalculation = interface["topology-automatic-calculation"];
    if (topologyAutomaticCalculation == topologyConf.external) {
      return getExternalTopology();
    } else {
      automaticInternal = true;
    }
  }
  if (topology == topologyConf.internal || automaticInternal) {
    return getInternalTopology(interface);
  }
}

/*
 * get IP string to show at IP column.
 */
function getIPString(address, maskLength) {
  var ip = address + "/" + maskLength;
  return ip;
}

/*
 * get ip and mask length
 */
function getIP(interface) {
  var ipV4Address = interface["ipv4-address"];
  if (ipV4Address) {
    var ipv4MaskLength = interface["ipv4-mask-length"];
    return getIPString(ipV4Address, ipv4MaskLength);
  } else if (interface["ipv6-address"]) {
    var ipV6Address = interface["ipv6-address"];
    var ipv6MaskLength = interface["ipv6-mask-length"];
    return getIPString(ipV6Address, ipv6MaskLength);
  }
}

/*
 * get interface comments
 */
function getComments(interface) {
  return interface["comments"];
}

/*
 * create div for icon and interface name.
 */
function getIconAndName(interface) {
  var name = document.createElement("div");
  name.setAttribute("class", "name");
  name.innerText = getName(interface);

  var icon = getIcon(interface);
  var div = document.createElement("div");
  div.appendChild(icon);
  div.appendChild(name);
  return div;
}

/*
 * create interfaces table
 */
function createTable(interfaces) {
  var table = document.getElementById("interfacesTable");

  // create rows dynamicaly by number of interfaces of simple gateway
  for (i in interfaces) {
    var currInterface = interfaces[i];
    rowNumber = Number(i) + 1;
    // create row and four columns [Name, Topology, IP, Comments]
    var row = table.insertRow(rowNumber);
    var cellName = row.insertCell(0); // Name (icon + name)
    var cellTopology = row.insertCell(1); // Topology
    var cellIP = row.insertCell(2); // IP
    var cellComments = row.insertCell(3); // Comments

    cellName.setAttribute("class", "might-overflow column10");
    cellTopology.setAttribute("class", "might-overflow column15");
    cellIP.setAttribute("class", "might-overflow column10");
    cellComments.setAttribute("class", "might-overflow");

    cellName.appendChild(getIconAndName(currInterface)); // Name (icon + name)
    cellTopology.innerHTML = getTopology(currInterface); // Topology
    cellIP.innerHTML = getIP(currInterface); // IP
    cellComments.innerHTML = getComments(currInterface); // Comments
  }

  table.style.visibility = "visible";
}

/*
 * Show interfaces of selected simple gateway.
 * When object is not a simple gateway, show message to user.
 */
function onContext(obj) {
  removeLoader();

  var type = obj.event.objects[0]["type"];
  if (type == "simple-gateway") {
    var interfaces = obj.event.objects[0].interfaces;
    // sort interfaces by name (ASC order)
    interfaces.sort(function(a, b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    createTable(interfaces);
  } else {
    // create message to user
    var message = document.createElement("p");
    message.innerText = "This extension supports only simple gateway objects";
    document.body.appendChild(message);
  }
}

/*
 * add loader text
 */
function addLoader() {
  var loader = document.createElement("div");
  var text = document.createElement("p");
  text.setAttribute("id", "loader-text");
  text.innerText = "Loading...";
  document.body.appendChild(text);
}

/*
 * Remove loader text
 */
function removeLoader() {
  var text = document.getElementById("loader-text");
  document.body.removeChild(text);
}

/*
 * Send API request 'get-context' (get-context return JSON object of extension location context).
 */
function showContext() {
  addLoader();
  // send API request
  smxProxy.sendRequest("get-context", null, "onContext");
}
