"use strict";

import waterfall from 'async/waterfall';
import map from 'async/map';
import FastSet from 'collections/fast-set';

import { get_channel, get_channel_connections, get_channel_channels } from './graph-api-requests.js';
import { GraphBlockConnectedEdge, GraphInsetEdge, GraphContainedEdge } from './graph-edge.js';
import { EdgeSet } from './graph-edge-set.js';
import { NodeSet } from './graph-node-set.js';
import { GraphLabel } from './graph-label.js';
import { Graph } from './graph.js';


var contents_equals = function( a, b ) { return a.id === b.id; };
var contents_hash = function( a, b ) { return a.id+""; };


/**
 * Given a specific node representing a channel, `get_block_connections` returns all channels that are
 * block-connected to the given base-channel. `get_block_connections` is parameterized over an Are.na api instance, and node to treat as
 *
 * @param node GraphNode the node get block-connected channels for.
 * @param node
 * @return ((err, res) -> void) -> void a function to pass to an asynchronous routine
 */
var get_block_connections = function( local_root, api ) {
    /**
     * This function is an asynchronous routine which completes by calling `next` with an edge set of block-connected
     * @param next function (err, res) -> void. A continuation to call once the function has completed its execution.
     */
    return function( next ) {
        waterfall([
            /** 1. Get the set of channels that are block-connected to the local root channel. */
            get_channel_channels( local_root.slug, api ),

            /** 2. Find all edges between the local root and the block-connected channels.
             *  This amounts to the finding labellings for the edges between channels. */
            function( nodes, callback ) {

                var root_set = new FastSet( local_root.channel.contents.filter( function( x ) { return x.base_class === "Block"; }), contents_equals, contents_hash );

                map(
                    nodes,
                    function( node, done ) {

                        get_channel( node.slug, api )( function( err, node ) {

                            if ( err ) { done( err ); }

                            var node_set = new FastSet( node.channel.contents.filter( function( content ) { return content.base_class === "Block"; }), contents_equals, contents_hash );

                            var intersection = root_set.intersection( node_set ).toArray();

                            var edges = intersection.map( function( block ) {
                                var label = new GraphLabel( block );
                                return [ new GraphBlockConnectedEdge( local_root, node, label ) ];
                            });

                            done( null, { edges: edges.flatten(), node: node });

                        });
                    },
                    function( err, results ) {

                        if ( err ) callback( err );

                        callback( null,
                            new Graph(
                                new EdgeSet( results.map( function( x ) { return x.edges; }).flatten() ),
                                new NodeSet( results.map( function( x ) { return x.node; }).concat( [ local_root ] ) )
                            )
                        );

                    }
                );

            }],
            /** 3. Return a local 1-graph containing block-connected edges around the local root. */
            next
        );
    };
};

/**
 * Given a specific node representing a channel, `get_inset_channels` returns all channels that are
 * inset into the given channel.
 *
 * @param node GraphNode the node get block-connected channels for.
 * @param node
 * @return ((err, res) -> void) -> void a function to pass to an asynchronous routine
 */
var get_inset_channels = function( local_root, api ) {

    return function( next ) {
        map(
            /** 1. Get the set of channels that are content for this local_root. */
            local_root.channel.contents.filter( function( content ) { return content.base_class === "Channel"; }),

            /** 2. Create inset edges from the content channels to the local_root */
            function( node, done ) {
                get_channel( node.slug, api )( function( err, node ) {

                    if ( err ) { done( err ); }

                    done( null, { edge: new GraphInsetEdge( node, local_root ), node: node});

                });
            },
            /** 3. Return the set of edges representing inset connections to the local_root. */
            function( err, results ) {
                if ( err ) next(err);

                next( null,
                    new Graph(
                        new EdgeSet( results.map( function( x ) { return x.edge; }) ),
                        new NodeSet( results.map( function( x ) { return x.node; }).concat( [local_root] ) )
                    )
                )
            }
        );
    };

};

/**
 *
 */
var get_containing_channels = function( local_root, api ) {

    return function( next ) {

        waterfall([
                get_channel_connections( local_root.slug, api ),
                function( nodes, callback ) {
                    map(
                        nodes,
                        function( node, done ) {
                            get_channel( node.slug, api )( function( err, node ) {

                                if ( err ) { done( err ); }

                                done( null, { edge: new GraphContainedEdge( local_root, node ), node: node });

                            });
                        },
                        function( err, results ) {
                            if ( err ) callback( err );

                            callback( null,
                                new Graph(
                                    new EdgeSet( results.map( function( x ) { return x.edge; }) ),
                                    new NodeSet( results.map( function( x ) { return x.node; }).concat( [local_root] ) )
                                )
                            );


                        }
                    );
                }
            ],
            next
        );

    };

};

export { get_block_connections, get_inset_channels, get_containing_channels };
