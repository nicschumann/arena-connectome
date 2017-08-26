"use strict";

import { GraphNode } from './graph-node.js';


/**
 * `get_api_resource` is the base method that defines the request protocol for
 * methods off of the are.na API.
 *
 */
var get_api_resource = function( slug, modifier, postprocessor, api, config) {

    var delay = 250;

    return function( next ) {
        setTimeout( function() {

            api .channel( slug, modifier )
                .then( function( result ) {

                        next( null, postprocessor( result.data ) );

                })
                .catch( function( error ) {

                        next( error );

                });
        }, delay);
    };
};


var postprocess_channel = function( raw_result ) { return new GraphNode( raw_result ); };

var postprocess_channel_connections = function( raw_result ) { return raw_result.channels.map( GraphNode ); };

var postprocess_channel_channels = function( raw_result ) { return raw_result.channels.map( function( result ) { return new GraphNode( result.channel ); } ); };


var get_channel = function( slug, api ) { return get_api_resource( slug, '', postprocess_channel, api ); };

var get_channel_connections = function( slug, api ) { return get_api_resource( slug, 'connections', postprocess_channel_connections, api ); };

var get_channel_channels = function( slug, api ) { return get_api_resource( slug, 'channels', postprocess_channel_channels, api ); };



export { get_channel, get_channel_connections, get_channel_channels };
