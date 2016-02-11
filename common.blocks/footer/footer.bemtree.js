block('footer').content()(function() {
    return [
        {
            elem: 'item',
            content: '© ' + new Date().getFullYear() + ' Станислав&nbsp;Маслов'
        },
        {
            elem: 'item',
            content: [
                [
                    {
                        tag: 'i',
                        cls: 'fa fa-mobile'
                    },
                    ' 8 917 585-78-25'
                ],
                {
                    block: 'link',
                    url: 'mailto:Tam.maslov@yandex.ru',
                    content: [
                        {
                            tag: 'i',
                            cls: 'fa fa-envelope-o'
                        },
                        ' Tam.maslov@yandex.ru'
                    ]
                },
                [
                    {
                        tag: 'i',
                        cls: 'fa fa-skype'
                    },
                    ' Tam-maslov'
                ],
                {
                    block: 'link',
                    url: 'https://vk.com/stasmaslov',
                    content: [
                        {
                            tag: 'i',
                            cls: 'fa fa-vk'
                        },
                        ' stasmaslov'
                    ]
                }
            ].map(function(i) {
                return [i, { tag: 'br' }];
            })
        },
        {
            elem: 'item',
            content: [
                'Разработано в ',
                {
                    block: 'link',
                    url: 'http://tadatuta.com/',
                    content: 'tadatuta.com'
                }
            ]
        }
    ];
});
