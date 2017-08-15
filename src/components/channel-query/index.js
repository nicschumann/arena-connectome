"use strict";

import uuid from 'node-uuid';
import { render_channel_data } from './render-channel-data.js';

/**
 * A channel query is a simple request to get information on a channel.
 * It consists of an input field which accepts user input, and an output field,
 * which displays basic information about the channel.
 */

var channel_query = function( api, transform, d3, config ) {

    /**
     * Unique Component Identifier for the application lifecycle.
     */
    var owner = 'comp__' + uuid.v4();

    var input_ids = [ uuid.v4() ].map( function( id ) { return 'inp__' + id; });
    var output_ids = [ uuid.v4() ].map( function( id ) { return 'out__' + id; });

    var root, inputs, outputs, errors;


    function initial() {

        update_selections();

        inputs
            .data( input_ids )
            .enter()
            .append('input')
            .classed( owner, true )
            .attr('id', function(d) { return d; })
            .on('change', transition_get_channel );

        outputs
            .data( output_ids )
            .enter()
            .append( 'ul' )
            .classed( owner, true )
            .attr( 'id', function( d ) { return d; } );

        errors
            .data([])
            .enter()
            .append('div')
            .classed( owner, true )
            .text( function(d) { return d.message; })

            .exit()
            .remove();

    }

    function update_selections() {

        root = d3.select('main#root');

        inputs = root
                    .select('section#content')
                    .selectAll( ['input', '.', owner ].join('') );

        outputs = root
                    .select('section#content')
                    .selectAll( ['ul', '.', owner ].join('') );

        errors = root
                    .select( 'section#errors' )
                    .selectAll( ['div', '.', owner ].join('') );

    }

    function transition_get_channel( d, i ) {

        var channel_name = d3.select( ['#', d].join('') ).property('value');

        api .channel( channel_name )
            .then( transition_format_channel )
            .catch( fail_channel_error );

    }

    function transition_format_channel( d ) {

        transition_empty();

        render_channel_data(

            root
                .select('section#content')
                .select( ['ul', '.', owner ].join('') )
                .selectAll('li')
                    .data( d.data.contents )
                    .enter()
                    .append('li')

        );

    }

    function fail_channel_error( d ) {

        transition_empty();

        console.log( d );

        render_error_data(

            root
                .select( 'section#errors' )
                .select( ['div', '.', owner ].join('') )
                .data([ d ])

                .enter()
                .append('div')
                .classed( owner, true )

        );

    }

    function transition_empty() {

        root
            .select( 'section#errors' )
            .selectAll( ['div', '.', owner ].join('') )
            .data([])
            .exit()
            .remove();

        root
            .select('section#content')
            .select( ['ul', '.', owner ].join('') )
            .selectAll('li')
            .data([])
            .exit()
            .remove();

    }

    initial();

};

function render_error_data( element ) {

    return element
        .text( function(d) { return d.message; });

}

export { channel_query };
