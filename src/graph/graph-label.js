"use strict";

/**
 *
 */
function GraphLabel( block ) {
    if ( !(this instanceof GraphLabel) ) { return new GraphLabel( block ); }
    var self = this;

    self.id = block.id;
    self.block = block;

}

GraphLabel.prototype.equals = function( other ) { return (other instanceof GraphLabel) && other.id === this.id; } ;

export { GraphLabel };
