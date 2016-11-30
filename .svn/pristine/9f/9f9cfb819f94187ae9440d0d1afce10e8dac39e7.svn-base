var React = require('react');
//var addons = require('react-addons');
var ReactDOM = require('react-dom');

var DragArea = React.createClass({
  getInitialState: function() {
    return {
      left: 0,
      top: 0,
      currentX: 0,
      currentY: 0,
      flag: false
    }
  },
  startDrag: function(e) {
    var newState = {};
    var event = e || window.event;
    event.preventDefault();
    newState.currentX = event.clientX;
    newState.currentY = event.clientY;
    newState.flag = true;
    this.props.callbackParent(newState);
  },
  render: function() {
    return (
      <div style={{padding:"10px"}}
           className="drag"
           id="drag"
           onMouseDown={ this.startDrag }>
          <span >
          { this.props.name }
          </span>
          <span style={{marginLeft:"10px"}}>
          { this.props.mobile }
          </span>
          <br />
          <span>
          { this.props.doc }
          </span>
          <span style={{marginLeft:"10px"}}>
          { this.props.time }
          </span>
          <button className="btn btn-default" onClick={this.link}>跳</button>
          <br />
          <span>
          治疗项目
          </span>
          <span style={{marginLeft:"10px"}}>
          { this.props.project }
          </span>
          <button className="btn btn-default" style={{marginLeft:"5px"}} onClick={this.link2}>打开新</button>
      </div>
    );
  },
  link: function() {
    console.log("let me link out!");
    window.location.href = "http://www.yayi365.cn"
  },
  link2: function() {
    console.log("let me link out2!");
    window.open("http://www.baidu.com");
  }
});

module.exports = DragArea;