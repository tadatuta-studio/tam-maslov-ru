block('social').content()(function() {
    return [
        {
            type: 'vk',
            url: 'http://vk.com/greenzbi'
        },
        {
            type: 'instagram',
            url: 'https://instagram.com/grisha_grinenko/'
        },
        {
            type: 'facebook',
            url: 'https://www.facebook.com/greenzbi'
        },
        {
            type: 'youtube',
            url: 'https://youtube.com/channel/UCGkC8-5vE6Bg6x5kyebocXQ/'
        },
        {
            type: 'twitter',
            url: 'https://twitter.com/grisha_grinenko/'
        }
    ].map(function(item) {
        return {
            block: 'link',
            mix: {
                block: 'social',
                elem: 'link',
                elemMods: { type: item.type }
            },
            cls: 'fa fa-' + item.type,
            url: item.url
        };
    });
});
