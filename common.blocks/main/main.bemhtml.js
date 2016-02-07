block('main').content()(function() {
    return {
        elem: 'inner',
        mix: { block: 'page', elem: 'width' },
        content: applyNext()
    };
});
