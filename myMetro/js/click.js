(function(){

	if(window.ClickJS == undefined || window.ClickJS == null){
		window.ClickJS = {};
	}


	/*点击图标后弹窗*/
	window.ClickJS.createWindow = function(){
		$(document).ready(function(){
            //给所有可能的按钮添加监听事件
            $("div[data-role='tile']").on("click", function(event){
            	//首先获得button索引
            	var index = $("div[data-role='tile']").index(event.currentTarget);
            	var title = $(event.currentTarget).find(".tile-label").text(),
            				dockStr;
            	dockStr = 'dock' + index;
            	if(title == ""){
            		title = "功能";
            	}
            	//然后判断该索引的window是否存在页面中
            	var winStr = "win" + index;
            	if($("#" + winStr)[0] == undefined){
            		$("body").append('<div id="' +
            			winStr + '"></div>'
            		);
            		//添加完成之后，将弹框初始化，并显示出来
            		$("#" + winStr).window({
            			width: 500,
            			height: 500,
            			title: title,
            			modal: false,
            			shadow: false,
                              inline: true,
            			onMinimize: function(){
            				$("#" + dockStr).data("status", "min");
            			},
            			onClose: function(){
            				$("#" + winStr).parent().remove();
            				$("#" + dockStr).remove();
            			},
            			onOpen: function(){
            				$("#" + dockStr).data("status", "open");
            			},
                              onMove: function(left, top){
                                    if(top + 50 > document.body.clientHeight){
                                          $("#" + winStr).parent().css("top", document.body.clientHeight - 50 + "px");
                                    }else if(top < 0){
                                          $("#" + winStr).parent().css("top", 0);
                                    }
                                    if(left < -370){
                                          $("#" + winStr).parent().css("left", -370 + "px");
                                    }else if(left > document.body.clientWidth - 50){
                                          $("#" + winStr).parent().css("left", (document.body.clientWidth - 50) + "px");
                                    }
                              }
                              
            		});
            		//初始化之后即添加dock栏最小化图标
            		var colors = $(event.currentTarget).attr("class").split(" ");
            		var bgIndex = -1,
            			color,
            			icon;
            		icon = $(event.currentTarget).find("span.icon");
            		for(var i = 0; i < colors.length; i++){
            			var str = colors[i].toString();	
            			if(/^bg-\w+$/.test(str)){
            				bgIndex = i;
            				break;
            			}
            		}
            		if(bgIndex == -1){
            			color = "bg-darkGreen";
            		}else{
            			color = colors[bgIndex];
            		}
            		$("#" + winStr).window("open").parent().addClass(color).css("border", "none");
            		$("#dock").append('<div id="' + dockStr + 
            			'"' +
            			'class="' + color + ' dock-item"></div>'
            		);
            		$("#" + dockStr).data("status", "open").append(icon.clone());
            		//然后添加dock栏item的事件
            		$("#" + dockStr).tooltip({
            			position: 'top',
            			content: '<span class="' + color +
		            			 '" style="color: white;padding: 4px 10px;">' + 
		            			 title + '</span>',
		            	onShow: function(){
		            		$(this).tooltip('tip').css({
		            			background: "gray"
		            		})
		            	}
            		});
            		$("#" + dockStr).on("click", function(){
            			switch($(this).data("status")){
            				case "open":
            					$("#" + winStr).window("minimize");
            					break;
            				case "min":
            				//与下面的业务逻辑一致，故合并
            				case "close":
            					$("#" + winStr).window("open");
            					break;
            				default: 
            					break;
            			}
            		});

            	}else{
            		//如果存在window元素，就直接显示
            		$("#" + winStr).window("open");
            	}

            });
        });
	};

      //添加resize的事件
      window.ClickJS.fireResize = function(){
            //文档载入即显示滑动条
            if($($("div.tile-group")[$("html").data("currentPage") - 1]).width() + 80 > document.body.clientWidth){
                  $("#bar").width(document.body.clientWidth * 
                        (document.body.clientWidth - 80) / 
                        $($("div.tile-group")[$("html").data("currentPage") - 1]).width());    
                  $("#bar").css("left", 0);
                  $($("div.tile-group")[$("html").data("currentPage") - 1]).find(".tile-container").css("left", "0");
            }else{
                  $("#bar").css("width", "0");     
            }
      };

      //resize的实际操作
      window.ClickJS.doResize = function(){
            var oldDocHeight = $('html').data('oldDocHeight'),
                oldDocWidth = $('html').data('oldDocWidth');
            var docHeight = document.body.clientHeight;
            var docWidth = document.body.clientWidth;
            var currentPage = $("html").data("currentPage") - 1;
            $("div.tile-group").each(function(index){
                  var $this = $(this);
                  if($('html').data('currentPage') - 1 == index){
                        while(true){
                              var groupHeight = $this.position().top + $this.height() + 40;
                              var width = $this.width();
                              var height = $this.height();
                              //首先计算所拥有的方块数量
                              var small = $this.find("div.tile-small").length;
                              var wide = $this.find("div.tile-wide").length;
                              var normal = $this.find("div.tile").length;
                              
                              if(groupHeight > docHeight && height > 160){
                                    
                                    $this.height(height - 160);
                                    //如果是两行，则要将当前宽度扩展至能放下所有的方块
                                    
                                    // var newWidth = 0;
                                    // for(var i = 0; i < normal; i++){
                                    //       newWidth += 160;
                                    // }
                                    console.log(Math.floor($this.height()));
                                    switch(Math.floor($this.height())){
                                          case 320:
                                          case 340:
                                                // if(normal % 2 == 0){
                                                //       newWidth = newWidth / 2;
                                                // }else{
                                                //       newWidth = newWidth / 2 + 80;
                                                // }
                                                var num = wide + small / 8 + normal / 2;
                                                $this.width(Math.ceil(num / 2) * 320);
                                                break;
                                          case 160:
                                          case 180:
                                                console.log("知心");
                                                var num = wide * 2 + small / 4 + normal;
                                                $this.width(num * 160);
                                          default:
                                                break;
                                    }
                                    // $this.width(newWidth);
                              }else if($this.height() <= 320 && $this.height() >= 160 && (docHeight - groupHeight) > 160){
                                    $this.height(height + 160);
                                    var newWidth = 0;
                                    for(var i = 0; i < normal; i++){
                                          newWidth += 160;
                                    }
                                    switch($this.height()){
                                          case 320:
                                                /*if(normal % 2 == 0){
                                                      newWidth = newWidth / 2;
                                                }else{
                                                      newWidth = newWidth / 2 + 80;
                                                }*/
                                                var num = wide + small / 8 + normal / 2;
                                                $this.width(Math.ceil(num / 2) * 320);
                                                break;
                                          case 480:
                                                /*var num = wide + small / 8 + normal / 2;
                                                newWidth = Math.ceil(num / 3) * 320;*/
                                                console.log("dfkl");
                                                var num = wide + small / 8 + normal / 2;
                                                $this.width(Math.ceil(num / 3) * 320);
                                                break;
                                          default:
                                                break;
                                    }
                                    // $this.width(newWidth);
                                    // if(normal % 2 == 0){
                                    //       $this.width($this.width() / 2);
                                    // }else{
                                    //       $this.width($this.width() / 2);
                                    // }
                              }
                              else{
                                    return;
                              }
                              $this.find("div.tile-container").height($this.height());
                        }
                  }
            });
            //按照内容区域和文档区域的大小关系，确定是否显示自定义的滚动条以及横向滚动条的宽度
            if($($("div.tile-group")[currentPage]).width() + 80 > docWidth){
                  $("#bar").width(docWidth * (docWidth - 80) / $($("div.tile-group")[currentPage]).width());
                  $("#bar").css("left", "0");   
                  $($("div.tile-group")[$("html").data("currentPage") - 1]).find(".tile-container").css("left", "0"); 
            }else{
                  $("#bar").css("width", "0");     
            }
            //计算存在的所有弹窗的上下高度在新的窗口大小情况下，该如何渲染相对位置
            $windows = $(".window");
            for(var i = 0; i < $windows.length; i++){
                  var $thisWin = $($windows[i]);
                  var oldTop = $thisWin.position().top,
                      oldLeft = $thisWin.position().left;

                  var newTop = oldTop * document.body.clientHeight / oldDocHeight,
                      newLeft = oldLeft * document.body.clientWidth / oldDocWidth;
                  $thisWin.css('top', newTop + 'px');
                  if(newLeft < -($thisWin.width() - 150)){
                        $thisWin.css('left', -($thisWin.width() - 150) + 'px');      
                  }else if(newLeft > document.body.clientWidth - 50){
                        $thisWin.css('left', (document.body.clientWidth - 50) + 'px');
                  }else{
                        $thisWin.css('left', newLeft + 'px');      
                  }
                  
            }
            $('html').data('oldDocWidth', document.body.clientWidth);
            $('html').data('oldDocHeight', document.body.clientHeight);
      }

      //添加bar的drag的监听事件
      window.ClickJS.barDrag = function(){
            var $bar = $("#bar");
            var $doc = $(document);
            //当鼠标进入到bar区域的时候才允许绑定后续事件
            $bar.on("mouseenter", function(){
                  //当鼠标按下后，绑定鼠标移动的事件
                  $bar.on("mousedown", function(event){
                        var docWidth = document.body.clientWidth;
                        var currentPage = $("html").data("currentPage") - 1;
                        var groupWidth = $($("div.tile-group")[currentPage]).width();
                        var $currentTileContainer = $($("div.tile-group")[currentPage]).find(".tile-container");
                        //记录下鼠标按下那瞬间的水平位置
                        var mouseLeft = event.pageX;
                        var leftNum = Number($bar.css("left").substr(0, $bar.css("left").length - 2));
                        var containerLeft = Number($currentTileContainer.css("left").substr(0, $currentTileContainer.css("left").length - 2));
                        $doc.on("mousemove", function(event){
                              //判断鼠标移动的方向
                              var direction = "";
                              if(event.pageX - mouseLeft < 0){
                                    direction = "toLeft";
                              }else if(event.pageX - mouseLeft > 0){
                                    direction = "toRight";
                              }
                              if((Number($bar.css("left").substr(0, $bar.css("left").length - 2)) + 
                                          $bar.width()) <= docWidth && Number($bar.css("left").substr(0, $bar.css("left").length - 2)) >= 0){

                                    $bar.css("left", event.pageX - mouseLeft + leftNum + "px");
                                    if(direction == "toRight"){
                                          $currentTileContainer.css("left", (containerLeft - Math.abs(event.pageX - mouseLeft) * groupWidth / docWidth) + "px");
                                    }else if(direction == "toLeft"){
                                          $currentTileContainer.css("left", (containerLeft + Math.abs(event.pageX - mouseLeft) * groupWidth / docWidth) + "px");
                                    }
                              }else{
                                    if(Number($bar.css("left").substr(0, $bar.css("left").length - 2)) < 0){
                                          //如果滚动条在最左边，则只允许向右滚动
                                          if(direction == "toRight"){
                                                $bar.css("left", event.pageX - mouseLeft + leftNum + "px");
                                                $currentTileContainer.css("left", (containerLeft - Math.abs(event.pageX - mouseLeft) * groupWidth / docWidth) + "px");
                                          }else if(direction == "toLeft"){
                                                mouseLeft = event.pageX;
                                                leftNum = 0;
                                                containerLeft = 0;
                                          }
                                    }else if(Number($bar.css("left").substr(0, $bar.css("left").length - 2)) + $bar.width() >  docWidth){      
                                          //如果滚动条在最右边，则只允许向左滚动
                                          if(direction == "toLeft"){
                                                $bar.css("left", event.pageX - mouseLeft + leftNum + "px");
                                                $currentTileContainer.css("left", (containerLeft + Math.abs(event.pageX - mouseLeft) * groupWidth / docWidth) + "px");
                                          }else if(direction == "toRight"){
                                                mouseLeft = event.pageX;
                                                leftNum = document.body.clientWidth - $bar.width();
                                                containerLeft = -(document.body.clientWidth - $bar.width()) * groupWidth / docWidth;
                                          }
                                    }
                              }
                        });
                  });
            });

            //当鼠标松开、鼠标离开文档区域的时候，接触鼠标移动事件
            $doc.on("mouseup mouseleave", function(){
                  $doc.off("mousemove");
            });
      };

      window.ClickJS.clickPageNation = function(){
            var $pageNation = $('#pageNation');
            var $groups = $('div.tile-group');
            $pageNation.on('click', function(event){
                  if(event.target.className != 'item'){
                        return;
                  }
                  var $items = $pageNation.find('.item');
                  var index = $items.index(event.target);
                  $items.removeClass('active');
                  $($items[index]).addClass('active');
                  //当改变完分页栏的样式后，开始切换tile-group
                  $('html').data('currentPage', index + 1);
                  $groups.animate({height: "toggle", opacity: "toggle"}, 600, function(){                        
                        // $($groups[index]).animate({'width': ['toggle']});
                        //然后设置当前的index
                        window.ClickJS.doResize();
                        window.ClickJS.barDrag();
                  });
                  
            });
      };
})();