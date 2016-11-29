var React = require('react');
var ReactDOM = require('react-dom');
var DragArea = require('./DragArea.js');

var MyForm = React.createClass({
  getInitialState: function() {
    return {
      username: "",
      password: "",
      checked: true,
      left: 0,
      top: 0,
      currentX: 0,
      currentY: 0,

      flag: false,
      col: 0,
      DRBOXWIDTH: 0,
      colWidth: 0,
      spWidth: 0,
      colInnerWidth: 0,
      DRBOXHEIGHT: 0,
      colHeight: 0,
      spHeight: 0,
      arrDragCount: []
    };
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
    let colInnerWidth = this.state.colInnerWidth;
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

      //控制台输出各坐标
      /*      console.log("currentLeft:" + currentLeft)
            console.log("docX:" + docX)
            console.log("disX:" + disX)
            console.log("nowX:" + nowX)
            console.log("colWidth :" + colWidth)
            console.log("DRBOXWIDTH :" + DRBOXWIDTH)
            console.log("colInnerWidth :" + colInnerWidth)
            console.log("midWith + colWidth * 2 + colInnerWidth:" + parseInt(DRBOXWIDTH) + parseInt(colWidth * 2) + parseInt(colInnerWidth))
            console.log("**********************")*/

      //上下检测
      if (currentTop <= DRBOXHEIGHT) {
        dBox.style.top = DRBOXHEIGHT + "px";
      } else {
        dBox.style.top = currentTop + "px";
      }

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
      for (let i = 0; i < 5; i++) {
        if (left > 0.5 * DRBOXWIDTH + i * colWidth && left < 0.5 * DRBOXWIDTH + (i + 1) * colWidth) {
          if (i == 0)
            firstCount++;
          if (i == 1)
            secondCount++;
          if (i == 2)
            thirdCount++;
        }
      }
    }
    arr.push(firstCount, secondCount, thirdCount);
    return arr;
  },
  delpx: function(str) {
    return str.substr(0, str.length - 2);
  },
  addpx: function(str) {
    return str + "px";
  },
  getIndexColByleft: function(left) {
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    if (left >= DRBOXWIDTH && left < DRBOXWIDTH + colWidth)
      return 0;
    else if (left >= DRBOXWIDTH + colWidth && left < DRBOXWIDTH + colWidth * 2)
      return 1;
    else if (left >= DRBOXWIDTH + colWidth * 2 && left < DRBOXWIDTH + colWidth * 3)
      return 2;
  },
  endDrag: function() {
    let DRBOXWIDTH = this.state.DRBOXWIDTH;
    let colWidth = this.state.colWidth;
    let spWidth = this.state.spWidth;
    var dBox = ReactDOM.findDOMNode(this.refs.dragBox);
    let DRBOXHEIGHT = this.state.DRBOXHEIGHT;
    let colHeight = this.state.colHeight;
    let spHeight = this.state.spHeight;
    let arrDragCount = this.countDrag();

    var computedStyle = document.defaultView.getComputedStyle(ReactDOM.findDOMNode(this.refs.dragBox), null);
    let left;
    let top;
    let cleft = computedStyle.left.replace("px", "");
    let ctop = computedStyle.top.replace("px", "");
    //左右控制
    for (let i = 0; i < 5; i++) {
      if (cleft >= 0.5 * DRBOXWIDTH + i * colWidth && cleft < 0.5 * DRBOXWIDTH + (i + 1) * colWidth)
        left = DRBOXWIDTH + spWidth + colWidth * i + "px"; //各个左右之间
    }
    //上下控制
    for (let i = 0; i < 10; i++) {
      if (ctop >= 0.5 * DRBOXHEIGHT + i * colHeight && ctop < 0.5 * DRBOXHEIGHT + (i + 1) * colHeight)
        top = DRBOXHEIGHT + spHeight + colHeight * i + "px"; //各个上下之间
    }

    var IndexCol = this.getIndexColByleft(cleft);
    if (this.state.arrDragCount[IndexCol] == 0) {
      top = DRBOXHEIGHT + spHeight + "px";
      console.log("success")
    }
    // else if (this.state.arrDragCount[IndexCol] == 1) {
    //   var id = this.refs.dragBox.parentNode.id;
    //   if (id == "box") {
    //     top = (DRBOXHEIGHT + spHeight) * 2 + "px";
    //   }
    // }
    //top = (DRBOXHEIGHT + spHeight) * 2 + "px";
    /*console.log(this.getIndexColByleft(this.delpx(left)));
    if (this.state.arrDragCount[1] == 1 && this.refs.dragBox.parentNode.id == "box2") {
      top = DRBOXHEIGHT + spHeight + "px";
    }*/
    //如果第一列的个数减少,陈永仁上去顶.
    /*    if (arrDragCount[0] + 1 == this.state.arrDragCount[0]) {
          if (this.refs.dragBox.parentNode.id == "box") {
            top = this.addpx(this.delpx(top) - colHeight);
          }
        } //如果第一列的个数增加,陈永仁被挤下去.
        if (arrDragCount[0] - 1 == this.state.arrDragCount[0]) {
          if (this.refs.dragBox.parentNode.id == "box") {
            top = this.addpx(parseInt(this.delpx(top)) + colHeight);
          }
        }*/
    this.setState({
      flag: false,
      left: left,
      top: top,
      arrDragCount: arrDragCount
    });
    dBox.style.left = left;
    dBox.style.top = top;

    //摆正倾斜角度
    dBox.className = "form-horizontal form";
  },
  componentDidMount: function() {
    var COL = this.props.col; //分成4栏还是3栏
    const DRBOXWIDTH = $('.controlDiv #content .col-md-9 .col-md-4').width(); //  200; //拖拽框的宽度
    const DRBOXHEIGHT = 100; //拖拽框的高度

    let colWidth = 0; //格子的宽度
    let colInnerWidth = 0;
    let md4MarginRight = 0;

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

    let colHeight = 110;
    let spHeight = 10;

    this.setState({
      col: COL,
      DRBOXWIDTH: DRBOXWIDTH,
      colWidth: colWidth,
      spWidth: spWidth,
      colInnerWidth: colInnerWidth,
      DRBOXHEIGHT: DRBOXHEIGHT,
      colHeight: colHeight,
      spHeight: spHeight
    });
    var o = this;
    //$("#content").click();
    //document.addEventListener('mousedown', function() {
    document.addEventListener('mousemove', (e) => {
      o.move(e);
    }, false); /*ES6新特性，箭头函数，需要依赖jsx编译工具才能正确运行*/
    document.addEventListener('mouseup', (e) => {
      o.endDrag(e);
    }, false);
    //  })

    $(".form").css({
      "width": DRBOXWIDTH + "px",
      "margin-left": -DRBOXWIDTH + "px",
      "height": DRBOXHEIGHT + "px",
      "margin-top": -DRBOXHEIGHT + 50 + "px"
    });
    $("#box .form").css({
      "top": "17%",
      "left": "29%"
    });
    $("#box2 .form").css({
      "top": "36%",
      "left": "29%"
    });
    $("#box3 .form").css({
      "top": "56%",
      "left": "29%"
    });
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