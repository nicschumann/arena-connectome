# Are.na Connectome ✶✶

## What?

Connectome is a tool for exploring the shape of connections between Are.na channels.

## Components

### Nth-Neighborhood

Given a non-negative integer *n* and an [Are.na](http://are.na) channel slug, construct a graph depicting channels of no more than *n* connections distant. The graph is given such that channels are represented by graph nodes, and undirected edges between channels represent blocks that occur in both channels. A block occurring in *k* > 2 channels is represented as an *k*-clique in the graph.

### Aspirational Features

- Interactive graph display.
- Channel-to-channel connections identified in a categorically clear way.
- "URL Also Appears In" edges.
