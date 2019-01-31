import React, { Component } from "react";
import ReactSVG from "react-svg";
import "./icon.css";

class Icon extends Component {
  defaultIconName = "none";

  state = {
    path: undefined,
    badge: undefined
  };

  render() {
    this.svgClass =
      this.props.svgClass !== undefined
        ? this.props.svgClass
        : "default-svg-icon";
    if (!this.state.path) {
      // console.debug(
      //   new Date().toTimeString() + ": Icon loading",
      //   this.state.path
      // );
      return (
        <div className="animationLoading">
          <div id="loading-icon" className={this.svgClass} />
        </div>
      );
    }

    // console.debug(new Date().toTimeString() + ": Icon render", this.state.path);

    this.svgStyle =
      this.props.svgStyle !== undefined ? this.props.svgStyle : {};
    this.className =
      this.props.className !== undefined
        ? this.props.className
        : "default-icon";

    return (
      <div style={this.props.style}>
        {this.state.badge && (
          <ReactSVG
            src={this.state.badge}
            svgStyle={{ marginLeft: -34, position: "absolute" }}
            svgClassName={this.props.badgeStyle}
          />
        )}
        <ReactSVG
          src={this.state.path}
          fallback={() => <span>N/A</span>}
          onInjected={(error, svg) => {
            if (error) {
              console.error(error, svg);
              this.updateIconPath(this.defaultIconName);
            }
            // console.debug(
            //   new Date().toTimeString() + ": Icon render onInjected",
            //   this.state.path
            // );
          }}
          renumerateIRIElements={false}
          svgClassName={this.svgClass}
          svgStyle={this.svgStyle}
          className={this.className}
          onClick={() => this.props.onClick}
        />
      </div>
    );
  }

  async updateIconPath(iconName, badgeName) {
    console.debug("updateIconPath", iconName, badgeName);
    this.setState({
      path: "assets/icons/" + iconName + ".svg",
      badge: "assets/icons/" + badgeName + ".svg"
    });
  }

  componentDidMount() {
    this.updateIconPath(this.props.name, this.props.badge);
  }

  componentWillReceiveProps(newProps) {
    this.updateIconPath(newProps.name, newProps.badge);
  }
}

export default Icon;
