"use strict";

/**
 * A `GraphNode` represents a channel in our graph.
 * It can be inspected for raw API metadata, and easily compared for equality.
 *
 * @param channel a JSON object representing an Are.na channel. The channel should be a raw API response.
 * @return GraphNode a graph node representation of this channel, with a preferred equality test.
 */
function GraphNode( channel ) {
    if (!(this instanceof GraphNode)) { return new GraphNode( channel ); }
    var self = this;

    self.slug = channel.slug;
    self.id = channel.id;

    self.channel = channel;

}

/**
 * This test implements an equality comparison for `GraphNode`s
 *
 * @param other GraphNode the other node to compare against.
 * @return bool true if other == this.
 */
GraphNode.prototype.equals = function( other ) {

    return (other instanceof GraphNode) && other.slug === this.slug && other.id === this.id;

};

/**
 * A hash of a GraphNode is simply it's unique identifier – which is its Are.na channel slug.
 *
 * @return String hash
 */
GraphNode.prototype.hash = function( ) { return this.slug; };


export { GraphNode };
