block('nav').content()(function() {
    var data = this.data;

    return data.pages.map(function(page) {
        var content = page.title === 'Главная' ? { cls: 'fa fa-home' } : page.title;
        
        return page.url === data.url ? {
            block: this.block,
            elem: 'item',
            elemMods: { active: true },
            content: content
        } : {
            block: 'link',
            mix: { block: this.block, elem: 'item' },
            url: page.url ? data.relPathToRoot + page.url + '/' : data.relPathToRoot,
            content: content
        };
    }, this);
});
