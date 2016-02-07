modules.define('fotorama', ['i-bem__dom', 'jquery__fotorama'], function(provide, BEMDOM, $) {
    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            js: {
                inited : function() {
                    this.domElem.fotorama(this.params);

                    // this.bindTo('click', function() { return false; });
                }
            }
        }
    }));
});
