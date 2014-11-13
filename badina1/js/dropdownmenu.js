// JavaScript Document
$(document).ready(function () {
  function buildSelectItem(itemList, root) {
    root.html('');
    _.each(itemList, function (item) {
      $('<a>').text(item.name).data("address", item.address || null).data("name",item.name || null).data("ref", item.id || item.name).data('stores', item.stores || null).attr("href", "javascript:void(0)").appendTo(root);
    });
  }

  function getProvinceCities(provinceId) {
    var province = _.find(SHOPS, function (province) {
      return province.id == provinceId;
    });
    return province.cities;
  }

  function getStoresByCityName(cityName) {
    var arr = [];
    for (var i = 0; i < SHOPS.length; i++) {
      var province = SHOPS[i];
      var cities = province.cities;
      var targetCity = _.find(cities, function (city) {
        return city.name == cityName;
      });
      if (targetCity != undefined) {
        arr = targetCity.stores;
        break;
      }
    }
    return arr;
  }

  // init data
  var provinces = _.map(SHOPS, function (province) {
    return {
      id: province.id,
      name: province.name
    };
  });
  buildSelectItem(provinces, $('#provinceSel .dropdownBorder'));
  $(".dropdown-btn").click(function () {
    if ($(this).hasClass("open")) {
      $(this).removeClass("open");
    } else {
      $(this).addClass("open");
    }
  });
  var map = new BMap.Map("allmap");
  var g = new BMap.Geocoder();
  var currentCity = null;

  function addMarker(store, point,needCenter) {
    var marker = new BMap.Marker(point);
    needCenter = needCenter || false;
    map.addOverlay(marker);
    if(needCenter){
      map.centerAndZoom(point,11);
    }
    marker.addEventListener("click", function () {
      var opts = {
        width: 350, // 信息窗口宽度
        height: 250, // 信息窗口高度
        title: store.name, // 信息窗口标题
        enableMessage: true, //设置允许信息窗发送短息
        message: "亲耐滴,戳下面的链接看下地址喔~"
      };
      var content = '<a href = "shop2.html?storeId='+store.storeId+'" target="_blank"><img style="width:100%;height:100%" src="' + store.image + '"/></a>'
      var infoWindow = new BMap.InfoWindow(content, opts);
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
  }

  function markCity(cityName, stores,needCenter) {
    currentCity = cityName;
    _.each(stores, function (store) {
      g.getPoint(store.address, function (point) {
        if (point) {
          addMarker(store, point,needCenter);
        }
      }, cityName);
    });
  }

  function bindItemClick(root) {
    $(root).click(function (e) {
      e.stopPropagation();
      var $root = $(this).parents(".dropdown-btn");
      var $this = $(this);
      $root.removeClass("open");
      if ($root.find(".selectitem").text() == $this.text()) {
        return;
      }
      $root.find(".selectitem").text($this.text());
      // Province
      if ($root.attr('id') == "provinceSel") {
        var cities = getProvinceCities($this.data('ref'));
        buildSelectItem(cities, $('#citySel .dropdownBorder'));
        bindItemClick('#citySel .dropdown-select a');
        currentCity = null;
        $('#citySel .selectitem').text('选择城市');
        $('#shopSel .selectitem').text('选择店铺');
      }
      // City
      if ($root.attr('id') == "citySel") {
        var stores = $this.data('stores');
        buildSelectItem(stores, $('#shopSel .dropdownBorder'));
        bindItemClick('#shopSel .dropdown-select a');
        $('#shopSel .selectitem').text('选择店铺');
        map.centerAndZoom($this.text(), 11);
        map.clearOverlays();
        markCity($this.text(), stores);
      }
      // SHOP
      if ($root.attr('id') == "shopSel") {
        map.clearOverlays();
        markCity(currentCity,[{name:$this.data('name'),address:$this.data('address')}],true);
      }
    });
  }

  bindItemClick('#provinceSel .dropdown-select a');
  // MAP
  map.centerAndZoom(new BMap.Point(116.404, 39.915), 10);
  map.addControl(new BMap.MapTypeControl());
  map.enableScrollWheelZoom(true);
  //根据IP定位
  function myFun(result) {
    var cityName = result.name;
    map.centerAndZoom(cityName, 11);
    markCity(cityName, getStoresByCityName(cityName));
  }

  var myCity = new BMap.LocalCity();
  myCity.get(myFun);
});