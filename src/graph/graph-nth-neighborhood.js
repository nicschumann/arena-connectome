import { get_block_connections, get_inset_channels, get_containing_channels } from './graph-get-connections.js';
import parallel from 'async/parallel';
import map from 'async/map';

import { NodeSet } from './graph-node-set.js';
import { TrivialGraph, EmptyGraph } from './graph.js';

function build_n_neighborhood( root, n, api, hooks) {

    hooks = hooks || {};


    var encountered_nodes = new NodeSet([]);

    /**
     * (k,A)-neighborhood = (k-1,A)-neighborhood + (k,A)-boundary
     */
    function neighborhood_k_of_n( local_root, k, n, k_less_1_neighborhood, k_less_2_neighborhood, next ) {

        console.log( '[METHOD ENTRY] iteration %d of %d', k, n );

        if ( typeof hooks.neighborhood === "function" ) { hooks.neighborhood( null, k_less_1_neighborhood ); }

        if ( k === n + 1 ) {

            next( null, k_less_1_neighborhood );

        } else {

            var k_less_1_boundary_nodes = k_less_1_neighborhood.nodeset.difference( k_less_2_neighborhood.nodeset ).toArray();

            boundary_k_of_n( local_root, k_less_1_boundary_nodes, function( err, k_boundary ) {

                if ( err ) { next( err ); }

                neighborhood_k_of_n(
                    local_root,
                    k + 1,
                    n,
                    k_less_1_neighborhood.union( k_boundary ),
                    k_less_1_neighborhood,
                    next
                );

            });

        }
    }

    /**
     * (1,A)-neighborhood = block-connected-to(A) U inset-in(A) U containing(A)
     */
    function neighborhood_1_of_1( local_root, next ) {

        if ( encountered_nodes.has( local_root ) ) { next( null, EmptyGraph() ); }

        parallel({

            block_connections: get_block_connections( local_root, api ),

            /**
             * Removing get_inset_channels, because:
             */
            inset_channels: get_inset_channels( local_root, api ),
            //
            //containing_channels: get_containing_channels( local_root, api )

        }, function( err, results ) {

            if ( err ) next( err );

            encountered_nodes.add( local_root );

            var block_connections = results.block_connections || EmptyGraph();
            var inset_connections = results.inset_channels || EmptyGraph();
            var containing_connections = results.containing_channels || EmptyGraph();

            var partial_boundary = block_connections.union( containing_connections.union( inset_connections ) );

            if ( typeof hooks.partial_boundary === "function" ) { hooks.partial_boundary( err, partial_boundary ); }

            next( null, partial_boundary );
        });

    }

    /**
     * (k,A)-boundary = (k,A)-neighborhood - (k-1,A)-neighborhood ~=
     * (k,A)-boundary = Union[ X in (k-1,A)-boundary ]{ (1,X)-neighborhood }
     *
     * @param local_root GraphNode a node representing the local root of this boundary.
     * @param k_less_1_boundary_nodes Array[GraphNode] an array of GraphNodes representing the nodes in the k
     */
    function boundary_k_of_n( local_root, k_less_1_boundary_nodes, next ) {
        map(
            k_less_1_boundary_nodes,
            neighborhood_1_of_1,
            function( err, results ) {
                if ( err ) { next( err ); }

                var total_boundary = results.reduce( function( a,b ) { return a.union( b ) }, EmptyGraph() )

                if ( typeof hooks.boundary === "function" ) { hooks.boundary( err, total_boundary ); }

                next( null, total_boundary );

            }
        );
    }

    return function( next ) {
        return neighborhood_k_of_n(
            root,
            1,
            n,
            TrivialGraph( root ),
            EmptyGraph(),
            next
        );
    };
}

export { build_n_neighborhood };
