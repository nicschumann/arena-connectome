"use strict";

import FastSet from 'collections/fast-set';

var node_hash = function( a ) { return a.slug; };

var node_equal = function( a,b ) { return a.equals( b ); };

function NodeSet( edges ) { return new FastSet( edges, node_equal, node_hash ); }

export { NodeSet };
