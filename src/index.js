import 'babel-polyfill';

import './style.scss';

import * as d3 from 'd3';

var transform = function( x ) { return x; };

import config from '../package.json';
import  { arena }  from './arena-api/index.js';
import { nth_neighborhood } from './components/nth-neighborhood/index.js';

var api = arena( config );

nth_neighborhood( api, transform, d3, config );
