---
title: "Neural Topic Modeling for Document Networks with Adjacent-Encoder"
date: "2020-08-19"
author: "Zhang Ce"
excerpt: "Text documents are usually linked to one another. For example, academic papers cite other papers, web pages link to other pages, etc. Most of..."
featuredImage: "/uploads/2020/08/adjacent_encoder_cover.jpg"
categories: ["Publication"]
tags: ["neural topic modeling"]
seoTitle: "Neural Topic Modeling for Document Networks with Adjacent-Encoder - Preferred.AI"
seoDescription: "Text documents are usually linked to one another. For example, academic papers cite other papers, web pages link to other pages, etc. Most of..."
---

# Neural Topic Modeling for Document Networks with Adjacent-Encoder

Text documents are usually linked to one another. For example, academic papers cite other papers, web pages link to other pages, etc. Most of the current research focuses on mining textual content only, ignoring the relationships among documents. In this post, we will go through the Adjacent-Encoder, a recent neural topic model published on [AAAI-20](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/aaai20a.pdf?attachauth=ANoY7cofnct3Bjk8rTzPX0Hc8fuXvE2PBBhLY3WKbk_yKLGNOYnCHDOSFyFDu9-16XfKXG5Q12Ni3DtC-nKUqSwptJkQ1KWPUZu3e-Ha7hZu1P3SivPh_86g7ycXBT1WUud3mrUVbXoyv8H4NbY7MF250RTrDIWtKVDda94M5GMoTY5AdY_U8tOzDjrl65lCBug2x1MMdbWSvoJ6MNCwgbxrlJZvE4cSuQ%3D%3D&attredirects=0), which naturally incorporates both pieces of information to learn better topic representations.

**Adjacent-Encoder**

Adjacent-Encoder is built on top of Auto-Encoder described in Figure 1(a), a three-layer neural network, where **d** is an input document, we assume a Bag-Of-Words (BOW) representation. Here **h** can be thought of as the topic representation, and **W** plays the role of a topic-word association matrix.

![](/uploads/2020/08/image-6.png)

Figure 3: T-SNE visualization of topics.

**Conclusion**

Adjacent-Encoder is a neural topic model, which extracts semantics from networked documents. Potential real-world applications include news recommendation, academic citation recommendation, paper/Web page classification, etc.

For more technical details and variants of Adjacent-Encoder, please refer to the main paper [AAAI-20](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/aaai20a.pdf?attachauth=ANoY7cofnct3Bjk8rTzPX0Hc8fuXvE2PBBhLY3WKbk_yKLGNOYnCHDOSFyFDu9-16XfKXG5Q12Ni3DtC-nKUqSwptJkQ1KWPUZu3e-Ha7hZu1P3SivPh_86g7ycXBT1WUud3mrUVbXoyv8H4NbY7MF250RTrDIWtKVDda94M5GMoTY5AdY_U8tOzDjrl65lCBug2x1MMdbWSvoJ6MNCwgbxrlJZvE4cSuQ%3D%3D&attredirects=0). We release the source code and datasets at [https://code.preferred.ai/adjacent-encoder](https://code.preferred.ai/adjacent-encoder).

Tags: [neural topic modeling](/tag/neural-topic-modeling/)
