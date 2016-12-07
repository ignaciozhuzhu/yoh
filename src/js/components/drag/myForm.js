var React = require('react');
var ReactDOM = require('react-dom');
var DragArea = require('./DragArea.js');
import {
  ws
} from '../../lib/common.js';

const MAXCOL = 15;
var totalCol = 6;
var draggedFromTopIndex = 0;
var draggedToTopIndex = 0;
var otherleft = 0;
var isMoved = false;
var arrDragCountP = [0, 0, 0];
//var ws = new WebSocket("ws://192.168.2.135:8181");

var MyForm = React.createClass({
  getInitialState: function() {
    var COL = this.props.col; //分成4栏还是3栏
    const DRBOXWIDTH = $('.controlDiv #content .col-md-9 .col-md-4').width(); //  200; //拖拽框的宽度
    const DRBOXHEIGHT = 100; //拖拽框的高度
    const spHeight = 10;

    let colWidth = 0; //格子的宽度
    let colInnerWidth = 0;
    let md4MarginRight = 0;
    let colHeight = DRBOXHEIGHT + spHeight;

    if (COL == 4) {
      md4MarginRight = $('.controlDiv #content .col-md-9 .col-md-3').css('marginRight');
      md4MarginRight = Math.round(md4MarginRight.substr(0, md4MarginRight.length - 2));
      colWidth = $(".col-md-3").innerWidth() + md4MarginRight + 2;
      colInnerWidth = $(".col-md-3").innerWidth() + 1;
    } else if (COL == 3) {
      md4MarginRight = $('.controlDiv #content .col-md-9 .col-md-4').css('marginRight');
      md4MarginRight = Math.round(md4MarginRight.substr(0, md4MarginRight.length - 2));
      colWidth = $(".col-md-4").innerWidth() + md4MarginRight + 2; //330 //2px是col之间的分隔线
      colInnerWidth = $(".col-md-4").innerWidth() + 1;
    }
    let spWidth = (colInnerWidth - DRBOXWIDTH) / 2; //40 两边各自间距(padding-left)
    this.getInitialDragArr();
    return {
      left: 0,
      top: 0,
      currentX: 0,
      currentY: 0,
      flag: false,
      col: COL,
      DRBOXWIDTH: DRBOXWIDTH,
      colWidth: colWidth,
      spWidth: spWidth,
      DRBOXHEIGHT: DRBOXHEIGHT,
      colHeight: colHeight,
      spHeight: spHeight,
      arrDragCount: arrDragCountP,
      id: this.props.id,
      arr: []
    };
  },
  getInitialDragArr: function() {
    //获取初始的列分布
    arrDragCountP[this.props.rank] = arrDragCountP[this.props.rank] + 1;
  },
  onChildChanged: function(newState) {
    /*以下为修改处*/
    var computedStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this.refs.dragBox), null);
    newState.left = computedStyle.left;
    newState.top = computedStyle.top;
    /*以上为修改处*/
    this.setState(newState);
  },
  submitHandler: function(event) {
    event.preventDefault();
    console.log(this.state);
  },
  move: function(event) {
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    let spWidth = this.state.spWidth;
    var dBox = ReactDOM.findDOMNode(this.refs.dragBox);
    let DRBOXHEIGHT = this.state.DRBOXHEIGHT;

    var e = event ? event : window.event;
    if (this.state.flag) {
      var nowX = e.clientX,
        nowY = e.clientY;
      var disX = nowX - this.state.currentX,
        disY = nowY - this.state.currentY;
      /*增加拖拽范围检测*/
      var currentLeft = parseInt(this.state.left) + disX;
      var currentTop = parseInt(this.state.top) + disY;

      //左右检测
      if (currentLeft <= DRBOXWIDTH) { //检测屏幕左边，因为我这里的初始居中是利用了负1/2的盒子宽度，所以用250px判断边界
        dBox.style.left = DRBOXWIDTH + spWidth + "px";
      } else if (currentLeft >= DRBOXWIDTH + colWidth * 2 + spWidth * 2) {
        dBox.style.left = DRBOXWIDTH + colWidth * 2 + spWidth + "px";
      } else {
        dBox.style.left = currentLeft + "px";
      }

      var computedStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this.refs.dragBox), null);
      //上下检测
      if (currentTop <= DRBOXHEIGHT) {
        dBox.style.top = DRBOXHEIGHT + "px";
      } else {
        dBox.style.top = currentTop + "px";
      }

      let top = this.getByRef("top");
      //以下四个是全局变量
      //判断被抽离的框是从纵列里的第几个拿出来
      if (this.state.flag == true) {
        draggedFromTopIndex = this.getIndexColByTop(this.delpx(this.state.top));
        draggedToTopIndex = this.getIndexColByTop(top);
        otherleft = this.delpx(computedStyle.left);
      }
      isMoved = true;
      //倾斜10角度
      dBox.className = "form-horizontal form rotate10";
    }
  },
  countDrag: function() {
    //把所有dragbox的left存入一个数组,返回各个列里面都有几个dragbox
    let arr = [];
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    let firstCount = 0;
    let secondCount = 0;
    let thirdCount = 0;
    for (let i = 0, len = $(".form").length; i < len; i++) {
      let id = $(".form")[i].parentNode.id;
      let left = this.delpx($("#" + id + " .form").css('left'));
      //此段代码 摘自 左右控制 ;如有变动,检查是否需要改动 左右控制
      for (let i = 0; i < this.props.col; i++) {
        if (left > 0.5 * DRBOXWIDTH + i * colWidth && left < 0.5 * DRBOXWIDTH + (i + 1) * colWidth) {
          if (i == 0) firstCount++;
          if (i == 1) secondCount++;
          if (i == 2) thirdCount++;
        }
      }
    }
    arr.push(firstCount, secondCount, thirdCount);
    return arr;
  },
  delpx: function(str) {
    if (str)
      return str.toString().replace("px", "");
  },
  addpx: function(str) {
    if (str)
      return str + "px";
  },
  getIndexColByleft: function(left) {
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    //此段代码 摘自 左右控制 ;如有变动,检查是否需要改动 左右控制
    for (let i = 0; i < this.props.col; i++) {
      if (left > 0.5 * DRBOXWIDTH + i * colWidth && left < 0.5 * DRBOXWIDTH + (i + 1) * colWidth) {
        return i;
      }
    }
  },
  getIndexColByTop: function(top) {
    let colHeight = this.state.colHeight;
    //此段代码 摘自 上下控制
    for (var i = 0; i < MAXCOL; i++) {
      if (top == colHeight * (i + 1))
        return i;
    }
  },
  /*获取一圈下来,最后一个dragbox的id*/
  getLastNodeID: function() {
    var dragBoxClassName = this.refs.dragBox.className.replace(" ", ".").replace("rotate10", "");
    dragBoxClassName = "." + dragBoxClassName;
    var lastNodeID = $(dragBoxClassName)[$(dragBoxClassName).length - 1].parentNode.id;
    //console.log("lastNodeID:" + lastNodeID)
    return lastNodeID;
  },
  getByRef: function(wish) {
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    let spWidth = this.state.spWidth;
    let DRBOXHEIGHT = this.state.DRBOXHEIGHT;
    let colHeight = this.state.colHeight;
    var computedStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this.refs.dragBox), null);
    let cleft = this.delpx(computedStyle.left);
    let ctop = this.delpx(computedStyle.top);
    if (wish == "left") { //左右控制
      for (let i = 0; i < this.props.col; i++) {
        if (cleft >= 0.5 * DRBOXWIDTH + i * colWidth && cleft < 0.5 * DRBOXWIDTH + (i + 1) * colWidth)
          return DRBOXWIDTH + spWidth + colWidth * i; //各个左右之间
      }
    } else if (wish == "top") { //上下控制
      for (let i = 0; i < MAXCOL; i++) {
        if (ctop >= 0.5 * DRBOXHEIGHT + i * colHeight && ctop < 0.5 * DRBOXHEIGHT + (i + 1) * colHeight)
          return colHeight + colHeight * i; //各个上下之间
      }
    }
  },
  endDrag: function() {

    var dBox = ReactDOM.findDOMNode(this.refs.dragBox);
    let colHeight = this.state.colHeight;
    let arrDragCount = this.countDrag();
    let left = this.addpx(this.getByRef("left"));
    let top = this.addpx(this.getByRef("top"));
    //正在减少的列
    for (let i = 0; i < this.props.col; i++) {
      if (arrDragCount[i] == this.state.arrDragCount[i] - 1 && this.getIndexColByleft(this.delpx(this.state.left)) == i) {
        //原先没动的要挪一下位置
        if (this.state.flag == false) {
          for (let j = 0; j < totalCol - 1; j++) {
            if (draggedFromTopIndex == j) {
              for (let k = j; k < totalCol - 1; k++) {
                if (this.state.top == colHeight * (k + 2) + "px")
                  top = colHeight * (k + 1) + "px";
              }
            }
          }
        }
      }
    }
    //正在增加的列
    var IndexCol = this.getIndexColByleft(this.delpx(left));
    for (let i = 0; i < this.props.col; i++) {
      if (arrDragCount[i] == this.state.arrDragCount[i] + 1 && this.getIndexColByleft(this.delpx(left)) == i) {
        //原先没动的要挪一下位置
        if (this.state.flag == false) {
          for (let j = 0; j < totalCol - 1; j++) {
            if (draggedToTopIndex == j) {
              for (let k = j; k < totalCol - 1; k++) {
                if (this.state.top == this.addpx(colHeight * (k + 1)))
                  top = this.addpx(colHeight * (k + 2));
              }
            }
          }
        } else { //要自动插入至贴近最后一个的位置
          for (let j = 0; j < totalCol; j++) {
            if (arrDragCount[IndexCol] == j + 1 && draggedToTopIndex >= j)
              top = this.addpx(colHeight * (j + 1));
          }
        }
      }
    }
    //列内部的变化  交换位置 
    for (let i = 0; i < this.props.col; i++) {
      // console.log("isMoved:" + isMoved)
      if (isMoved == true && arrDragCount[i] == this.state.arrDragCount[i] && this.getIndexColByleft(otherleft) == i && this.getIndexColByleft(this.delpx(this.state.left)) == i) {
        //不动的被置换位置
        if (this.state.flag == false) {
          for (let j = 0; j < MAXCOL; j++) {
            for (let k = 0; k < MAXCOL; k++) {
              if (draggedFromTopIndex == k && (draggedToTopIndex == j) && this.state.top == colHeight * (j + 1) + "px") {
                top = colHeight * (k + 1) + "px";
              }
              //如果是拖到最底下,辨认为是与最底下的一个交换位置
              if (draggedFromTopIndex == k && draggedToTopIndex >= arrDragCount[i] && this.state.top == colHeight * (j + 1) + "px") {
                if (j == arrDragCount[i] - 1)
                  top = colHeight * (k + 1) + "px";
              }
            }
          }
        } else { //动的要自动插入至贴近最后一个的位置
          for (let j = 0; j < totalCol; j++) {
            if (arrDragCount[IndexCol] == j + 1 && draggedToTopIndex >= j)
              top = colHeight * (j + 1) + "px";
          }
        }
      }
    }

    this.setState({
      flag: false,
      left: left,
      top: top,
      arrDragCount: arrDragCount
    });
    dBox.style.left = left;
    dBox.style.top = top;

    if (this.refs.dragBox.parentNode.id == this.getLastNodeID() && left) {
      //console.log("this.getLastNodeID():" + this.getLastNodeID())
      isMoved = false;
    }

    //摆正倾斜10角度
    dBox.className = "form-horizontal form";

  },
  componentDidMount: function() {
    const DRBOXWIDTH = $('.controlDiv #content .col-md-9 .col-md-4').width(); //  200; //拖拽框的宽度
    const DRBOXHEIGHT = this.state.DRBOXHEIGHT; //拖拽框的高度
    let left;
    var id = this.refs.dragBox.parentNode.id;
    let colHeight = this.state.colHeight;
    let index;

    if (this.props.rank === 0) {
      left = DRBOXWIDTH + this.state.spWidth;
      index = parseInt(id.replace("boxf", ""));
    } else if (this.props.rank === 1) {
      left = DRBOXWIDTH + this.state.spWidth + this.state.colWidth;
      index = parseInt(id.replace("boxs", ""));
    } else if (this.props.rank === 2) {
      left = DRBOXWIDTH + this.state.spWidth + this.state.colWidth * 2;
      index = parseInt(id.replace("boxt", ""));
    }

    $(".form").css({
      "width": DRBOXWIDTH + "px",
      "margin-left": -DRBOXWIDTH + "px",
      "height": DRBOXHEIGHT + "px",
      "margin-top": -DRBOXHEIGHT + 50 + "px"
    });
    id = "#" + id + " .form";
    $(id).css({
      "top": this.addpx(colHeight * (index + 1)),
      "left": left
    });
    this.setState({
      top: this.addpx(colHeight * (index + 1)),
      left: left
    })
    var o = this;
    document.addEventListener('mousemove', (e) => {
      o.move(e);
    }, false); /*ES6新特性，箭头函数，需要依赖jsx编译工具才能正确运行*/
    document.addEventListener('mouseup', (e) => {
      o.endDrag(e);

    }, false);
    // })
    $("#iclick").click(function() {
      sendMessage();
    });
    $("#iclick2").click(function() {
      sendMessage2();
    });
    $("#iclick3").click(function() {
      sendMessage3();
    })

    function sendMessage() {
      if (ws.readyState === WebSocket.OPEN) {
        click1();

        function click1() {
          let arr = [{
            "col": 3,
            "name": "小A",
            "mobile": "18550000005",
            "doc": "法医生",
            "time": "6:00-8:30",
            "project": "洗牙",
            "rank": 1
          }, {
            "col": 3,
            "name": "小B",
            "mobile": "18550000005",
            "doc": "赌医生",
            "time": "6:00-8:30",
            "project": "打牙",
            "rank": 1
          }, {
            "col": 3,
            "name": "小C",
            "mobile": "18550000005",
            "doc": "黑医生",
            "time": "6:00-8:30",
            "project": "刷牙",
            "rank": 1
          }, {
            "col": 3,
            "name": "小D",
            "mobile": "18550000005",
            "doc": "蓝医生",
            "time": "6:00-8:30",
            "project": "磨牙",
            "rank": 2
          }, {
            "col": 3,
            "name": "小E",
            "mobile": "18550000005",
            "doc": "白医生",
            "time": "6:00-8:30",
            "project": "磨牙",
            "rank": 0
          }]
          var dataaa = JSON.stringify(arr);
          try {
            ws.send(dataaa);
          } catch (e) {}
        }
      }
    }

    function sendMessage2() {
      if (ws.readyState === WebSocket.OPEN) {
        click2();

        function click2() {
          let arr = [{
            "col": 3,
            "name": "小A",
            "mobile": "18550000005",
            "doc": "法医生",
            "time": "6:00-8:30",
            "project": "洗牙",
            "rank": 1
          }, {
            "col": 3,
            "name": "小B",
            "mobile": "18550000005",
            "doc": "赌医生",
            "time": "6:00-8:30",
            "project": "打牙",
            "rank": 0
          }, {
            "col": 3,
            "name": "小C",
            "mobile": "18550000005",
            "doc": "黑医生",
            "time": "6:00-8:30",
            "project": "刷牙",
            "rank": 0
          }, {
            "col": 3,
            "name": "小D",
            "mobile": "18550000005",
            "doc": "蓝医生",
            "time": "6:00-8:30",
            "project": "磨牙",
            "rank": 0
          }, {
            "col": 3,
            "name": "小E",
            "mobile": "18550000005",
            "doc": "白医生",
            "time": "6:00-8:30",
            "project": "磨牙",
            "rank": 2
          }]
          var dataaa = JSON.stringify(arr);
          try {
            ws.send(dataaa);
          } catch (e) {}
        }
      }
    }

    function sendMessage3() {
      if (ws.readyState === WebSocket.OPEN) {
        passball();

        function passball() {
          let arr = [{
            "col": 3,
            "name": "小A",
            "mobile": "18550000005",
            "doc": "法医生",
            "time": "6:00-8:30",
            "project": "洗牙",
            "rank": 0
          }, {
            "col": 3,
            "name": "小B",
            "mobile": "18550000005",
            "doc": "赌医生",
            "time": "6:00-8:30",
            "project": "打牙",
            "rank": 1
          }, {
            "col": 3,
            "name": "小C",
            "mobile": "18550000005",
            "doc": "黑医生",
            "time": "6:00-8:30",
            "project": "刷牙",
            "rank": 1
          }, {
            "col": 3,
            "name": "小D",
            "mobile": "18550000005",
            "doc": "蓝医生",
            "time": "6:00-8:30",
            "project": "磨牙",
            "rank": 2
          }, {
            "col": 3,
            "name": "小E",
            "mobile": "18550000005",
            "doc": "白医生",
            "time": "6:00-8:30",
            "project": "磨牙",
            "rank": 0
          }]
          var dataaa = JSON.stringify(arr);
          try {
            ws.send(dataaa);
          } catch (e) {}
        }
      }
    }
  },
  render: function() {
    return (
      <form
            className="form-horizontal form"
            ref="dragBox"
            onSubmit={ this.submitHandler }>
        <DragArea
                  callbackParent={ this.onChildChanged }
                  col={ this.props.col } 
                  name={this.props.name}
                  mobile={this.props.mobile}
                  doc={this.props.doc}
                  time={this.props.time}
                  project={this.props.project}
                  />
      </form>
    );
  }
});
module.exports = MyForm;