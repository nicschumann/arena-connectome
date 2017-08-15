"use strict";

import { markdown } from 'markdown';

function render_channel_data( element ) {

    element
        .append('h2')
        .text( function( d,i ) { return d.generated_title; });

    element
        .filter(function(d){ return d.description != null; })
        .append('p')
        .text( function( d ) { return d.description; } );


    return element;
}

export { render_channel_data };
