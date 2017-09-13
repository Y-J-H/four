(function() {
  var addressList = document.querySelector('#addressList');
  var oLiHeight = 126;
  var flag = true;           //用于控制显示文本地址的标签的内容是：显示所有地址还是隐藏所有地址
  var newAddress = document.querySelector('#newAddress');
  var modelBox = document.querySelector("#modelBox");
  var subAddress = document.querySelector("#subAddress");
  var subOrderBtn = document.querySelector("#subOrderBtn");
  var allAddress;
  addressList.addEventListener('click',function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    if(!target.classList.contains('delAddress')){

      // 找到当前点击的框的最外面的LI,无论是删除还是选中都要找到这个li
      while(target.nodeName !== "LI"){
        target = target.parentNode;
      }
      var allLi = target.parentNode.querySelectorAll('li');
      for(var i = 0; i < allLi.length; i++){
        allLi[i].classList.remove('selected');
      }
      target.classList.add('selected');         // 这里不使用样式类会出错，不知道为什么

    }else{
      // 找到当前点击的框的最外面的LI,无论是删除还是选中都要找到这个li
      while(target.nodeName !== "LI"){
        target = target.parentNode;
      }

      // 点击删除发起Ajax请求,删除收货地址

      myajax.get('http://h6.duchengjiu.top/shop/api_useraddress.php',
          {
            status:'delete',
            address_id : target.dataset.id,
            token :localStorage.token
          },function(error,jsonData){
            var json = JSON.parse(jsonData);
            if(json.code === 0){
              delAddress(target);
            }
          })

    }
  },false);


  var showAllAddress = document.querySelector("#showAllAddress");
  showAllAddress.addEventListener('click',function() {

    var addressLen = addressList.querySelectorAll('li').length;
    var addressCount = Math.ceil(addressLen / 4 );          //控制每4个为一排
    if(this.innerText === "显示所有地址"){
      animate(addressList,{height:oLiHeight * addressCount},300,'Quad.easeOut',function(){
        flag = !flag;
        controlTxt();
      });
    } else{
      animate(addressList,{height:oLiHeight},300,'Quad.easeOut',function(){
        flag = !flag;
        controlTxt();
      });
    }
  },false);

  newAddress.addEventListener('click',function(){
    showModelBox();
  },false);

  // 点击提交后模态框隐藏,注意form表单提交有默认事件,要先阻止默认事件
  subAddress.addEventListener('click',function(event) {
    event = event || window.event;
    event.preventDefault();
    hidden(modelBox);
  },false);

  // 删除地址
  function delAddress(target){
    addressList.removeChild(target);
  }

  // 控制文本
  function controlTxt(){
    if(flag){
      return showAllAddress.innerText = "显示所有地址";
    }
    return showAllAddress.innerText = "隐藏地址"
  }

  // 显示模态框
  function showModelBox(){
    show(modelBox);
  }


  // ajax部分的操作
  // 查看收货地址的ajax
  function showAddress(){
    myajax.get('http://h6.duchengjiu.top/shop/api_useraddress.php',{token : localStorage.token},function(error,jsondata){
      var json = JSON.parse(jsondata);
      var data = json['data'];
      allAddress = data.length;

      // 添加之前先清空
      addressList.innerHTML = "";
      for(var i = 0; i < data.length; i++){
        addressList.innerHTML += ` <li data-id="${data[i].address_id}">
        <div  class="addressListTitle">
          <span class="province">${data[i].province}</span><span class="city">${data[i].city}</span>
          <span class="name">(<i>${data[i].consignee}</i> 收)</span>
          <i class="delAddress fr">删除</i>
        </div>
        <div class="detailAddressInfor">
          <span class="district">${data[i].district}</span>
          <span class="addressDetail">${data[i].address}
            <i class="addressDTel">${data[i].mobile}</i>
          </span>
        </div>
      </li>`
      }
    })
  }
  showAddress();

  // 添加收货地址的ajax
  subAddress.addEventListener('click',function(event){
    event = event || window.event;
    event.preventDefault();
    var addAddressConForm = document.querySelector('#addAddressConForm');
    var queryString = serializeForm(addAddressConForm);
    console.log(queryString);
    myajax.post('http://h6.duchengjiu.top/shop/api_useraddress.php?status=add&token='+ localStorage.token,
        queryString,function(error,jsonData){
          var json = JSON.parse(jsonData);
          if(json.code === 0){
            showAddress();
          }
        }
    )
  },false);

  // 提交订单
  subOrderBtn.addEventListener('click',function(event){
    var selectedLi = addressList.querySelector('.selected');
    if(!selectedLi){
      alert("请先选择收货地址");
    }else{
      myajax.post('http://h6.duchengjiu.top/shop/api_order.php?token='+localStorage.token+'&status=add&debug=1',
          {
            address_id: selectedLi.dataset.id,
            total_prices : 11111
          },
          function(error,jsonData){
           var json = JSON.parse(jsonData);
           console.log(json);
           if(json.code === 0){
             alert("订单提交成功");
           }else{
             alert("订单提交出错");
           }
          })
    }
  },false);
})();