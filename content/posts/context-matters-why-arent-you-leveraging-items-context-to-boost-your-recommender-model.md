---
title: "Context Matters: Why Aren't You Leveraging Items' Context to Boost Your Recommender Model?"
date: "2019-06-18"
author: "Aghiles Salah"
excerpt: "Data sparsity is one of the biggest challenges in recommender systems. A promising solution to alleviate this problem is to rely on auxiliary sources..."
featuredImage: "/uploads/2019/06/item_context_post2-e1560861332106.png"
categories: ["Education"]
tags: []
seoTitle: "Context Matters: Why Aren't You Leveraging Items' Context to Boost Your Recommender Model? - Preferred.AI"
seoDescription: "Data sparsity is one of the biggest challenges in recommender systems. A promising solution to alleviate this problem is to rely on auxiliary sources..."
---

# Context Matters: Why Aren't You Leveraging Items' Context to Boost Your Recommender Model?

Data sparsity is one of the biggest challenges in recommender systems. A promising solution to alleviate this problem is to rely on auxiliary sources of information. In fact, plenty of studies have established empirically that leveraging information such as users’ social network or item contents (e.g., textual descriptions) often improves recommendations. In this post we will go through a key source of information, namely item-to-item relationships, which can drastically boost recommender models but has been overlooked by most previous work.

Here are two insights relevant for this post:

- We rarely consume items, e.g., pair of jeans, with identical or very similar features to those we have already experienced.

- We tend to consume items which can complement each other, e.g., shirt and matching pair of jeans, or which are alternatives to each other with some different features, e.g., two shirts of the same style but different colors, etc.

Hence, knowing how items relate to one another could allow us to generalize a user’s preference to other items of similar aspects, which would alleviate the sparsity issue. Before getting into the main point of this post, namely leveraging item-to-item relationships in personalized recommendation, we need to answer a couple of questions. The first one is, *how do we capture or where can we find such item-to-item connections?*

## Item context

Online applications often maintain information that may hold useful clue about how items are related to one another. For instance, videos sharing platforms, such as Youtube, maintain play-lists which usually consist of videos sharing a coherent theme, e.g., country music of the 90s. E-commerce websites, such as Amazon, record data about which items are browsed in the same session, e.g., *Also-Viewed* items, which often correspond to complementary products or alternatives meeting a particular need.

To unify the above scenarios, we introduce the notion of “context”, which may for example refer to a shopping cart, browsing session, playlist, etc., depending on the specific problem instance. The intuition is that items sharing similar contexts are likely related to one another in terms of some aspect that guides the choices one makes.

Equipped with items’ context, we are now left with the second research question, which is *how to infuse a recommender model with this information?*

## Infusing recommendation with item context

There are several ways you can incorporate item context into personalized recommendation . In Preferred.AI, we proposed one principled solution to this problem, namely [Collaborative Context Poisson Factorization (C2PF)](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/ijcai18b.pdf?attachauth=ANoY7cojqxf7FWpHl02yAza3EPHAErNZtPQr0SSTvoyVwsdi6A5sJzXe9MgYjV8s1PfCScwxSt7_mtwx7GmjTASn9Kmn966z0ioymxsgjdf_GIOvrw_lru9ER2ngSBtLB6MEMNii-KIah8psAaUt83DE3ee9LaMORSqvmuu2PwdLvdcYJygVIHzs0q8yMJ3ozeY6JqpcS7TSh20MCPSzXhUBXH2L5YnZGA%3D%3D&attredirects=0). The latter is a Bayesian latent factor model assuming that user preferences can be driven by two signals: user-item interactions and item-item contextual relationships, as illustrated in the following figure.

![Two reasons might explain the preference of a user for an item: (i) the user’s preference matches the attributes of the item of interest, (ii) the user’s preference matches those of other related items.](/uploads/2019/06/ContextualPreference.png)

## Impact of items’ context on recommendation

To empirically assess the impact of item context on personalized recommendation, we benchmark C2PF with Bayesian Poisson Factorization (PF)—corresponding to C2PF without items’ context. We consider the Amazon Clothing dataset, which comes with the *Also-Viewed* lists treated as items’ context in our case. We measure the recommendation accuracy using Normalized Discount Cumulative Gain (NDCG), Mean Reciprocal Rank (MRR), Precision, and Recall.

![Average recommendation accuracy.](/uploads/2019/06/res_c2pf_clothing.png)

As it is clear from the above table the performance improvement of C2PF over PF is substantial and quite impressive. Interestingly, a closer look at the above results, see [C2PF paper](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/ijcai18b.pdf?attachauth=ANoY7cojqxf7FWpHl02yAza3EPHAErNZtPQr0SSTvoyVwsdi6A5sJzXe9MgYjV8s1PfCScwxSt7_mtwx7GmjTASn9Kmn966z0ioymxsgjdf_GIOvrw_lru9ER2ngSBtLB6MEMNii-KIah8psAaUt83DE3ee9LaMORSqvmuu2PwdLvdcYJygVIHzs0q8yMJ3ozeY6JqpcS7TSh20MCPSzXhUBXH2L5YnZGA%3D%3D&attredirects=0), reveals that C2PF offers the most improvement on users with few ratings, suggesting that item context helps in generalizing users’ preferences to other items of similar aspect.

## What’s Next

As motivated and demonstrated empirically through the current post, contextual relationships among items may underlie useful signals about how users consume items. While our work on C2PF constitutes an important contribution in terms of how we can formalize, capture and incorporate item relatedness into personalized recommendation, there is still much more to do before we fully leverage this aspect. Here are few relevant directions for future work.

- Jointly leverage items’ contextual relationships and users’ social network. In particular C2PF can be extended in this sense. Perhaps one difficulty is to find datasets coming both with a social network and some notion of item context.

- Capture item relations from multiple contexts. For instance in Amazon data there are various sources of information that can encode item relationships, e.g., item bought together, browsed together, etc.

- Exploit item context along with other item related data, e.g., textual descriptions, reviews, etc.

## Resources

- C2PF paper: [A Bayesian Latent Variable Model of User Preferences with Item Context](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/ijcai18b.pdf?attachauth=ANoY7cojqxf7FWpHl02yAza3EPHAErNZtPQr0SSTvoyVwsdi6A5sJzXe9MgYjV8s1PfCScwxSt7_mtwx7GmjTASn9Kmn966z0ioymxsgjdf_GIOvrw_lru9ER2ngSBtLB6MEMNii-KIah8psAaUt83DE3ee9LaMORSqvmuu2PwdLvdcYJygVIHzs0q8yMJ3ozeY6JqpcS7TSh20MCPSzXhUBXH2L5YnZGA%3D%3D&attredirects=0). IJCAI 2018.

- [C2PF implementation](https://github.com/PreferredAI/cornac/blob/master/examples/c2pf_example.py): available in **[Cornac](https://github.com/PreferredAI/cornac)** a python recommender system library.

