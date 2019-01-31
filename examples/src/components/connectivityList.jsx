import React, { Component } from "react";
import "./connectivityList.css";
import OverviewObject from "./overviewObject";
import { uuid } from "smart-console-interactions";

class ConnectivityList extends Component {
  state = { tasks: {} };
  render() {
    //<OverviewObject object={this.state.source} />
    const source = this.props.context[0].source;
    const targets = this.props.context[0].targets;
    return (
      <div>
        <table className="object">
          <tbody>
            <tr>
              <th className="object-header">
                <div className="object-header-title">Source</div>
              </th>
              <th className="object-header">
                <div className="object-header-title">Network Assets</div>
              </th>
              <th className="object-header">
                <div className="object-header-title">Connectivity Status</div>
              </th>
            </tr>
            {targets.map(target => (
              <tr key={uuid()}>
                {target.uid === targets[0].uid && (
                  <td className="object-cell" rowSpan={targets.length}>
                    <OverviewObject object={source} />
                  </td>
                )}

                <td className="object-cell">
                  <OverviewObject object={target} />
                </td>
                <td className="object-cell">
                  {this.state.tasks && (
                    <OverviewObject
                      object={this.getStatusObject(
                        this.state.tasks[target.uid]
                      )}
                      textStyle={this.state.tasks[target.uid]}
                      iconStyle={this.state.tasks[target.uid]}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  getStatusObject(status) {
    let object = {
      name: undefined,
      icon: status,
      uid: uuid(),
      color: undefined
    };

    switch (status) {
      case "connected":
        object.name = "Connected";
        //object.color = "var(--ok)";
        break;
      case "not_connected":
        object.name = "Disconnected";
        //object.color = "var(--error)";
        break;
      default:
        object.name = "In progress...";
      //object.color = "var(--theme-blue)";
    }
    return object;
  }

  componentDidMount() {
    console.debug("ConnectivityList componentWillReceiveProps", this.props);
    this.setState({ tasks: this.props.context[0].tasks });
  }

  componentWillReceiveProps(newProps) {
    console.debug("ConnectivityList componentWillReceiveProps", newProps);
    this.setState({ tasks: newProps.context[0].tasks });
  }
}

export default ConnectivityList;
