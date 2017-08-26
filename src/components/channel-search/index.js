"use strict";

import { get_channel } from '../../graph/graph-api-requests.js';
import { build_n_neighborhood } from '../../graph/graph-nth-neighborhood.js';

import { search_get_channel_graph } from '../../search/search-get-graphs.js';
import { SearchFieldRenderer } from '../../render/search-field-renderer.js';
import { DynamicGraphRenderer } from '../../render/dynamic-graph-renderer.js';

var channel_search = function( api, d3, config ) {

    var search_field_renderer = new SearchFieldRenderer( config, d3 );
    var dynamic_graph_renderer = new DynamicGraphRenderer( config, d3 );

    var neighborhood_hooks = {
        neighborhood: dynamic_graph_renderer.render,
        boundary: dynamic_graph_renderer.render,
        partial_boundary: dynamic_graph_renderer.render,
    };

    var graph_hooks = {
        on_node_click: function( node ) {
            get_channel( node.slug, api )( function( err, root ) {

                build_n_neighborhood( root, 1, api, neighborhood_hooks )( dynamic_graph_renderer.render );

            });
        }
    }

    dynamic_graph_renderer.initialize( graph_hooks );

    search_field_renderer.initialize( { on_input_change: function( d ) {
        search_get_channel_graph( this.value, api )( function(err, data) {
            dynamic_graph_renderer.initialize();
            dynamic_graph_renderer.render( err, data );
        });
    }});

};

export { channel_search };
