import React, { Component } from "react";

class Section extends Component {
  render() {
    return (
      <div
      // style={{
      //   cursor: "default",
      //   display: "flex",
      //   flexDirection: "row",
      //   height: "100%"
      // }}
      >
        <table className={"full-width"}>
          <tbody>
            <tr>
              <td style={{ width: "1%" }}>
                <label className={"section-title"}>{this.props.text}</label>
              </td>
              <td style={{ width: "99%" }}>
                <hr
                  style={{
                    borderStyle: "dotted",
                    color: "var(--widget-border)"
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <div style={{ marginLeft: 10, marginTop: 22 }}>
                  {this.props.children}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Section;
