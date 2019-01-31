import React, { Component } from "react";
import Icon from "./components/icon";
class ErrorBoundaries extends Component {
  state = {
    hasError: false,
    info: "",
    error: ""
  };
  render() {
    return this.state.hasError ? (
      <div style={{ width: "50%", margin: "0 auto", textAlign: "center" }}>
        <Icon name="Page_Error" svgStyle={{ width: 130, height: 70 }} />
        <p>Something went wrong.</p>
        <p>{this.state.error.toString()}</p>
      </div>
    ) : (
      this.props.children
    );
  }

  componentDidCatch(error, info) {
    console.debug("componentDidCatch", error, info);
    this.setState({ hasError: true, info, error });
  }
}

export default ErrorBoundaries;
