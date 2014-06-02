;(function($){
	$.fn.szCascadingSelect = function(settings){
/*
Author : Kim Duhwan
MIT License
Copyright (c) 2014 Kim duhwan ( netphantom@hanmail.net )
*/
		return this.each(function(){
			String.prototype.scSplit = function(args){
				
				var xx = this.replace(/\s\s+/g,' ');
				
				var spec = ["|",".","-","\\"];
				var dchar = args;
				for(i=0;i<spec.length;i++){
					if(args==spec[i]){
						if(args=="\\"){
							dchar = "\\\\";
						}else{
							dchar = "\\" + spec[i];
						}
					}
				}
				

				var re = new RegExp(dchar);
				var y = xx.split(re);
				return y;	
			}			
			
			function uniqueArray(arr) { 
				var rtn = [], check = {}, cur_item;
				for (var i = 0; i < arr.length; i++) {
					cur_item = arr[i];
					if (!check[cur_item]) {
						rtn.push(cur_item);
						check[cur_item] = true;
					}
				}
				return rtn;
			}

			
			function findJsonKey(arr,keyName,valName,val){
				var rtn = "";
				$.each(arr,function(idx,item){
					
					if(item[valName]==val){
						rtn = item[keyName];
						return false;
						
						
					}
				});
				return rtn;
			}


			var cfg = {
				keyType:"ref", 
				delimiter: ",",  
				items:[],
				item:"",
				singleKey:"cd",
				singleVal:"val"
			};


			if(settings){
				$.extend(cfg,settings);
			}

			var keyType = cfg.keyType;
			var delimiter = cfg.delimiter;
			var singleKey = cfg.singleKey;
			var singleVal = cfg.singleVal;

			if(keyType=="ref"){
			
				var thisObj = $(this);
				
				var items = cfg.items;

				var selbox = thisObj.data("selbox").split(",");
				
				selbox.unshift(thisObj.attr("id"));
				
				

				$.each(items[0], function(key,val){
					$("<option/>",{value:key,text:val}).appendTo(thisObj);
				});
				

				
				for(i=0;i<items.length-1;i++){
				
					(function(i){

						$("#" + selbox[i]).on("change",function(e){
							
							
							for(j=i+1;j<items.length;j++){
								$("#" + selbox[j] + " option:not(:eq(0))").remove();
							}

							var cur_val = $("#" + selbox[i]).val();
							$.each(items[i+1], function(key,val){
								
								var pkey = val[1];
								if(pkey==cur_val){
									$("<option/>",{value:key,text:val[0]}).appendTo("#" + selbox[i+1]);
									
								}
							});
						});		
					}(i)); 

				}
			}else{
				var thisObj = $(this);
				var item = cfg.item;
				var baseItem = item;
				var selbox = thisObj.data("selbox").split(",");
				selbox.unshift(thisObj.attr("id"));
				
				var itemStep0 = [];
				var stepCnt = 0;
				

				var tmp;

				
				$.each(item,function(idx,json){
					
					tmp_arr = json[singleVal].scSplit(delimiter);
					tmp = tmp_arr[0];
					
					if(idx==0){
						stepCnt = tmp_arr.length;
					}
					itemStep0.push(tmp);
				});



				item0uniq = uniqueArray(itemStep0);
				

	
				$.each(item0uniq, function(key,val){
					$("<option/>",{value:val,text:val}).appendTo(thisObj);
				});
				


				for(i=0;i<stepCnt-1;i++){
				

					(function(i){

						$("#" + selbox[i]).on("change",function(e){
						
							
							for(j=i+1;j<stepCnt;j++){
								$("#" + selbox[j] + " option:not(:eq(0))").remove();
							}
							

							var cur_val = $("#" + selbox[i]).val();
							

							var next_step = i+1;

							var nextItem = [];
							$.each(item, function(key,json){
								if(json[singleVal].indexOf(cur_val)==0){
								
									tmp_arr = json[singleVal].scSplit(delimiter);
									tmp = "";
									for(var k=0;k<=next_step;k++){
										tmp = (tmp=="")?tmp_arr[k]:tmp + delimiter + tmp_arr[k];
									}
									nextItem.push(tmp);
									
								}				

								
							});

							nextItemUniq = uniqueArray(nextItem);

							$.each(nextItemUniq,function(idx,item){
								tmp_arr = item.scSplit(delimiter);
								tmp = tmp_arr[tmp_arr.length-1];
								if(next_step==stepCnt-1){
									tmp_data = findJsonKey(baseItem,singleKey,singleVal,item);
									
									$("<option/>",{value:item,text:tmp,data:{cd:tmp_data}}).appendTo("#" + selbox[i+1]);
								}else{
									$("<option/>",{value:item,text:tmp}).appendTo("#" + selbox[i+1]);
								}
								
							});


						});		
					}(i)); 

				}
			}
		}) 
	}
})(jQuery);