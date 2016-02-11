block('map').mod('type', 'static')(
    tag()('img'),
    attrs()(function() {
        var ctx = this.ctx,
            src = '//static-maps.yandex.ru/1.x/?l=map&';

        ctx.center || (ctx.center = ctx.point);
        ctx.zoom || (ctx.zoom = 14);

        src += 'll=' + ctx.center.join();
        ctx.width && (src += '&size=' + ctx.width + ',' + ctx.height);
        ctx.point && (src += '&pt=' + ctx.point.join() + ',' + 'pm2orgm');
        ctx.lang && (src += '&lang=' + ctx.lang);
        src += '&z=' + ctx.zoom;

        return {
            src: src,
            width: ctx.width,
            height: ctx.height,
            alt: ''
        };
    })
);
