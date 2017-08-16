"use strict";

function GraphLabel( block ) {
    if ( !(this instanceof GraphLabel) ) { return new GraphLabel( block ); }
    var self = this;

    self.id = block.id;
    self.block = block;

}

export { GraphLabel };
