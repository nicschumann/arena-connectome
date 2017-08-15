"use strict";

import uuid from 'node-uuid';
import FastSet from 'collections/fast-set';
import parallel from 'async/parallel';
import each from 'async/each';

var nth_neighborhood = function( api, transform, d3, config ) {

    var owner = 'comp__' + uuid.v4();
    var input_slug_id = 'inp__' + uuid.v4();
    var input_n_id = 'inp__' + uuid.v4();
    var output_id = 'out__' + uuid.v4();

    var DEBUG = false;

    var root, input_slug, input_n, output, errors;

    var slug = "the-father";

    var n = 2;

    function initial() {

        update_selections();

        input_slug = root
                        .select('section#content')
                        .append('input')
                        .classed( owner, true )
                        .attr('id', input_slug_id)
                        .on('change', function() {
                            slug = this.value;
                            get_root( slug, n, function( result ) { console.log( 'in [callback]: done.' ); console.log( result ); });
                        } );

        input_n = root
                        .select('section#content')
                        .append('input')
                        .classed( owner, true )
                        .attr('id', input_n_id)
                        .on('change', function() {
                            n = this.value;
                            get_root( slug, n, function( result ) { console.log( 'in [callback]: done.' ); console.log( result ); });
                        } );

        // output
        //     .data( output_ids )
        //     .enter()
        //     .append( 'ul' )
        //     .classed( owner, true )
        //     .attr( 'id', function( d ) { return d; } );

        errors
            .data([])
            .enter()
            .append('div')
            .classed( owner, true )
            .text( function(d) { return d.message; });

    }

    function update_selections() {

        root = d3.select('main#root');

        output = root
                    .select('section#content');
                    /** TODO: hook this up to force graph */

        errors = root
                    .select( 'section#errors' )
                    .selectAll( ['div', '.', owner ].join('') );

    }
    /**
     * Contains the set of slugs of channels that have been roots in the get_channel routine.
     *
     */
    var roots = new FastSet();

    function get_root( root, n, callback ) {
        get_channel(
            root,
            n,
            {
                root: root,
                channels: {},
                blocks: new FastSet([], block_equal, block_hash)
            },
            callback
        );
    }



    function get_channel( local_root, k, final_result, callback ) {

        console.log( 'level: %d; root: %s', n - k, local_root );

        var visited = roots.has( local_root );

        if ( k === 0 && !visited ) {
            if ( DEBUG ) console.log('in [get_channel]: distance k = n = '+ n +' reached.');

            roots.add( local_root );

            api .channel( local_root )
                .then( function( response ) {

                    final_result.channels[ local_root ] = response.data;
                    callback( final_result );

                } );

        } else if ( visited ) {
            if ( DEBUG ) console.log('in [get_channel]: local root \"'+ local_root +'\" in collection.');

            callback( final_result );

        } else {
            /** console.log('in [get_channel]: distance k = '+ (n - k) +' reached.'); */

            parallel({
                root: function( next ) {
                    api .channel( local_root )
                        .then( function( response ) { next(null, response.data); } )
                        //.catch( next );
                },
                channels: function( next ) {
                    api .channel( local_root, 'channels' )
                        .then( function( response ) { next(null, response.data.channels ); } )
                        //.catch( next );
                }
            },
            function(err, results) {
                if ( err ) {

                    console.error( err );

                } else {

                    console.log( results );

                    /** 1. Add the local root to the set of visited nodes */
                    roots.add( local_root );

                    var relevant_channels = results.channels.filter( function( channel_object ) { return !roots.has( channel_object.channel.slug ); });

                    /** 2. Update channels in final result, resolve blocks between channel and local_root */
                    final_result.channels[ local_root ] = results.root;

                    var root_set = new FastSet( results.root.contents, block_equal, block_hash );

                    each(
                        relevant_channels,
                        function( channel_object, next ) {

                            api .channel( channel_object.channel.slug )
                                .then( function( response ) {

                                    var intersection = new FastSet( response.data.contents ).filter( function( block ) { return root_set.has( block ); })

                                    final_result.blocks = final_result.blocks.union( intersection );
                                    get_channel( channel_object.channel.slug, k - 1, final_result, noop );

                                    next();

                                })
                                .catch( next )

                        },
                        function( err ) {
                            if ( err ) console.error( err );

                            callback( final_result );

                        }
                     );

                }

            });

        }

    }

    initial();
    get_root( slug, n, function( result ) { console.log( 'in [callback]: done.' ); console.log( result ); });

};


var block_equal = function( a, b ) { return a.id === b.id; }
var block_hash = function( a ) { return "" + a.id; }

var noop = function() {};


export { nth_neighborhood };
