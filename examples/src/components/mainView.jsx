import React, { Component } from "react";
import ConnectivityItems from "./connectivityItems";
import ConnectivityList from "./connectivityList";
import { TaskStatus } from "../scripts/queryManager";

class MainView extends Component {
  state = {
    context: undefined,
    asset: undefined,
    tag: window.ConnectivityTag
  };
  render() {
    if (!this.state.context) return <div />;

    if (
      !(
        this.state.context[0].targets &&
        this.state.context[0].targets.length > 0
      )
    ) {
      return (
        <div>
          <div>
            <label>
              Missing configured network assets to test connectivity with.
            </label>
          </div>
          <div>
            <label className="section-text">Select asset name and tag:</label>
            <input
              placeholder={"Asset name..."}
              className="textbox"
              style={{ marginRight: 7 }}
              value={this.state.asset}
              onChange={event => {
                this.setState({ asset: event.target.value });
              }}
            />
            <select
              style={{ marginRight: 7 }}
              onChange={event => {
                this.setState({ tag: event.target.value });
              }}
            >
              <option>{window.ConnectivityTag}</option>
              <option>
                {this.state.context[0].source.name +
                  " " +
                  window.ConnectivityTag}
              </option>
            </select>
            <button disabled={false} onClick={() => this.addTag()}>
              {"tag"}
            </button>
          </div>
        </div>
      );
    }

    const isListMode =
      this.state.context.length > 1 || this.state.context[0].targets.length > 5;
    return (
      <div>
        <div style={{ marginBottom: 22 }}>
          <label className="section-text">
            Test connectivity from '{this.state.context[0].source.name}' to
            configured network assets:
          </label>
          <button
            disabled={!this.canExecuteConnectivityCheck(this.state.context[0])}
            onClick={() =>
              this.executeConnectivityCheck(
                this.state.context[0].source,
                this.state.context[0].targets
              )
            }
          >
            {"start"}
          </button>
        </div>
        {isListMode && (
          <ConnectivityList
            context={this.state.context}
            queryManager={this.props.queryManager}
          />
        )}
        {!isListMode && (
          <ConnectivityItems
            context={this.state.context}
            queryManager={this.props.queryManager}
          />
        )}
      </div>
    );
  }

  async getTagByName(tagName, retry = true) {
    let tags = await this.props.queryManager.getObjectsByName(tagName, "tag");
    console.debug("tags" + JSON.stringify(tags));

    let filteredTags = undefined;
    if (tags)
      filteredTags = tags.objects.filter(function(t) {
        return t.name === tagName;
      });
    console.debug("filteredTags" + JSON.stringify(filteredTags));
    if (!filteredTags || filteredTags.length === 0 || !filteredTags[0]) {
      const allTags = await this.props.queryManager.getTags();
      console.debug("allTags" + JSON.stringify(allTags));
      const thisTag = allTags.objects.filter(function(t) {
        return t.name === tagName;
      });

      if ((!thisTag || thisTag.length === 0) && retry) {
        let res = this.props.queryManager.requestCommit([
          "add tag name '" + tagName + "'"
        ]);
        console.debug("requestCommit result: " + JSON.stringify(res));
        return await this.getTagByName(tagName, false);
      } else return thisTag[0];
    } else return filteredTags[0];
  }

  async addTag() {
    const objName = this.state.asset;
    console.debug("Add tag:" + this.state.tag + " to " + this.state.asset);
    let objects = await this.props.queryManager.getObjectsByName(objName);

    objects = objects.objects.filter(function(o) {
      return o.name === objName;
    });

    if (!objects || objects.length === 0) {
      alert("Object not found");
      return;
      //todo: add message that object with given name is not found
    }
    console.debug("getObjectsByName" + JSON.stringify(objects));
    const tag = await this.getTagByName(this.state.tag);
    console.debug("tag" + JSON.stringify(tag));
    let object = objects[0];
    console.debug("Add command:" + JSON.stringify(object));
    if (object && object.name === objName) {
      const commands = [
        "set-generic-object uid '" + object.uid + "' tags.add '" + tag.uid + "'"
      ];
      console.debug("requestCommit", commands);
      this.props.queryManager.requestCommit(commands);
    }
    window.location.reload();
  }

  canExecuteConnectivityCheck(context) {
    if (!context || !context.targets || context.targets.length === 0)
      return false;

    if (context["tasks"]) {
      for (let i in context.tasks) {
        if (
          context.tasks[i] !== "connected" &&
          context.tasks[i] !== "not_connected"
        ) {
          return false;
        }
      }
    }
    return true;
  }

  async startConnectivityCheck(source, targets) {
    let commands = [];
    for (let obj in targets) {
      let command =
        'run-script script-name "Check Connectivity from ' +
        source.name +
        " to " +
        targets[obj].name +
        '" ';
      command +=
        'script "' +
        window.getConnectivityCommand(targets[obj]) +
        '" targets.1 "' +
        source.name +
        '" --format json --sync false';
      commands.push(command);
      console.debug("executeConnectivityCheck", command);
    }
    let taskIds = [];
    const requestCommitResult = await this.props.queryManager.requestCommit(
      commands
    );

    console.debug("requestCommit", requestCommitResult);
    if (requestCommitResult) {
      for (let tasks in requestCommitResult) {
        for (let task in requestCommitResult[tasks].tasks) {
          const taskId = requestCommitResult[tasks].tasks[task]["task-id"];
          taskIds.push(taskId);
        }
      }
    }

    return taskIds;
  }

  async getTask(targetId, taskId) {
    console.debug("getTask", targetId, taskId);
    let context = this.state.context;
    if (!context[0]["tasks"]) context[0]["tasks"] = {};
    context[0].tasks[targetId] = "loading-badge";
    this.setState({ context });
    this.props.queryManager.getTask(taskId).then(taskResult => {
      console.debug("taskResult", taskResult.status);
      context[0].tasks[targetId] =
        taskResult.status === TaskStatus.Succeeded
          ? "connected"
          : "not_connected";
      this.setState({ context });
    });
  }

  async executeConnectivityCheck(source, targets) {
    //let targets = this.state.context[0].targets;
    console.debug("executeConnectivityCheck", source, targets);

    this.startConnectivityCheck(source, targets).then(taskIds => {
      console.debug("taskIds", taskIds);
      let context = this.state.context;
      context[0]["tasks"] = {};
      for (let obj in targets) {
        console.debug("getTask", targets[obj], taskIds[obj]);
        // context[0].tasks[targets[obj]] = "loading"; //taskIds[obj];
        // this.setState({ context });

        this.getTask(targets[obj].uid, taskIds[obj]);
      }
      //   let context = this.state.context;
      //   context[0]["tasks"] = tasks;
      //   this.setState({ context });
    });
  }

  componentDidMount() {
    console.debug("MainView componentDidMount", this.props.source);
    let context = this.props.context;
    this.setState({ context });
  }
  componentWillReceiveProps(newProps) {
    console.debug("MainView componentWillReceiveProps", newProps.source);
    let context = newProps.context;
    this.setState({ context });
  }
}

export default MainView;
