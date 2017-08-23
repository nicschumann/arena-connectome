"use strict";


function GraphBlockConnectedEdge( source, target, label ) {

    return new GraphEdge( source, target, 'block-connected', label );

}

function GraphInsetEdge( source, target, label ) {

    return new GraphEdge( source, target, 'inset', label );

}

function GraphContainedEdge( source, target, label ) {

    return new GraphEdge( source, target, 'contained', label );

}

function GraphEdge( source, target, type, label ) {
    if (!(this instanceof GraphEdge)) { return new GraphEdge( source, target, type, label ); }
    var self = this;

    self.type = type;
    self.source = source;
    self.target = target;
    self.label = label;

}

GraphEdge.prototype.equals = function( other ) {
    return (other instanceof GraphEdge) && other.source === this.source && other.target === this.target && this.type === other.type && ( typeof this.label !== "undefined") ? this.label.equals( other.label ) : true;
};

/**
 * A simple operation that creates a unique string hash digest for a GraphEdge.
 * edge_hash( A ) === edge_hash( B ) iff edge_equal( A,B ) === true.
 *
 * Used as a custom hash method for the FastSet that Backs the EdgeSet implementation
 *
 * @return String hash
 */
GraphEdge.prototype.hash = function( ) { return ((this.type === "block-connected") ? this.label.id : this.type )+':'+this.source.slug+'->'+this.target.slug; };

export { GraphBlockConnectedEdge, GraphInsetEdge, GraphContainedEdge };
