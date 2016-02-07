block('share').content()(function() {
    return [
        {
            cls: 'ya-share2',
            attrs: {
                'data-services': ['vkontakte', 'facebook', 'twitter', 'odnoklassniki', 'moimir', 'gplus'].join(',')
            }
        },
        {
            block: 'page',
            elem: 'js',
            url: 'https://yastatic.net/share2/share.js'
        }
    ];
});
