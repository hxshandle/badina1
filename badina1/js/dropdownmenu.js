// JavaScript Document
$(document).ready(function() {
    function buildSelectItem(itemList, root) {
        root.html('');
        _.each(itemList, function(item) {
            $('<a>').text(item.name).data("address", item.address || null).data("ref", item.id || item.name).data('stores', item.stores || null).attr("href", "javascript:void(0)").appendTo(root);
        });
    }

    function getProvinceCities(provinceId) {
        var province = _.find(SHOPS, function(province) {
            return province.id == provinceId;
        });
        return province.cities;
    }
    // init data
    var provinces = _.map(SHOPS, function(province) {
        return {
            id: province.id,
            name: province.name
        };
    });
    buildSelectItem(provinces, $('#provinceSel .dropdownBorder'));
    $(".dropdown-btn").click(function() {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
        } else {
            $(this).addClass("open");
        }
    });
    var map = new BMap.Map("allmap");

    function markCity(cityName, stores) {
        var g = new BMap.Geocoder();
        _.each(stores, function(store) {
            g.getPoint(store.address, function(point) {
                if (point) {
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                    console.log('point -> ' + point);
                    marker.addEventListener("click", function() {
                        var opts = {
                            width: 350, // 信息窗口宽度
                            height: 150, // 信息窗口高度
                            title: store.name, // 信息窗口标题
                            enableMessage: true, //设置允许信息窗发送短息
                            message: "亲耐滴,戳下面的链接看下地址喔~"
                        };
                        var content = '<a href = "baidu" target="_blank"><img src="'+store.image+'"/></a>'
                        var infoWindow = new BMap.InfoWindow(content, opts);
                        map.openInfoWindow(infoWindow, point); //开启信息窗口
                    });
                }
            }, cityName);
        });
    }

    function bindItemClick(root) {
        $(root).click(function(e) {
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
                // var local = new BMap.LocalSearch($this.text(), {
                // 		renderOptions:{map: map}
                // });
                // local.search(SEARCH_KEY);
            }
            // SHOP
            if ($root.attr('id') == "shopSel") {
                map.clearOverlays();
                var local = new BMap.LocalSearch($this.text(), {
                    renderOptions: {
                        map: map
                    }
                });
                local.search(SEARCH_KEY + " " + $this.data("address"));
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
        var local = new BMap.LocalSearch(cityName, {
            renderOptions: {
                map: map
            }
        });
        local.search(SEARCH_KEY);
    }
    var myCity = new BMap.LocalCity();
    myCity.get(myFun);
});