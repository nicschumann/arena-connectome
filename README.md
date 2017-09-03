# Are.na Connectome ✶✶

## What?

Connectome is a tool for exploring the shape of connections between Are.na channels. We're building a number of different *components* which help with different visualization tasks or goals. Currently, we're working

## Who

Connectome is being developed by [Nic Schumann](http://workshop.co) ([nicschumann](http://github.com/nicschumann)) and [Lukas WP](http://ltwp.net) ([ltwp](http://github.com/ltwp)).

## Components

### N-Neighborhood

Given a non-negative integer *n* and an [Are.na](http://are.na) channel slug, construct a graph depicting channels of no more than *n* connections distant. The graph is given such that channels are represented by graph nodes, and undirected edges between channels represent blocks that occur in both channels. A block occurring in *k* > 2 channels is represented as an *k*-clique in the graph. In order to make this definition really precise for you, here's some terminology we should agree on.

#### Terminology

*Channels* in our graph are represented by graph nodes. A channel is structural element on the [Are.na](http://are.na) platform – on the platform, a channel has a *content list* – a number of *blocks* (representations of arbitrary content from around the web and beyond) or other channels.

Our primary goal is to provide interesting tools for visualizing patterns of connection on [Are.na](http://are.na). This is typically realized by considering *connections* between channels. Channels may be connected to one another in a number of ways.

1. A channel **A** is said to *contain* a channel **B** if **B** appears as content in **A**'s content list. We represent the fact that **A** contains **B** by drawing a directed edge from the node representing **B** to the node representing **A**.

2. A channel **A** is said to be *inset into* a channel **B** if **A** appears as content in **B**'s content list. We represent the fact that **A** is inset into **B** by drawing a directed edge from the node representing **A** to the node representing **B**.

3. Notice that **A** is inset into **B** exactly when **B** contains **A**.

4. A channel **A** is said to be *block-connected* to a channel **B** if **A** and **B** share a block **x** in common. In this case, we draw an undirected edge between **A** and **B** labelled with **x**.

5. In a future iteration we may want to consider adding connections between channels that share blocks with the same URL. In these case, we could say that channels **A** and **B** are *weakly block-connected*.

Now that our notions of connectedness are defined, We define an *n-neighborhood* around a channel **A** as follows:

1. The *0-neighborhood* around **A** is simply the channel **A** itself.

2. The *0-boundary* around **A** is **A** itself, so that *0-neighborhood* = *0-boundary*.

3. The *1-neighborhood* around **A** is the set of all channels that *contain* **A**, together with all channels *inset into* **A**, together with all channels *block-connected* to **A**, along with all respective edges witnessing these facts.

4. The *1-boundary* around **A** is the difference of the *1-neighborhood* around **A** and the *0-neighborhood* around **A**.

5. Inductively, the *(k+1)-neighborhood* around **A** is the *k-neighborhood* around **A** glued together a *1-neighborhood* for each channel in the *k-boundary* around **A**.

6. Inductively, the *(k+1)-boundary* around **A** is the difference of the *(k+1)-neighborhood* around **A** and the *k-neighborhood* around **A**.

7. Notice that *k-neighborhood* + *(k+1)-boundary* = *(k+1)-neighborhood*. This follows immediately from the definition of a *(k+1)-boundary*.

8. *(k+1)-boundary* = *(k+1)-neighborhood* - *k-neighborhood*

9. *k-neighborhood* + *(k+1)-boundary* = *k-neighborhood* + *(k+1)-neighborhood* - *k-neighborhood*

10. *k-neighborhood* + *(k+1)-boundary* = *(k+1)-neighborhood*

11. *Aside:* an *n-neighborhood* around **A** may be glued together with an *m-neighborhood* around **B** by taking the union of their channel and edge sets. Note that the union of two neighborhoods is not necessarily a neighborhood.


### Aspirational Features

- Interactive graph display.
- Channel-to-channel connections identified in a categorically clear way.
- "URL Also Appears In" edges.
