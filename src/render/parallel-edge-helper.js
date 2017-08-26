"use strict"

function ParallelEdgeHelper( config ) {
    if ( !(this instanceof ParallelEdgeHelper)) { return new ParallelEdgeHelper( config ); }
    var self = this;

    config.intermediate_offset_unit = config.intermediate_offset_unit || 30;

    self.edgemap = {};

    function build_intermediate_offset( start, end, sign, offset ) {

        var multiplier = offset * sign * config.intermediate_offset_unit;

        var midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

        var perp = [end[1] - start[1], start[0] - end[0]];
        var perp_length = Math.sqrt( Math.pow( perp[0], 2) + Math.pow( perp[1], 2) );
        var perp_norm = [ multiplier * perp[0] / perp_length, multiplier * perp[1] / perp_length ];

        // console.log( 'perpindicular offset (normalized):');
        // console.log( perp_norm );
        // console.log( 'real midpoint:');
        // console.log( midpoint );

        return [ midpoint[0] + perp_norm[0], midpoint[1] + perp_norm[1] ];

    }


    self.build_multiplier = function ( edge ) {
        var hash = edge.source_target_hash();

        if ( typeof self.edgemap[ hash ]  === "undefined" ) {
            self.edgemap[ hash ] = {count: 1, offset: 1 };

            edge.sign = -1;
            edge.offset = 1;

        } else {
            self.edgemap[ hash ] = {
                count: self.edgemap[hash].count + 1,
                offset: self.edgemap[hash].offset + ((self.edgemap[hash].count + 1) % 2)
            };

            edge.sign = (self.edgemap[ hash ].count % 2 === 0) ? 1 : -1;
            edge.offset = self.edgemap[ hash ].offset;

        }

        return edge;

    };


    self.smooth_multiplier = function( edge ) {

        if ( self.edgemap[ edge.source_target_hash() ].count === 1 ) {

            edge.sign = 1;
            edge.offset = 0;

        }

        return edge;

    }

    self.multiplier = function( edge ) { return self.smooth_multiplier( self.build_multiplier( edge )); };


    self.render_bezier_curve = function( edge ) {
        var start = [ edge.source.x, edge.source.y ];
        var end = [ edge.target.x, edge.target.y ];

        var mid = build_intermediate_offset( start, end, edge.sign, edge.offset );

        return ['M',start[0],',',start[1],' Q',mid[0],',',mid[1],' ',end[0],',',end[1]].join('')
    }

    self.counts = function() { return self.edgemap; };

    self.reset_counts = function() { self.edgemap = {}; return self; };

}

export { ParallelEdgeHelper };
