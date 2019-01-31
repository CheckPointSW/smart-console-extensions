import React from "react";
import ReactDOM from "react-dom";
import ConnectivityCheck from "./ConnectivityCheck";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ConnectivityCheck />, div);
  ReactDOM.unmountComponentAtNode(div);
});
