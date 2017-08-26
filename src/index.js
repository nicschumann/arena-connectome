import 'babel-polyfill';

import './style.scss';

import * as d3 from 'd3';

import config from '../package.json';
import  { arena }  from './arena-api/index.js';
import { nth_neighborhood } from './components/nth-neighborhood/index.js';
import { channel_search } from './components/channel-search/index.js';

var api = arena( config );

channel_search( api, d3, config );
