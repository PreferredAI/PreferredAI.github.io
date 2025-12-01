---
title: "Recent Advances in Scalable Retrieval of Personalized Recommendations"
date: "2018-12-28"
author: "Andrew Le"
excerpt: "Andrew and Hady will be delivering a tutorial at the AAAI-19 conference to take place on Monday, January 28, 2019 from 8:30am to 12:30pm..."
featuredImage: "/uploads/2018/12/aaai19-tutorial-cover-2.png"
categories: ["Presentation", "Announcement"]
tags: []
seoTitle: "Recent Advances in Scalable Retrieval of Personalized Recommendations - Preferred.AI"
seoDescription: "Andrew and Hady will be delivering a tutorial at the AAAI-19 conference to take place on Monday, January 28, 2019 from 8:30am to 12:30pm..."
---

# Recent Advances in Scalable Retrieval of Personalized Recommendations

[Andrew](https://sites.google.com/smu.edu.sg/dungduyle/home) and [Hady](http://www.hadylauw.com/) will be delivering a tutorial at the [AAAI-19](https://aaai.org/Conferences/AAAI-19/aaai19tutorials/#ma5) conference to take place on Monday, January 28, 2019 from 8:30am to 12:30pm at the Hilton Hawaiian Village, Honolulu, Hawaii, USA.

### Scope

Top-K recommendation seeks to deliver a personalized recommendation list of K items to a user. The dual objectives are (1) accuracy in identifying the items a user is likely to prefer, and (2) efficiency in constructing the recommendation list in real time. Naively scanning millions of items to identify the few most relevant ones may inhibit truly real-time retrieval performance. Towards improving the retrieval efficiency, we formulate it as *approximate K-nearest neighbour* (KNN) search aided by indexing schemes, e.g., locality-sensitive hashing, spatial trees, and inverted index. These speed up the retrieval process by discarding a large number of potentially irrelevant items when given a user query vector. However, many recommendation algorithms rely on inner product as predictor, producing representations that may not align well with the structural properties of these indexing schemes, eventually resulting in a significant loss of accuracy post-indexing.

In this tutorial, we present the following:

*   We provide a theoretical justification as well as empirical demonstration of the potential issues arising from incompatibility of the inner product search and indexing-based retrieval of recommendations.
*   We summarize different approaches in the literature that attempt to build fast and accurate retrieval systems for personalized recommendations, including building natively indexable models for better retrieval accuracy.
*   Finally, we conduct a hands-on session on using various indexing data structures for efficient and accurate recommendation retrieval.

### Syllabus

1.  **Matrix Factorization (MF) Recommendation Retrieval as Similarity Search Problem** (Duration: 45 mins)
    *   Two phases of a matrix factorization-based recommender system
    *   Linear scanning is not scalable for real-time applications
2.  **Approaches for Scalable Personalized Recommendation Retrieval** (Duration: 105 mins)
    *   Approximate maximum inner product search
    *   Indexable representation learning
    *   Discrete representations
3.  **Hands-on Session** (Duration: 60 mins)
    *   Scalable recommendation retrieval with indexing
    *   Building an indexable representation model

**The materials are available at [https://code.preferred.ai/recommendation-retrieval](https://code.preferred.ai/recommendation-retrieval)**

### Target Audience

This tutorial aims at a broad range of audience from Recommendation Systems and Information Retrieval communities, especially those who are interested in efficient retrieval of recommendations. These include researchers and students working in related problem areas, as well as industry practitioners who are familiar with recommender systems.

### Prerequisites

The materials assume a background in linear algebra, machine learning basics, as well as optimization techniques such as gradient descent. For the hands-on component, attendees should be familiar with Python.

### Benefits

To researchers and students, the tutorial provides a foundation on the problem of recommendation retrieval, and a theoretical analysis on the incompatibility between matrix factorization frameworks, which may point to future research directions. To practitioners, the tutorial explains the drawback of naively examining all items, and offers pragmatic means for improving the retrieval efficiency of recommender systems with negligible loss of accuracy.

### Speakers

![](/uploads/2018/12/Andrew.jpg)

**[Dung D. Le](https://sites.google.com/smu.edu.sg/dungduyle/home)** is a PhD candidate in the Information Systems program at Singapore Management University (SMU). His research interests include recommender systems and information retrieval, with publications in major venues such as CIKM and SDM. In his candidature, he has been recognized with SMU Presidential Doctoral Fellowship and PhD Student Life Award.

![](/uploads/2018/12/photo_hadylauw.png)

**[Hady W. Lauw](http://www.hadylauw.com/)** is an Associate Professor at SMU School of Information Systems. He leads the Preferred. AI project, whose research spans artificial intelligence and machine learning focusing on preferences and recommendations. His research is supported by a Singapore National Research Foundation Fellowship. He received his PhD from Nanyang Technological University in 2008.
