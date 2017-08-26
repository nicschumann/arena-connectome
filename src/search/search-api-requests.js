"use strict";

import { GraphNode } from '../graph/graph-node.js';



/**
 * `get_api_resource` is the base method that defines the request protocol for
 * methods off of the are.na API.
 *
 */
var get_api_resource = function( term, postprocessor, api, config ) {

    var delay = 250;

    return function( next ) {
        setTimeout( function() {

            if ( term === "" ) { next( null, []); }

            api .search( 'channels', term )
                .then( function( result ) {

                        next( null, postprocessor( result.data ) );

                })
                .catch( function( error ) {

                        next( error );

                });
        }, delay);
    };
};


var postprocess_channels_search = function( raw_result ) { return raw_result.channels.map( GraphNode ); };


var search_channels = function( term, api ) { return get_api_resource( term, postprocess_channels_search, api ); };



export { search_channels };
