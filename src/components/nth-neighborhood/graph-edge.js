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
    return (other instanceof GraphEdge) && other.source === this.source && other.target === this.target && this.label.equals( other.label ) && this.type === other.type;
};

export { GraphBlockConnectedEdge, GraphInsetEdge, GraphContainedEdge };
