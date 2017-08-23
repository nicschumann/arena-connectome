"use strict";

import FastSet from 'collections/fast-set';


/**
 * A simple hash-method for GraphEdges in the backing FastSet behind the EdgeSet.
 * Relies on the underlying hash implementation in the GraphEdge.
 *
 * @param GraphEdge a the edge to compute a hash for.
 * @return String hash
 */
var edge_hash = function( a ) { return a.hash(); }

/**
 * A simple binary equality test for GraphEdges. Relies on the underlying
 * equality implementation on GraphEdges.
 *
 * @param GraphEdge a
 * @param GraphEdge b
 * @return boolean true if a is considered equal to b.
 */
var edge_equal = function( a,b ) { return a.equals( b ); };

/**
 *
 *
 */
function EdgeSet( edges ) { return new FastSet( edges, edge_equal, edge_hash ); }

export { EdgeSet };
