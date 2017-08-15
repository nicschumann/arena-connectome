"use strict";

import { markdown } from 'markdown';

function render_channel_data( element ) {

    var h2 = element.append('h2')

    h2
        .append('span')
        .text( function( d ) { return d.generated_title; });

    h2
        .append('br')

    h2
        .append('span')
        .classed('author', true)
        .text( function( d ) { return d.user.full_name; });


    element
        .filter(function(d){ return d.description != null; })
        .append('p')
        .text( function( d ) { return d.description; } );


    return element;
}

export { render_channel_data };
