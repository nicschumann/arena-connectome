"use strict";

import { EmptyGraph } from '../graph/graph.js';
import { ParallelEdgeHelper } from './parallel-edge-helper.js';

var no_op = function() {};

function DynamicGraphRenderer( config, d3 ) {
    if ( !(this instanceof DynamicGraphRenderer)) { return new DynamicGraphRenderer( config, d3 ); }
    var self = this;

    config = config || { };

    config.hooks = config.hooks || {};
    config.graph = config.graph || new EmptyGraph();

    config.radius = config.radius || 0.05;
    config.label_offset = config.label_offset || 10;
    config.intermediate_offset_unit = config.intermediate_offset_unit || 30;

    config.root = config.root || d3.select('main#root');
    config.width = config.width || window.innerWidth;
    config.height = config.height || window.innerHeight;
    config.svg_root = config.svg_root || config.root.select('section#content').append('svg').attr('width', config.width).attr('height', config.height);


    var initialized = false;

    var g_root, edge_rep, node_rep;

    var simulation, parallel_edge_helper;


    function dragstarted( d ) {
        if ( !d3.event.active ) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged( d ) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended( d ) {
        if ( !d3.event.active ) simulation.alphaTarget( 0.0 );
        d.fx = null;
        d.fy = null;
    }

    function zoomed( d ) {

        console.log( d3.event.transform );

        g_root.attr(
            'transform',
            'translate(' + (config.width / 2 + d3.event.transform.x) + ',' + (config.height / 2 + d3.event.transform.y) + ')' +
            'scale(' + d3.event.transform.k + ')'
        );
    }

    /**
     * Every renderer should support a .initialize() method. This function
     * is responsible for setting up the DOM resources needed for rendering,
     * as well as any required support markup. It also initializes a physics
     * simulation to manage rendering.
     *
     * @param hooks an Object which which specifies callbacks:
     *              `on_node_click`: a hook to be called when a node is clicked: ( d, i => void )
     *              `on_edge_clock`: a hook to be called when an edge is clicked: ( d, i => void )
     *              `on_input`: a hook to be called when a dispatching input is called.
     *              `on_config`: a hook to be called when a configuration setting is changed.
     */
    self.initialize = function ( hooks ) {

        hooks = hooks || {};

        config.hooks.on_node_click = hooks.on_node_click || (config.hooks.on_node_click || no_op);
        config.hooks.on_edge_click = hooks.on_edge_click || (config.hooks.on_edge_click || no_op);
        config.hooks.on_input = hooks.on_input || (config.hooks.on_input || no_op);
        config.hooks.on_config = hooks.on_config || (config.hooks.on_config || no_op);
        config.graph = new EmptyGraph();

        if ( !initialized ) {

            var zoom = d3.zoom().scaleExtent([-10,10]).on('zoom', zoomed);

            g_root = config.svg_root.call(zoom).append('g').classed('graph', true).attr('transform', 'translate(' + config.width / 2 + ',' + config.height / 2 + ')');

            edge_rep = g_root.append('g').classed('edges', true).selectAll('.edge');
            node_rep = g_root.append('g').classed('nodes', true).selectAll('.node');

            config.svg_root.append('defs').selectAll('marker')
                .data(['contained', 'inset'])
                .enter().append('marker')
                    .attr('id', function( d ) { return d; })
                    .attr('viewBox', "0 -5 10 10")
                    .attr('refX', 25)
                    .attr('refY', 0)
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                    .append('path')
                        .attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5');

            simulation = d3.forceSimulation( config.graph.nodeset.toArray() )
                .force('charge', d3.forceManyBody().strength( -800 ) )
                .force('link', d3.forceLink( config.graph.edgeset.toArray() ).distance( 30 ).id( function( d ) { return d.hash(); }) )
                .force('x', d3.forceX() )
                .force('y', d3.forceY() )
                .alphaTarget( 0.05 )
                .on( 'tick', self.tick );

            parallel_edge_helper = new ParallelEdgeHelper( config );

            initialized = true;

        }

        return self;

    };

    /**
     * Every renderer should have a .render() routine. This routine is
     * responsible for handling the output of a graphing task,
     * determining whether it is a success or a failure, and rendering
     * the screen, along with any relevant event hooks, appropriately.
     *
     * All asynchronously dispatched routines follow the standard, nodejs
     * (err, data) => void signature pattern.
     *
     * @param err a Javascript Error to indicate something went wrong, or null if no error occurred.
     * @param new_graph Graph an Are.na graph produced by a graphing task
     */
    self.render = function( err, new_graph ) {
        if ( !initialized ) { throw new Error('DynamicGraphRenderer: component not initialized! call .initialize() prior to rendering.'); }

        if ( err ) { console.error( err ); }

        simulation.stop();
        parallel_edge_helper.reset_counts();
        config.graph = config.graph.union( new_graph );

        var graph_nodes = config.graph.nodeset.toArray();
        var graph_edges =  config.graph.edgeset.toArray().map( function( x, i, arr ) { return edge_source( parallel_edge_helper.multiplier( x ) ); } );

        simulation.nodes( graph_nodes );
        simulation.force('link').links( graph_edges );



        edge_rep = edge_rep.data( graph_edges, function( d ) { return d.hash(); });

        edge_rep.exit().remove();

        edge_rep = edge_rep.enter().append('g')
            .classed('edge', true)
            .attr('data-source-id', function(d) { return d.source.hash(); })
            .attr('data-target-id', function(d) { return d.target.hash(); })
            .attr('data-label-id', function( d ) { return (typeof d.label !== "undefined" ) ? d.label.id : -1;})
            .merge( edge_rep )
            .on('click', config.hooks.on_edge_click );

            edge_rep.select('*').remove();

            edge_rep.append('path')
                .classed('block-connected', function(d){ return d.type === "block-connected"; })
                .classed('contained', function(d){ return d.type === "contained"; })
                .classed('inset', function(d){ return d.type === "inset"; })
                .classed('edge-representative', true);





        node_rep = node_rep.data( graph_nodes, function( d ) { return d.hash(); } );

        node_rep.exit().transition()
            .attr('r', 0)
            .remove();

        node_rep = node_rep.enter().append('g')
            .classed('node', true)
            .classed('node-label', true)
            .attr('data-id', function(d) { return d.hash(); })
            .merge( node_rep )
            .on('click', config.hooks.on_node_click )
            .call( d3.drag().on('start', dragstarted ).on('drag', dragged ).on('end', dragended ) );

            node_rep.select('*').remove();

            node_rep.append('circle')
                .classed('node-representative', true)
                .classed('open-channel', function( d ) { return d.channel.status === "open" || d.channel.open; })
                .classed('closed-channel', function( d ) { return d.channel.status === "closed"; })
                .merge( node_rep );

            node_rep.append('text')
                .classed('node-label', true)
                .text( function( d ) { return d.channel.title; })
                .merge( node_rep );

            node_rep.append('text')
                .classed('author', true)
                .text( function( d ) { return d.channel.user.full_name; })
                .merge( node_rep );




        simulation.alpha(0.5).restart();

        return self;

    };

    /**
     * Every renderer should have a .tick() routine. The .tick routine
     * determines what to do at each increment of the simulation's physics loop.
     * In general, this routine should update all of the representatives of nodes
     * and edges in the canvas. This is a void => void function.
     */
    self.tick = function() {

        var r = config.radius;

        d3.selectAll('.node-representative')
                .attr('r', function( d ) { return ( d.channel.length || 100) * r;})
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });

        d3.selectAll('.node-label')
                .attr('x', function(d) { return d.x + (d.channel.length || 100) * r + config.label_offset; })
                .attr('y', function(d) { return d.y; });

        d3.selectAll('.author')
                .attr('x', function(d) { return d.x + (d.channel.length || 100) * r + config.label_offset; })
                .attr('y', function(d) { return d.y + config.label_offset; });

        d3.selectAll('.edge-representative')
                .attr( 'd', parallel_edge_helper.render_bezier_curve );


    }
}


function edge_source( x ) {
    x.source_object = x.source;
    x.target_object = x.target;
    x.source = x.source.hash();
    x.target = x.target.hash();
    return x;
}

export { DynamicGraphRenderer };
