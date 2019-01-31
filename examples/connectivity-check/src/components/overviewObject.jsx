import React, { Component } from "react";
import "./overviewObject.css";
import Icon from "./icon";

class OverviewObject extends Component {
  state = {
    overview: { icon: "", name: "", type: "" },
    badge: undefined
  };
  render() {
    let className = "header-block";
    if (this.props.className) {
      className = this.props.className;
    }
    const iconVisibility =
      this.props.object !== undefined &&
      !this.isUid(this.props.object) &&
      !this.isUid(this.props.object.uid)
        ? "none"
        : "";

    this.textClass = this.props.textClass ? this.props.textClass : "title";

    return (
      <div
        //id={this.state.overview.uid}
        className="overviewObject"
        style={this.props.style}
        title={this.state.overview.name}
      >
        <div
          className={
            this.state.overview.name === "" ? "animationLoading" : className
          }
        >
          <Icon
            name={this.state.overview.icon}
            svgClass={
              this.props.iconStyle
                ? this.props.iconStyle
                : "default-overview-icon"
            }
            svgStyle={{
              fill:
                this.state.overview.color &&
                "var(--" + this.state.overview.color + ")"
            }}
            style={{
              display: iconVisibility
            }}
            badge={this.state.badge}
            badgeStyle={
              this.props.badgeStyle
                ? this.props.badgeStyle
                : "default-badge-icon"
            }
          />
          <label
            style={{ paddingLeft: 10 }}
            id={this.state.overview.name === "" ? "loading-header" : ""}
            className={this.textClass}
          >
            {this.state.overview.name}
          </label>
        </div>
      </div>
    );
  }

  async updateOverviewObject(object) {
    //console.debug("updateOverviewObject", object);
    if (!object) {
      //console.debug("updateOverviewObject object is undefined");
      return;
    }

    if (this.isUid(object)) {
      const overviewObject = await this.props.queryManager.getObject(
        object,
        "full"
      );
      this.setState({ overview: overviewObject });
      return;
    } else if (this.isOverviewObject(object)) {
      if (!object.icon) object["icon"] = "none";
      this.setState({
        overview: object
      });
      return;
    }

    let name = object;

    if (this.isString(object)) {
      //console.debug("OverviewObject object", object);
      name = object;
    }

    let date = new Date(object);
    //console.debug("OverviewObject result", date, date instanceof Date);
    if (this.isDate(date)) {
      name = date.toLocaleString();
    }

    const overviewObject = { name: name, icon: "none", type: "none" };
    //console.debug("OverviewObject result", overviewObject);
    this.setState({ overview: overviewObject });
  }

  componentDidMount() {
    //console.debug("OverviewObject componentDidMount", this.props);
    if (this.props.badge) this.setState({ badge: this.props.badge });
    this.updateOverviewObject(this.props.object);
  }

  componentWillReceiveProps(newProps) {
    //console.debug("OverviewObject componentWillReceiveProps", newProps);
    if (newProps.badge) this.setState({ badge: newProps.badge });
  }

  isOverviewObject(object) {
    //console.debug("isOverviewObject", object);
    if (!object) return false;
    return object.uid && object.name;
  }

  isUid(term) {
    //console.debug("isUid", term);
    if (term === undefined) return false;
    if (this.isString(term))
      return term.match(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
      );

    return false;
  }

  isDate(term) {
    //console.debug("isDate", term);
    return (
      term &&
      Object.prototype.toString.call(term) === "[object Date]" &&
      !isNaN(term)
    );
  }

  isString(term) {
    //console.debug("isString", term);
    return typeof term === "string" || term instanceof String;
  }
}

export default OverviewObject;
