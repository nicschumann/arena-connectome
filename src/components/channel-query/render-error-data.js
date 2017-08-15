"use strict";

var render_error_data = function( element ) {

        element
            .text( function(d) { return d.message; });

        return element;

};

export { render_error_data };
