"use strict";

import { NodeSet } from '../graph/graph-node-set.js';
import { EdgeSet } from '../graph/graph-edge-set.js';
import { Graph } from '../graph/graph.js';

import { search_channels } from './search-api-requests.js';

var search_get_channel_graph = function( search_term, api ) {
    return function( next ) {

        search_channels( search_term, api )( function( err, results ) {

            if ( err ) { next( err ); }

            next( null, new Graph( new EdgeSet([]), new NodeSet( results ) ) );

        });

    };
};

export { search_get_channel_graph };
