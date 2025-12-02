---
title: "Neural Topic Modeling for Document Networks with Adjacent-Encoder"
date: "2020-08-19"
author: "Zhang Ce"
excerpt: "Text documents are usually linked to one another. For example, academic papers cite other papers, web pages link to other pages, etc. Most of..."
featuredImage: "/uploads/2020/08/adjacent_encoder_cover.jpg"
categories: ["Publication"]
tags: []
seoTitle: "Neural Topic Modeling for Document Networks with Adjacent-Encoder - Preferred.AI"
seoDescription: "Text documents are usually linked to one another. For example, academic papers cite other papers, web pages link to other pages, etc. Most of..."
---

# Neural Topic Modeling for Document Networks with Adjacent-Encoder

Text documents are usually linked to one another. For example, academic papers cite other papers, web pages link to other pages, etc. Most of the current research focuses on mining textual content only, ignoring the relationships among documents. In this post, we will go through the Adjacent-Encoder, a recent neural topic model published on [AAAI-20](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/aaai20a.pdf?attachauth=ANoY7cofnct3Bjk8rTzPX0Hc8fuXvE2PBBhLY3WKbk_yKLGNOYnCHDOSFyFDu9-16XfKXG5Q12Ni3DtC-nKUqSwptJkQ1KWPUZu3e-Ha7hZu1P3SivPh_86g7ycXBT1WUud3mrUVbXoyv8H4NbY7MF250RTrDIWtKVDda94M5GMoTY5AdY_U8tOzDjrl65lCBug2x1MMdbWSvoJ6MNCwgbxrlJZvE4cSuQ%3D%3D&attredirects=0), which naturally incorporates both pieces of information to learn better topic representations.

**Adjacent-Encoder**

Adjacent-Encoder is built on top of Auto-Encoder described in Figure 1(a), a three-layer neural network, where **d**** **is an input document, we assume a Bag-Of-Words (BOW) representation. Here **h** can be thought of as the topic representation, and **W** plays the role of a topic-word association matrix.

![](/uploads/2020/08/image-4.png)

Documents are often linked to one another in a network structure, such as paper citation network and Web page hyperlink network, as illustrated in Figure 1(b). Two cited papers may come from the same research topic, linked web pages could also contain similar content, etc. Motivated by this inspiration, in our research we discover that it is possible to use topics of one document (academic paper, web page, etc.) to reconstruct the observed content of its adjacent neighbours in the network. Figure 1(a) and (b) visually contrast the difference between Auto-Encoder and our model. Adjacent-Encoder is able to capture the case where two adjacent documents are different in observed content, but consistent in internal latent topics. Thus, the learned topics are more robust and can better group related words.

**Evaluation**

For clarity, we only present the comparison against Auto-Encoder to illustrate the effect of incorporating networks. Since documents from the same category tend to reveal similar topics, we make an evaluation of document classification on ML paper citation network in Figure 2.

![](/uploads/2020/08/image-5.png)

We then apply t-SNE to visualize the learned topics and colour the documents using their categories. Figure 3 shows that Adjacent-Encoder can better group related documents separate different categories.

![](/uploads/2020/08/image-6.png)

**Conclusion**

Adjacent-Encoder is a neural topic model, which extracts semantics from networked documents. Potential real-world applications include news recommendation, academic citation recommendation, paper/Web page classification, etc.

For more technical details and variants of Adjacent-Encoder, please refer to the main paper [AAAI-20](https://78462f86-a-69ea2357-s-sites.googlegroups.com/a/hadylauw.com/www/publications/aaai20a.pdf?attachauth=ANoY7cofnct3Bjk8rTzPX0Hc8fuXvE2PBBhLY3WKbk_yKLGNOYnCHDOSFyFDu9-16XfKXG5Q12Ni3DtC-nKUqSwptJkQ1KWPUZu3e-Ha7hZu1P3SivPh_86g7ycXBT1WUud3mrUVbXoyv8H4NbY7MF250RTrDIWtKVDda94M5GMoTY5AdY_U8tOzDjrl65lCBug2x1MMdbWSvoJ6MNCwgbxrlJZvE4cSuQ%3D%3D&attredirects=0). We release the source code and datasets at [https://code.preferred.ai/adjacent-encoder](https://code.preferred.ai/adjacent-encoder).

