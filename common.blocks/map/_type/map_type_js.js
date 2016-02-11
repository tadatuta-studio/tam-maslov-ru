/* global ymaps */
modules.define('map', ['i-bem__dom', 'loader_type_js'], function(provide, BEMDOM, Loader) {

var apiUrl = 'https://api-maps.yandex.ru/2.1/';

provide(BEMDOM.decl({ block: this.name, modName: 'type', modVal: 'js' }, {
    onSetMod: {
        js: {
            inited: function() {
                var _this = this;

                typeof ymaps === 'undefined' ? Loader(apiUrl + '?lang=' + (this.params.lang || 'ru_RU'), function() {
                    ymaps.ready(_this.onLoad, _this);
                }) : ymaps.ready(_this.onLoad, _this);
            }
        }
    },
    onLoad: function() {
        var params = this.params,
            points = params.points;

        this._map = new ymaps.Map(this.domElem.get(0), {
            center: points && points[0] || [55.367315, 37.537928],
            zoom: params.zoom || 14,
            behaviors: []
        });

        points.forEach(function(point) {
            this.addPlacemark(point);
        }, this);

        points.length > 1 && this.setBounds(this.getBounds(points));

        return this;
    },
    getMap: function() {
        return this._map;
    },
    addPlacemark: function(point, props, options) {
        var placemark = new ymaps.Placemark(point, props, options);

        this.getMap().geoObjects.add(placemark);

        return placemark;
    },
    getBounds: function(points) {
        return points.reduce(function(prev, cur) {
            if (!prev[0]) return [[].concat(cur), [].concat(cur)];

            if (prev[0][0] > cur[0]) {
                prev[0][0] = cur[0];
            }

            if (prev[0][1] > cur[1]) {
                prev[0][1] = cur[1];
            }

            if (prev[1][0] < cur[0]) {
                prev[1][0] = cur[0];
            }

            if (prev[1][1] < cur[1]) {
                prev[1][1] = cur[1];
            }

            return prev;
        }, []);
    },
    setBounds: function(point1, point2) {
        if (!point2) {
            point2 = point1[1];
            point1 = point1[0];
        }

        this.getMap().setBounds([point1, point2]);

        return this;
    },
    panTo: function(point) {
        this.getMap().panTo(point, {
            delay: 500 // Задержка между перемещениями
        });

        return this;
    }
}));

});
