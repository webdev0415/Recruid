import React from "react";

export default class ScrollInfinite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.pageStart
    };
  }

  cellContainer = node => {
    if (node) {
      node.addEventListener("scroll", this.handleScroll);
    }
  };

  handleScroll = event => {
    var node = event.target;
    const bottom = node.scrollHeight - node.scrollTop <= node.clientHeight;
    // let position = node.scrollHeight - node.scrollTop;
    if (bottom) {
      if (this.props.morePages) {
        let page = this.state.page;
        this.props.loadMore(this.state.page);
        setTimeout(() => {
          // node.scrollTop = node.scrollHeight - node.scrollTop;
          this.setState({ page: (page += 1) });
        });
      }
    }
  };

  render() {
    return (
      <this.props.tag
        className={this.props.class ? this.props.class : ""}
        style={{ ...this.props.styles, overflowY: "scroll" }}
        ref={this.cellContainer}
      >
        {this.props.children}
      </this.props.tag>
    );
  }
}
