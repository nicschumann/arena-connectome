"use strict";

import path from 'path';

import axios from 'axios';
import axiosRetry from 'axios-retry';

var arena = function( config ) {

    var client = axios.create({
        responseType: 'json',
        baseURL: config.arena_api,
    //    params: { noCache: true },
    });

    axiosRetry( client, { retries: 3 });

    function makeRequest( root, slug, action ) {

        return client.get( path.join( root, slug, action ) );

    }

    return {
        channel: function( slug, action ) {

            return makeRequest( 'channels', slug || '', action || '');

        },

        block: function( slug, action ) {

            return makeRequest( 'blocks', slug || '', action || '');

        },

        search: function( type, term ) {

            return makeRequest( 'search', [type || "", '?q=' + term ].join(''), '' );

        }
    };
};

export { arena };
