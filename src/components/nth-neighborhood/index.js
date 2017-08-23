"use strict";

import './style.scss';

import { get_channel } from '../../graph/graph-api-requests.js';
import { build_n_neighborhood } from '../../graph/graph-nth-neighborhood.js';

import { merge } from '../../utilities/merge.js';

var nth_neighborhood = function( api, transform, d3, config ) {

    var slug = 'the-father';
    var n = 2;

    var width = 960;

    var height = 500;

    var root = d3.select('main#root');

    var svg_root = root.select('section#content')
        .append('svg')
        .classed('graph', true)
        .attr('width', width)
        .attr('height', height);

    var graph_edges = [];
    var graph_nodes = [];

    var simulation = d3.forceSimulation( graph_nodes )
        .force('charge', d3.forceManyBody().strength( -1000 ) )
        .force('link', d3.forceLink( graph_edges ).distance( 200 ).id( function( d ) { return d.hash(); }) )
        .force('x', d3.forceX() )
        .force('y', d3.forceY() )
        .alphaDecay( 0.75 )
        .alphaTarget( 1 )
        .on( 'tick', ticked );

    var g_root = svg_root.append('g').classed('graph', true).attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    var node_rep = g_root.append('g').classed('nodes', true).selectAll('.node');
    var edge_rep = g_root.append('g').classed('edges', true).selectAll('.edge');

    function restart( graph ) {
        simulation.stop()

        graph_nodes = merge(
            graph_nodes,
            graph.nodeset.toArray(),
            function( a,b ) { return a.equals( b ); },
            merge.StrategyKeepLeft
        );

        graph_edges = merge(
            graph_edges,
            graph.edgeset.toArray().map( function( x ) { x.source = x.source.hash(); x.target = x.target.hash(); return x; }),
            function( a,b ) { return a.equals( b ); },
            merge.StrategyKeepLeft
        );

        simulation.nodes( graph_nodes );
        simulation.force('link').links( graph_edges );

        node_rep = node_rep.data( graph_nodes, function( d ) { return d.hash(); } );

        node_rep.exit().transition()
            .attr('r', 0)
            .remove();

        node_rep = node_rep.enter().append('circle')
            .attr('class', 'node')
            .attr('data-id', function(d) { return d.hash(); })
            .attr('r', 4)
            .merge( node_rep );

        edge_rep = edge_rep.data( graph_edges, function( d ) { return d.hash(); });
        edge_rep.exit().remove();
        edge_rep = edge_rep.enter().append('line')
            .attr('class', 'edge')
            .attr('data-source-id', function(d) { return d.source.hash(); })
            .attr('data-target-id', function(d) { return d.target.hash(); })
            .merge( edge_rep );

        simulation.restart()

    }

    function ticked() {
        node_rep.attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });

        edge_rep.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });
    }

    // function ticked() {
    //     edge
    //         .attr('x1', function( d ) { return d.source.x; })
    //         .attr('y1', function( d ) { return d.source.y; })
    //         .attr('x2', function( d ) { console.log( d ); return d.target.x; })
    //         .attr('y2', function( d ) { return d.target.y; });
    //
    //     node
    //         .attr('cx', function( d ) { return d.x; })
    //         .attr('cy', function( d ) { return d.y; });
    // }
    //
    // function dragstarted( d ) {
    //     if ( !d3.event.active ) simulation.alphaTarget(0.3).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    // }
    //
    // function dragged( d ) {
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    // }
    //
    // function dragended( d ) {
    //     if ( !d3.event.active ) simulation.alphaTarget( 0.0 );
    //     d.fx = null;
    //     d.fx = null;
    // }



    get_channel( slug, api )( function( err, root ) {

        var hooks = {
            neighborhood: function( x ) {

                restart( x );

            },
            // boundary: function( x ) {
            //     console.log('boundary:');
            //     console.log( x.edgeset.toArray() );
            //     console.log('');
            // },
            // partial_boundary: function( x ) {
            //     console.log('partial-boundary:');
            //     console.log( x.edgeset.toArray() );
            //     console.log('');
            // }
        }

        build_n_neighborhood( root, n, api, hooks )( function( err, neighborhood ) {

            if ( err ) { console.error( err ); }

            console.log( graph_nodes );
            console.log( graph_edges );

            console.log('DONE');

        });

    });

};


export { nth_neighborhood };
