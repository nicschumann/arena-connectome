"use strict";

import uuid from 'node-uuid';

import { EmptyGraph } from '../graph/graph.js';

var no_op = function() {};

function DynamicResultsFieldRenderer( config, d3 ) {
    if (!(this instanceof DynamicResultsFieldRenderer)) { return new DynamicResultsFieldRenderer( config, d3 ); }
    var self = this;

    var id = 'comp__' + uuid.v4();

    config.hooks = config.hooks || {};

    config.root = config.root || d3.select('main#root');
    config.results_root = config.results_root || config.root.select('section#content').append('div').classed('results-field', true).attr('id', id );
    config.results = config.results || EmptyGraph();

    var result_rep;

    var initialized = false;

    self.initialize = function( hooks ) {

        hooks = hooks || {};

        config.hooks.on_result_click = hooks.on_result_click || config.hooks.on_result_click || no_op;

        if ( !initialized ) {

            initialized = true;

        }

        return self;
    };

    self.render = function( err, graph ) {
        if ( !initialized ) { throw new Error('DynamicResultsFieldRenderer: component not initialized! call .initialize() prior to rendering.'); }

        console.log( 'test' );

        config.results = graph;

        result_rep = config.results_root.selectAll('.result').data( config.results.nodeset.toArray(), function ( d ) { return d.hash(); } );
        result_rep.exit().remove().merge( result_rep );

        result_rep = result_rep.enter()
            .append('div')
            .classed('result', true)
            .attr('id', function(d) { return d.slug; })
            .merge( result_rep )
            .on('click', config.hooks.on_result_click);

        result_rep.select('*').remove();

        result_rep.append('h6')
            .classed('channel-title', true)
            .text( function( d ) { return d.channel.title + ' ' + d.channel.length; })
            .merge( result_rep );


        return self;
    };

}

export { DynamicResultsFieldRenderer };
