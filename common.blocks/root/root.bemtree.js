block('root').replace()(function() {
    var data = this.ctx.data,
        relPathToRoot = data.relPathToRoot,
        url = data.url,
        i = 0,
        pages = data.pages,
        len = pages.length;

    // get current page
    for (; i < len; i++) {
        if (pages[i].url === url) {
            this.page = pages[i];
            break;
        }
    }

    this.data = data;

    return {
        block: 'page',
        title: this.page.title,
        favicon: relPathToRoot + 'favicon.ico',
        head: [
            { elem: 'meta', attrs: { name: 'description', content: 'разработка проектов для зданий и сооружений, 3D-визуализация, организация строительства домов и коттеджей' } },
            { elem: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },
            { elem: 'css', url: 'https://fonts.googleapis.com/css?family=PT+Sans&subset=latin,cyrillic' },
            { elem: 'css', url: relPathToRoot + 'index.min.css' },
            { elem: 'css', url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' },
            [57, 60, 72, 76, 114, 120, 144, 152, 180].map(function(size) {
                return {
                    tag: 'link',
                    attrs: { rel: 'apple-touch-icon', sizes: size + 'x' + size, href: relPathToRoot + 'apple-icon-' + size + 'x' + size + '.png' }
                };
            }),
            [192, 32, 96, 16].map(function(size) {
                return {
                    tag: 'link',
                    attrs: { rel: 'icon', type: 'image/png', sizes: size + 'x' + size, href: relPathToRoot + (size === 192 ? 'android-icon-' : 'favicon-') + size + 'x' + size + '.png' }
                };
            }),
            {
                tag: 'link',
                attrs: { rel: 'manifest', href: relPathToRoot + 'manifest.json' }
            }
        ],
        scripts: [{ elem: 'js', url: relPathToRoot + 'index.min.js' }]
    };
});
