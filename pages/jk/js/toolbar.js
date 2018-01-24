/**
 * Created by WCL on 2018/1/24.
 */
var curObj = null;
function Tool(objs,toolsBar) {

    this.o = objs;
    this.t = toolsBar;
    var self = this;

    var img = document.createElement('img');
    img.style.cursor = (document.all)? 'hand':'pointer';
    img.style.height = '26px';
    img.style.width = '50px';
    img.src=objs.a;
    img.tag = objs.c;
    img.tig = objs.a;
    var mLen = img.src.length;
    var name = img.src.substring(mLen-8,mLen-6);

    switch(name) {
        case 'm0' :
            img.title='拖动';
            img.src = img.tag;
            bind(img, "click", function(){
                funResetMapTool(img);
            });
            break;
        case 'm1' :
            img.title='放大';
            bind(img, "click", function(){
                funResetMapTool(img);
                var myDrag = new BMapLib.RectangleZoom(PageMap.mapObj,{
                    "zoomType" : 0,//拉框后放大,
                    "followText":"拖拽鼠标放大区域"//提示文字
                });
                myDrag.open();
                curObj = myDrag;
            });
            break;
        case 'm2' :
            img.title='缩小';
            bind(img, "click", function(){
                funResetMapTool(img);
                var myDrag = new BMapLib.RectangleZoom(PageMap.mapObj,{
                    "zoomType" : 1,//拉框后放大,
                    "followText":"拖拽鼠标缩小区域"//提示文字
                });
                myDrag.open();
                curObj = myDrag;
            });
            break;
        case 'm3' :
            bind(img, "click", function(){
                funResetMapTool(img);
                var myDis = new BMapLib.DistanceTool(PageMap.mapObj);
                myDis.open();
                curObj = myDis;
            });
            img.title='测距';
            break;
        case 'm4' :
            bind(img, "click", function(){
                funResetMapTool(img);
                var myDrawingManagerObject = new BMapLib.DrawingManager(PageMap.mapObj,
                    {
                        "isOpen": true,
                        "enableDrawingTool":false,
                        "enableCalculate":true,
                        "polylineOptions":{
                            "strokeColor":"#333"
                        },
                        "polygonOptions":{
                            "fillColor":"blue"
                        }//所画的多边形的可选参数，参考api中的对应类
                    });
                myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYGON);
                myDrawingManagerObject.open();
                curObj = myDrawingManagerObject;
                //Map.setCurrentMouseTool(MConstants.COMPUTE_AREA);
            });
            img.title='测面';
            break;
    }
    this.img = img;
}
Tool.prototype.onMouseOver = function() {
    this.img.src = this.o.b;
}
Tool.prototype.onMouseOut = function() {
    this.img.src = this.o.a;
}
Tool.prototype.onClick = function() {
    this.t.currentTool = this;
}
Tool.prototype.onBindCurrent = function() {
}
Tool.prototype.onCanelCurrent = function() {
}

var mapAbcTool = null;
function funResetMapTool(img){
    try{
        if(curObj!=null){
            curObj.close();
            //PageMap.mapObj.clearOverlays();
        }
        for(var nItem=0; nItem<mapAbcTool.length; nItem++){
            mapAbcTool[nItem].img.src = mapAbcTool[nItem].img.tig;
        }
        img.src = img.tag;
    }catch(e){alert(e)}
}

function ToolBar(opt) {
    var c = opt.container;
    var container = (typeof c == 'Object') ? c : document.getElementById(c);

    this.urls = this.getUrls();
    this.tools = [];
    for(var i=0,obj;obj=this.urls[i++];) {
        var tool = new Tool(obj,this);
        this.tools.push(tool);
        container.appendChild(tool.img);
        if (i != 9){
            var mSpan = document.createElement("span") ;
            mSpan.innerHTML = "&nbsp;";
            container.appendChild(mSpan);
        }
    }
    this.defaultTool = this.tools[0];
    this.currentTool = this.tools[0];
    mapAbcTool = this.tools;
}
ToolBar.prototype.getUrls = function() {
    var baseUrl = 'js/mapbaidu/img/',suffix='.png',ary=[];
    for(var i=0;i<4;i++) {
        ary.push({
            a : baseUrl+'m'+i+'_a'+suffix,
            b : baseUrl+'m'+i+'_b'+suffix,
            c : baseUrl+'m'+i+'_c'+suffix
        });
    }
    return ary;
}
ToolBar.prototype.clkDefaultTool = function() {
}
ToolBar.prototype.clear = function() {
}
ToolBar.prototype.bind = function(Map) {
    //PageMap.mapObj = Map;
}

/************************************
 * 添加事件绑定
 * @param obj   : 要绑定事件的元素
 * @param type : 事件名称。不加 "on". 如 : "click" 而不是 "onclick".
 * @param fn    : 事件处理函数
 ************************************/
function bind( obj, type, fn ) {
    if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
    } else{
        obj.addEventListener( type, fn, false );
    }
}

/************************************
 * 删除事件绑定
 * @param obj : 要删除事件的元素
 * @param type : 事件名称。不加 "on". 如 : "click" 而不是 "onclick"
 * @param fn : 事件处理函数
 ************************************/
function unbind( obj, type, fn ) {
    if ( obj.detachEvent ) {
        obj.detachEvent( 'on'+type, obj[type+fn] );
        obj[type+fn] = null;
    } else{
        obj.removeEventListener( type, fn, false );
    }
}

function methodForSub(){
    alert("methodForSub");
}