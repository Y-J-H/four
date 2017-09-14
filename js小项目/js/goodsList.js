(function (){
    var oProList=document.querySelector("#proList");
    var oMainProList=document.querySelector(".mainProList");

    myajax.get("http://h6.duchengjiu.top/shop/api_cat.php",{},function (error,responseText) {
        var json=JSON.parse(responseText);
        var data=json.data;
        for(var i=0;i<data.length;i++){
            var obj=data[i];
            oProList.innerHTML+=` <li class="proListItem" data-index=${i}>
       <a href="goodsList.html?cat_id=${obj.cat_id}">${obj.cat_name}</a></li>`;
        }
        var navLi = document.querySelector('#proList').querySelectorAll('li');
        changeClass(navLi,localStorage.currentNav,'current');
    });

    var  cat_id= matchQueryString("cat_id");
    myajax.get("http://h6.duchengjiu.top/shop/api_goods.php",
        {cat_id ,"pagesize":12},function (error,responseText) {
        var json=JSON.parse(responseText);
        var data=json.data;
        for(var i=0;i<data.length;i++){
            var obj=data[i];
            console.log(oMainProList);
            oMainProList.innerHTML += `
            <li class="mainProListItem">
            <a href="goodsDetail.html?goods_id=${obj.goods_id}">
              <div class="ProListImg">
                <img src="${obj.goods_thumb}"/>
                <div class="mark"></div>
              </div>
              <div class="ProListInfor">
                <h3 class="ProName" title="仅重600g便携蓝牙音箱 丹麦设计 专业级音质 防滑防水 长续航">${obj.goods_name}</h3>
                <p class="des">${obj.goods_desc}</p>
                <span class="price"><i>&yen;</i>${obj.price}</span>
              </div>
            </a>
          </li>
           `;
        }
    });
    
  //		hanlun
		var oGoodsSearch = document.querySelector('input[name=search_text]');
		var oSearchDiv = document.querySelector('.search-history');
		var oSearchUlHistory = document.querySelector('#searchulhistory');
		var lock = true;
    oGoodsSearch.onkeyup = function(event) {
    	event = event || window.event;
    	event.preventDefault();
    	if(localStorage.value){
    		var str = localStorage.value.split('&');
      	console.log(str);
    	}
    	if (event.keyCode === 13) {
				if (!localStorage.value) {
			    			localStorage.value = this.value;
			      }else{
			    			localStorage.value += '&' + this.value;
			    	}
        location.href='goodsSearch.html?search_text='+this.value;	
    	}
    	
    	if (localStorage.value !== ''){
		    		if (!lock) return;
		        lock = false;
		        setTimeout(function(){
		          lock = true;
		        }, 10000);
		    		for (var i=0;i<str.length;i++) {
		    			var oLiSearch = document.createElement('li');
							oLiSearch.innerText = str[i];
							oSearchUlHistory.insertBefore(oLiSearch,oSearchUlHistory.children[0]);
		    		}
    		}
  	}
		if(localStorage.value){
    		var str = localStorage.value.split('&');
      	console.log(str);
      	oGoodsSearch.value = str[str.length-1];
    }
    oGoodsSearch.onkeydown= function(){
    	if (localStorage.value) {
    		oSearchDiv.style.display = 'block';
    	}
    }
    oGoodsSearch.onblur = function(){
    	oSearchDiv.style.display = 'none';
    }
    var oGoodsSearch1 = document.querySelector('input[name=searchBtn]');
    oGoodsSearch1.onclick = function(event) {
    	event = event || window.event;
    	event.preventDefault();
    	if (!localStorage.value) {
			    			localStorage.value = oGoodsSearch.value;
			      }else{
			    			localStorage.value += '&' + oGoodsSearch.value;
			    	}
      location.href='goodsSearch.html?search_text=' + oGoodsSearch.value;
			}
		var search_text = matchQueryString('search_text');
			myajax.get('http://h6.duchengjiu.top/shop/api_goods.php',{
				search_text,pagesize:12
			},function(error,responseText){
				var json = JSON.parse(responseText);
				var data = json.data;
				oMainProList.innerHTML = "";
				for (var i=0;i<data.length;i++) {
					var obj = data[i];
					oMainProList.innerHTML += `<li class="mainProListItem">
            <a href="goodsDetail.html?goods_id=${obj.goods_id}">
              <div class="ProListImg">
                <img src="${obj.goods_thumb}"/>
                <div class="mark"></div>
              </div>
              <div class="ProListInfor">
                <h3 class="ProName" title="仅重600g便携蓝牙音箱 丹麦设计 专业级音质 防滑防水 长续航">${obj.goods_name}</h3>
                <p class="des">${obj.goods_desc}</p>
                <span class="price"><i>&yen;</i>${obj.price}</span>
              </div>
            </a>
          </li>
          `;
				}
			});
			// 显示商品数量
  showProCount();
})();