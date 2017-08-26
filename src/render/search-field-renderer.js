"use strict";

import uuid from 'node-uuid';

var no_op = function() {};

function SearchFieldRenderer( config, d3 ) {
    if (!(this instanceof SearchFieldRenderer)) { return new SearchFieldRenderer( config, d3 ); }
    var self = this;

    var id = 'comp__' + uuid.v4();

    config.hooks = config.hooks || {};

    config.root = config.root || d3.select('main#root');
    config.search_field = config.search_field || config.root.select('section#content').append('input').classed('channel-search', true).attr('id', id);

    var initialized = false;

    self.initialize = function( hooks ) {

        hooks = hooks || {};

        config.hooks.on_input_change = hooks.on_input_change || config.hooks.on_input_change || no_op;

        if ( !initialized ) {

            config.search_field.node().focus();

            config.search_field.on('change', config.hooks.on_input_change )

            initialized = true;

        }

        return self;

    };

    self.render = function( err, results ) {
        if ( !initialized ) { throw new Error('SearchFieldRenderer: component not initialized! call .initialize() prior to rendering.'); }

        return self;

    };

}

export { SearchFieldRenderer };
