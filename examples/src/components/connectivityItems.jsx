import React, { Component } from "react";
import "./connectivityItems.css";
import OverviewObject from "./overviewObject";
import { uuid } from "smart-console-interactions";

class ConnectivityItems extends Component {
  state = {
    tasks: {},
    status: undefined,
    lines: undefined,
    leftLine: undefined,
    rightLine: undefined
  };

  render() {
    console.debug("ConnectivityItems render", this.state.status);
    const targets = this.props.context[0].targets;
    const sideItems = targets.length > 3;
    return (
      <div className={"connectivity-items"}>
        <table ref={"table"} className={"full-width"}>
          <tbody>
            <tr>
              {sideItems && (
                <td align={"center"}>
                  <div ref={targets[3].uid} className={"connectivity-item"}>
                    <OverviewObject
                      className={"asset-overview"}
                      object={targets[3]}
                      iconStyle={"big-overview-icon"}
                      badge={this.state.tasks[targets[3].uid]}
                      badgeStyle={this.state.tasks[targets[3].uid]}
                    />
                  </div>
                </td>
              )}
              {sideItems && (
                <td style={{ width: "50%" }}>{this.state.leftLine}</td>
              )}
              <td align={"center"} colSpan={sideItems ? 0 : targets.length}>
                <div ref={"source"} className={"connectivity-item"}>
                  <OverviewObject
                    className={"asset-overview"}
                    object={this.props.context[0].source}
                    iconStyle={"big-overview-icon"}
                  />
                </div>
              </td>
              {sideItems && (
                <td style={{ width: "50%" }}>{this.state.rightLine}</td>
              )}
              {sideItems && (
                <td align={"center"}>
                  {targets.length > 4 && (
                    <div ref={targets[4].uid} className={"connectivity-item"}>
                      <OverviewObject
                        className={"asset-overview"}
                        object={targets[4]}
                        iconStyle={"big-overview-icon"}
                        badge={this.state.tasks[targets[4].uid]}
                        badgeStyle={this.state.tasks[targets[4].uid]}
                      />
                    </div>
                  )}
                </td>
              )}
            </tr>
            <tr>
              <td>
                <div className={"lines-row"}>{this.state.lines}</div>
              </td>
            </tr>
            <tr>
              {targets.length > 0 && (
                <td align={"center"}>
                  <div ref={targets[0].uid} className={"connectivity-item"}>
                    <OverviewObject
                      className={"asset-overview"}
                      object={targets[0]}
                      iconStyle={"big-overview-icon"}
                      badge={this.state.tasks[targets[0].uid]}
                      badgeStyle={this.state.tasks[targets[0].uid]}
                    />
                  </div>
                </td>
              )}
              {sideItems && <td />}
              {targets.length > 1 && (
                <td align={"center"}>
                  <div ref={targets[1].uid} className={"connectivity-item"}>
                    <OverviewObject
                      className={"asset-overview"}
                      object={targets[1]}
                      iconStyle={"big-overview-icon"}
                      badge={this.state.tasks[targets[1].uid]}
                      badgeStyle={this.state.tasks[targets[1].uid]}
                    />
                  </div>
                </td>
              )}
              {sideItems && <td />}
              {targets.length > 2 && (
                <td align={"center"}>
                  <div ref={targets[2].uid} className={"connectivity-item"}>
                    <OverviewObject
                      className={"asset-overview"}
                      object={targets[2]}
                      iconStyle={"big-overview-icon"}
                      badge={this.state.tasks[targets[2].uid]}
                      badgeStyle={this.state.tasks[targets[2].uid]}
                    />
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  componentDidMount() {
    let targets = this.props.context[0].targets;
    const tablePosition = this.refs.table.getBoundingClientRect();
    if (this.refs["source"]) {
      const sourcePosition = this.refs.source.getBoundingClientRect();

      let lines = [];
      let leftLine = undefined;
      let rightLine = undefined;
      for (let i in targets) {
        i = parseInt(i);
        const target = targets[i];
        console.debug(
          "targetPosition(" + i + ")",
          target,
          this.refs[target.uid]
        );
        if (this.refs[target.uid]) {
          const targetPosition = this.refs[target.uid].getBoundingClientRect();
          console.debug("targetPosition", target, targetPosition);
          if (i < 3) {
            let rel = (sourcePosition.width * i) / 2;
            let targetX = targetPosition.width * ((2 - i) / 2);
            if (targets.length === 1) {
              rel = sourcePosition.width / 2;
              targetX = targetPosition.width / 2;
            }

            if (targets.length === 2) {
              rel = (sourcePosition.width * (i + 1)) / 3;
              targetX = targetPosition.width * (1 - i);
            }
            console.debug("rel(" + i + ")", rel, sourcePosition.width);
            lines.push(
              <svg className={"lines"} key={uuid()}>
                <line
                  x1={sourcePosition.x + rel - tablePosition.x}
                  y1={sourcePosition.y - tablePosition.y}
                  x2={targetPosition.x + targetX - tablePosition.x}
                  y2={
                    targetPosition.y -
                    targetPosition.height -
                    tablePosition.y -
                    10
                  }
                />
              </svg>
            );
          }
          if (i === 3) {
            leftLine = (
              <svg className={"lines"} key={uuid()}>
                <line
                  x1={0}
                  y1={0}
                  x2={
                    sourcePosition.x - targetPosition.x - targetPosition.width
                  }
                  y2={0}
                />
              </svg>
            );
          }
          if (i === 4) {
            rightLine = (
              <svg className={"lines"} key={uuid()}>
                <line
                  x1={0}
                  y1={0}
                  x2={
                    targetPosition.x - sourcePosition.x - sourcePosition.width
                  }
                  y2={0}
                />
              </svg>
            );
          }
        }
      }
      this.setState({ lines: lines, leftLine: leftLine, rightLine: rightLine });
    }

    //this.getTask(this.props.taskId);
  }

  componentWillReceiveProps(newProps) {
    console.debug("ConnectivityItems componentWillReceiveProps", newProps);
    if (newProps.context[0].tasks)
      this.setState({ tasks: newProps.context[0].tasks });
  }
}

export default ConnectivityItems;
