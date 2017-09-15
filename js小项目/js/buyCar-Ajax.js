(function(){
    var sumPrice = document.querySelector('#sumPrice');
    var oBcProListCon=document.querySelector("#bcProListCon");
    var delAll=document.querySelector(".delAll");
    var token=matchQueryString("token");
    var Account=document.querySelector(".account");
     myajax.get("http://h6.duchengjiu.top/shop/api_cart.php",{token: localStorage.token,},function(error,responseText){
        var json=JSON.parse(responseText);
        console.log(json);
        var data=json.data;
        for(var i=0;i<data.length;i++){
            var obj=data[i];
             oBcProListCon.innerHTML+=`
     <div class="bcProListItem">
        <div class="bcProListItemPic fl">
          <img src="${obj.goods_thumb}" alt="">
        </div>
        <div class="bcProListItemName fl"><a href="#">${obj.goods_name}</a></div>
        <div class="colorAndStyle fl">
          ${obj.goods_id}
        </div>
        <div class="unitPrice fl">&yen;<span class="unitPriceSpan">${obj.goods_price}</span></div>
        <div class="count fl">
          <span>
            <i class="countLeft isCount">-</i><input class="countCon" value="${obj.goods_number}"/><i class="countRight isCount">+</i>
          </span>
        </div>
        <div class="singleSum fl gold">&yen;<span class="singleSumSpan">${obj.goods_price}</span></div>
        <div class="operation fl">
          <a class="operationDel" data-id="${obj.goods_id}" name="delete" href="javascript:(0)">删除</a>
        </div>
      </div>
            `;
            changeTotalAmount();
        }
     });
    Account.addEventListener("mouseover",function () {
       this.style.backgroundColor="#a4a1a1";
    });
    Account.addEventListener("mouseout",function () {
        this.style.backgroundColor="#b0b0b0";
    })
    oBcProListCon.addEventListener("click",function (event) {
        event=event||window.event;
        var target=event.target||event.srcElement;
        if(target.name==="delete"){
           if(!confirm("确认删除？")){
               return;
           }
         var goods_id=target.dataset.id;
         var number=0;
           myajax.post("http://h6.duchengjiu.top/shop/api_cart.php?token="+localStorage.token,
               {goods_id,number},function (error,responseText) {
                var json=JSON.parse(responseText);
                console.log(json);
                if(json.code===0){
                  var delDiv=target.parentNode.parentNode;
                  delDiv.parentNode.removeChild(delDiv);
                }
           })
        }
   });
    delAll.addEventListener("click",function () {
       if(!confirm("确定清空整个购物车吗？")){
           return;
       }
        var oGoodsDiv=document.querySelectorAll(".colorAndStyle");
       for (var i=0;i<oGoodsDiv.length;i++){
           var branch=oGoodsDiv[i];
           var goods_id=parseInt(branch.innerText);
           var number=0;
           (function (branch) {
               myajax.post("http://h6.duchengjiu.top/shop/api_cart.php?token="+localStorage.token,
                   {goods_id,number},function (error,responseText) {
                       var json=JSON.parse(responseText);
                       console.log(json);
                       if(json.code===0){
                           var father=branch.parentNode;
                           father.parentNode.removeChild(father);
                       }
                   })
           })(branch)
       }

        // 移除全部商品
       for(var i = oGoodsDiv - 1; i >= 0; i--){
           oGoodsDiv[i].parentNode.removeChild(oGoodsDiv[i]);
       }
      sumPrice.innerText = 0;
    });

    function changeTotalAmount(){
        var sum = 0;
        var allBcProListItem = document.querySelectorAll('.bcProListItem');
        for(var i = 0; i < allBcProListItem.length; i++){
            sum += parseInt(allBcProListItem[i].querySelector('.singleSumSpan').innerText);
        }
        sumPrice.innerText = sum;
    }

})()

