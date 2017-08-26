"use strict";

import './style.scss';

import { get_channel } from '../../graph/graph-api-requests.js';
import { build_n_neighborhood } from '../../graph/graph-nth-neighborhood.js';

import { search_get_channel_graph } from '../../search/search-get-graphs.js';

import { SearchFieldRenderer } from '../../render/search-field-renderer.js';
import { DynamicResultsFieldRenderer } from '../../render/dynamic-results-field-renderer.js';
import { DynamicGraphRenderer } from '../../render/dynamic-graph-renderer.js';


var nth_neighborhood = function( api, d3, config ) {

    var N = 1;

    var search_field_renderer = new SearchFieldRenderer( config, d3 );
    var dynamic_results_field_renderer = new DynamicResultsFieldRenderer( config, d3 );
    var graph_renderer = new DynamicGraphRenderer( config, d3 );

    var neighborhood_hooks = {
        neighborhood: graph_renderer.render,
        boundary: graph_renderer.render,
        partial_boundary: graph_renderer.render,
    };

    var graph_hooks = {
        on_node_click: function( d ) {
            build_n_neighborhood( d, 1, api, neighborhood_hooks )( graph_renderer.render );
        }
    }

    var search_hooks = {
        on_input_change: function() {
            search_get_channel_graph( this.value, api )( dynamic_results_field_renderer.render );
        }
    }

    var results_hooks = {
        on_result_click: function( node ) {
            get_channel( node.slug, api )( function( err, root ) {

                build_n_neighborhood( root, N, api, neighborhood_hooks )( graph_renderer.render );

            });
        }
    }

    search_field_renderer.initialize( search_hooks );
    dynamic_results_field_renderer.initialize( results_hooks );
    graph_renderer.initialize( graph_hooks );

};


export { nth_neighborhood };
