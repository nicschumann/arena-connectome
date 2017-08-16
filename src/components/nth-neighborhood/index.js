"use strict";

import { get_channel } from './api-get-channel.js';
import { get_block_connections, get_inset_channels, get_containing_channels } from './graph-get-connections.js';

var nth_neighborhood = function( api, transform, d3, config ) {

    var slug = 'la-test';
    var n = 2;

    get_channel( slug, api )( function( err, result ) {

        get_block_connections( result, api )( function( err, result ) {
            if ( err ) console.error(err);

            console.log('block-connections:')
            console.log( result );

        });

        get_inset_channels( result, api )( function( err, result ) {
            if ( err ) console.error(err);

            console.log('inset-connections:');
            console.log( result );

        });

        get_containing_channels( result, api )( function( err, result ) {

            if ( err ) console.error(err);

            console.log('contained-connections:');
            console.log( result );

        });

    });

};


export { nth_neighborhood };
