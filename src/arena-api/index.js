"use strict";

import path from 'path';

import axios from 'axios';

var arena = function( config ) {

    function makeRequest( config, root, slug, action ) {
        return axios({
            url: path.join( root, slug, action ),
            method: 'get',
            responseType: 'json',
            baseURL: config.arena_api
        });
    }

    return {
        channel: function( slug, action ) {

            return makeRequest( config, 'channels', slug || '', action || '');

        },

        block: function( slug, action ) {

            return makeRequest( config, 'blocks', slug || '', action || '');

        },
    };
};

export { arena };
