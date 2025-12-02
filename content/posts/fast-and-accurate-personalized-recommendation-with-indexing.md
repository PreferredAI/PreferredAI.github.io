---
title: "Fast and Accurate Personalized Recommendation with Indexing"
date: "2020-12-31"
author: "Andrew Le"
excerpt: "In a previous blog post, we introduce the problem of top-K recommendation retrieval using Matrix Factorization (MF). We also highlight the importance of indexing structures as a..."
featuredImage: "/uploads/2020/12/way-918900_1920.jpg"
categories: ["Education"]
tags: []
seoTitle: "Fast and Accurate Personalized Recommendation with Indexing - Preferred.AI"
seoDescription: "In a previous blog post, we introduce the problem of top-K recommendation retrieval using Matrix Factorization (MF). We also highlight the importance of indexing structures as a..."
---

# Fast and Accurate Personalized Recommendation with Indexing

In a previous blog [post](https://preferred.ai/a-quest-for-fast-personalized-recommendation-part-i/), we introduce the problem of top-*K* recommendation retrieval using Matrix Factorization (MF). We also highlight the importance of indexing structures as a faster alternative to an exhaustive search in this context.

Issues with Indexing for Top-***K*** Maximum Inner Product Search **(MIPS)**

Traditional indexing structures are designed for similarity search with metric functions such as the Euclidean distance or the angular distance. Inner product kernel of matrix factorization methods, however, is not a proper metric. Given a point ***x***, one can always find another point ***y*** that is more similar to ***x*** than ***x*** to itself according to the inner product score. This violates the triangle inequality property of a metric, which may lead to inaccurate retrieval of the true top-*K* recommendations after indexing.

**1.** **Reducing MIPS to a** **Nearest Neighbor Search**

One solution is to *reduce MIPS to an equivalent nearest neighbour search task* (MIPS-to-NNS), which can be solved efficiently by existing indexing structures. This idea has been introduced ­as a two-step process for MF-based top-*K* recommendation retrieval. The user and item vectors are transformed and augmented so that solving MIPS in the original space is equivalent to solving nearest neighbour search in the transformed space. However, the transformed vectors may be concentrated in one region causing an imbalanced distribution of data in the new space, which may in turn affect downstream approximate nearest neighbour search tasks (see [“Indexable Probabilistic Matrix Factorization for Maximum Inner Product Search” at AAAI 2016](http://ulrichpaquet.com/Papers/fraccaro16aaai.pdf) for more detailed explanation).

![](/uploads/2020/11/MIPS-to-NNS-Reduction.png)

**2.** **Indexable Representation Learning**

Another solution is *indexable representation*, which learns user and item vectors that are compatible with the indexing structures. Indexable representation learning models replace the inner product kernel with a proper distance metric function such as the Euclidean distance (see [“Collaborative Filtering via Euclidean Embedding” at RecSys 2016](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.308.7304&rep=rep1&type=pdf)) or the angular distance (see [“Indexable Bayesian Personalized Ranking for Efficient Top-K Recommendation” at CIKM 2017](https://ink.library.smu.edu.sg/cgi/viewcontent.cgi?referer=&httpsredir=1&article=4886&context=sis_research)). In these metric spaces, top-*K* recommendation retrieval can be solved efficiently with structures such as Locality Sensitive Hashing (LSH), spatial trees, or inverted index. Also, as it does not require augmenting user and item vectors, indexable representation models can avoid the imbalanced data distribution issue of the MIPS-to-NNS approach.

![](/uploads/2020/11/Indexable_Rep_Learning.png)

Moving forward, it is a promising approach to design unified learning frameworks that factor the structural properties of the retrieval-efficient component in learning user and item vectors (i.e., preference elicitation component). This would allow the recommendation pipeline to better preserve the *accuracy* of the preference elicitation models, and at the same time to exhibit the *efficiency* of retrieval-efficient structures. For instance, in our recent work [“Stochastically Robust Personalized Ranking for LSH Recommendation Retrieval” at AAAI 2020](https://ojs.aaai.org//index.php/AAAI/article/view/5889), we trace the incompatibility issue to the stochastic nature of randomized hash function of LSH. We then introduce *Stochastically Robust Personalized Ranking* (or *SRPR* for short) model that learns from implicit feedback to derive the user and item vectors that are robust to the stochasticity of randomly generated LSH hash functions. SRPR thus achieves both *efficient* retrieval and *accurate* top-K recommendation when LSH is the designated indexing structure.

If you want to gain more hands-on experience for efficient recommendation with indexing, please check out this [tutorial](https://github.com/PreferredAI/tutorials/blob/master/recommender-systems/08_retrieval.ipynb).

Have fun learning with [Preferred.AI](https://preferred.ai/)!

