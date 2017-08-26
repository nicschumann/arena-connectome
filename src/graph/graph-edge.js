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

    var graph_edge = other instanceof GraphEdge;
    var matching_type = this.type === other.type;

    var source_labels_match = this.source.equals( other.source );
    var target_labels_match = this.target.equals( other.target );
    var source_matches_target = this.source.equals( other.target );
    var target_matches_source = this.target.equals( other.source );

    var is_matching_block_connection = (this.type === "block-connected") && ((source_labels_match && target_labels_match) || ( source_matches_target && target_matches_source ));
    var is_matching_contained_connection = (this.type === "contained") && source_labels_match && target_labels_match;
    var is_matching_inset_connection = (this.type === "inset") && source_labels_match && target_labels_match;

    return graph_edge && matching_type && ( is_matching_block_connection || is_matching_inset_connection || is_matching_contained_connection );
};

/**
 * A simple operation that creates a unique string hash digest for a GraphEdge.
 * edge_hash( A ) === edge_hash( B ) iff edge_equal( A,B ) === true.
 *
 * Used as a custom hash method for the FastSet that Backs the EdgeSet implementation
 *
 * @return String hash
 */
GraphEdge.prototype.hash = function( ) {


    if ( this.type === "block-connected" ) {
        return this.label.id + ':' + this.source_target_hash();
    } else {
        return this.type + ':' + this.source + '->' + this.target;
    }
};

/**
 *
 * @return String hash for unordered unlabelled edges.
 */
GraphEdge.prototype.source_target_hash = function() {
    return (( this.source.slug < this.target.slug ) ? this.source.slug : this.target.slug ) + '--' + ((this.source.slug > this.target.slug) ? this.source.slug : this.target.slug);
}

export { GraphBlockConnectedEdge, GraphInsetEdge, GraphContainedEdge };
