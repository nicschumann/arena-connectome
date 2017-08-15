import './style.scss';

import * as d3 from 'd3';

var transform = function( x ) { return x; };

import config from '../package.json';
import { arena } from './arena-api/index.js';
import { channel_query } from './components/channel-query/index.js';

var api = arena( config );

channel_query( api, transform, d3, config );
