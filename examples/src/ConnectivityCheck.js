import React, { Component } from "react";

import { QueryManager } from "./scripts/queryManager";
import MainView from "./components/mainView";
import Section from "./components/section";
import OverviewObject from "./components/overviewObject";
import { uuid } from "smart-console-interactions";

class ConnectivityCheck extends Component {
  queryManager;

  state = {
    context: undefined
  };

  constructor(props) {
    super(props);

    // Initilize query handler
    this.queryManager = new QueryManager();
  }

  render() {
    if (this.state.context instanceof Error) {
      throw this.state.context;
    }
    return (
      <div>
        {!this.queryManager.isSmartConsoleMode() && (
          <div id="watermark">
            <OverviewObject
              object={{
                name:
                  "Visual presentation only - to see real data, run the extension inside SmartConsole",
                icon: "info",
                uid: uuid(),
                color: undefined
              }}
            />
          </div>
        )}
        {!this.state.context && (
          <div className="loading">
            <label>Loading...</label>
          </div>
        )}
        {this.state.context && (
          <div>
            <Section text={"Connectivity Check"}>
              <MainView
                context={this.state.context}
                queryManager={this.queryManager}
              />
            </Section>
          </div>
        )}
      </div>
    );
  }

  async getTaggedObjects(queryManager, tagName, source) {
    console.debug("getTaggedObjects (" + tagName + "," + source.name + ")");
    try {
      const tagObject = await queryManager.getObjectsByName(tagName, "tag");
      console.debug("tagObject", tagObject);
      if (!tagObject || !tagObject.objects || tagObject.objects.length === 0) {
        console.debug("no tagged ojects: " + JSON.stringify(tagObject));
        return [];
      }

      const tags = tagObject.objects.filter(function(t) {
        return t.name === tagName;
      });

      if (!tags || tags.length === 0) {
        return [];
      }

      const tag = tags[0];

      console.debug("selected tag:" + tagName + " : " + JSON.stringify(tag));
      const objectsWithTag = await queryManager.getObjectsByTag(
        tag.uid,
        "object",
        "full"
      );
      console.debug("objectsWithTag", objectsWithTag);
      if (!objectsWithTag) {
        console.debug("getTaggedObjects no objects with tag");
        return [];
      }

      const objects = objectsWithTag.objects.filter(function(o) {
        return o.uid !== source.uid;
      });
      console.debug("getTaggedObjects result" + JSON.stringify(objects));
      return objects;
    } catch (error) {
      console.error("getTaggedObjects error: " + error);
      return new Error(error);
    }
  }

  async updateTargets(targetTag, source, context) {
    console.debug("updateTargets", targetTag, source, context);
    let taggedObjects = await this.getTaggedObjects(
      this.queryManager,
      targetTag,
      source
    );
    console.debug("updateTargets taggedObjects", taggedObjects);
    if (!taggedObjects) {
      this.setState({
        context: new Error("Fail to retrive " + targetTag)
      });
      return;
    }

    if (taggedObjects instanceof Error) {
      this.setState({
        context: taggedObjects
      });
      return;
    }

    let usedBy = [];
    console.debug("updateTargets: " + JSON.stringify(taggedObjects));
    let targets = [];
    if (context) targets = context[0].targets;

    if (taggedObjects) {
      usedBy = this.uniqueBy(taggedObjects.concat(targets), item => item.uid);
    }

    if (context) {
      console.debug("updateTargets: " + JSON.stringify(usedBy));
      context[0].targets = usedBy;
      return context;
    }

    return [{ targets: usedBy, source: source }];
  }

  /**
   * Find unique items by key
   * @param {*} a - list of items with potential duplicates
   * @param {*} key  - function to compare
   * @returns list unique items
   */
  uniqueBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  componentDidMount() {
    this.queryManager.getContextObject().then(context => {
      if (
        !context ||
        !context["management-server-api"] ||
        !context["management-server-api"].sid
      ) {
        // extension require SmartConsole to provide a read-only session
        const error = new Error("Unable to retrieve read-only session");
        this.setState({ context: error });
      }

      // Retrieve connectivity test source and targets
      // Target are identified by a dedicated tag (see default tag in general.js)
      const source = context.event.objects[0];
      const targetTag = source.name + " " + window.ConnectivityTag;

      this.updateTargets(targetTag, source, this.state.context).then(
        updatedContext => {
          console.debug(
            "updateTargets context: " + JSON.stringify(updatedContext)
          );
          this.updateTargets(
            window.ConnectivityTag,
            source,
            updatedContext
          ).then(updatedContext => {
            console.debug(
              "updateTargets context: ",
              +JSON.stringify(updatedContext)
            );
            this.setState({ context: updatedContext });
          });
        }
      );
    });
  }
}

export default ConnectivityCheck;
