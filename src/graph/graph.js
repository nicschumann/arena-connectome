"use strict";

import { NodeSet } from './graph-node-set.js';
import { EdgeSet } from './graph-edge-set.js';

function Graph( edgeset, nodeset ) {
    if (!(this instanceof Graph)) { return new Graph( edgeset, nodeset ); }
    var self = this;

    self.edgeset = edgeset;
    self.nodeset = nodeset;

}

Graph.prototype.equals = function( other ) {
    return this.edgeset.equals( other.edgeset ) && this.nodeset.equals( other.nodeset );
};

Graph.prototype.union = function( other ) {
    return new Graph( this.edgeset.union( other.edgeset ), this.nodeset.union( other.nodeset ) );
}


function TrivialGraph( node ) { return new Graph( new EdgeSet([]), new NodeSet([ node ]) ); }

function EmptyGraph( ) { return new Graph( new EdgeSet([]), new NodeSet([]) ); }


Graph.prototype.merge = Graph.prototype.union;

export { Graph, TrivialGraph, EmptyGraph };
