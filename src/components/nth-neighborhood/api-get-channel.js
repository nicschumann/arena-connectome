"use strict";

import { GraphNode } from './graph-node.js';



var get_api_resource = function( slug, modifier, postprocessor, api ) {
    return function( next ) {
        api .channel( slug, modifier )
            .then( function( result ) {

                    next( null, postprocessor( result.data ) );

            })
            .catch( function( error ) {

                    next( error );

            });
    };
};


var postprocess_channel = function( raw_result ) { return new GraphNode( raw_result ); };

var postprocess_channel_connections = function( raw_result ) { return raw_result.channels.map( GraphNode ); };

var postprocess_channel_channels = function( raw_result ) { return raw_result.channels.map( function( result ) { return new GraphNode( result.channel ); } ); };


var get_channel = function( slug, api ) { return get_api_resource( slug, '', postprocess_channel, api ); };

var get_channel_connections = function( slug, api ) { return get_api_resource( slug, 'connections', postprocess_channel_connections, api ); };

var get_channel_channels = function( slug, api ) { return get_api_resource( slug, 'channels', postprocess_channel_channels, api ); };



export { get_channel, get_channel_connections, get_channel_channels };
