"use strict";

var merge = function( a, b, compare, strategy ) {

    compare = compare || function( a, b ) { return a === b; }

    for ( var i = 0; i<a.length; i++ ) {
        for ( var j = 0; j < b.length; j++ ) {
            if ( b[j] === null ) continue;

            if ( compare( a[i], b[j] ) ) {
                a[i] = strategy( a[i], b[j] );
                b[j] = null;
                break;
            }
        }
    }

    return a.concat( b.filter( function( x ) { return x !== null; } ));

}

merge.StrategyKeepLeft = function( a_item, b_item ) { return a_item; };

merge.StrategyKeepRight = function( a_item, b_item ) { return b_item; };

export { merge };
