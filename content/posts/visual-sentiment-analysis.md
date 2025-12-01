---
title: "Visual Sentiment Analysis"
date: "2018-05-02"
author: "Hady Lauw"
excerpt: "“A picture is worth a thousand words.” So they say. Indeed, some images could capture certain moments so vividly that they become iconic and..."
featuredImage: "/uploads/2018/05/vscnn_basemodel_architecture-e1528105019495.png"
categories: ["Publication"]
tags: []
seoTitle: "Visual Sentiment Analysis - Preferred.AI"
seoDescription: "“A picture is worth a thousand words.” So they say. Indeed, some images could capture certain moments so vividly that they become iconic and..."
---

*   [Publication](https://preferred.ai/category/publication/)

# Visual Sentiment Analysis

> “A picture is worth a thousand words.”

So they [say](https://en.wikipedia.org/wiki/A_picture_is_worth_a_thousand_words). Indeed, some images could capture certain moments so vividly that they become [iconic and timeless](https://edition.cnn.com/2013/09/01/world/gallery/iconic-images/index.html).

> Could a picture speak of the sentiment of the photographer?

Intuitively, that seems probable.  After all, in the choice of scenery or angle or other tricks up the sleeve of a photographer, the picture taken is essentially a rendering of what the photographer sees.

In pursuit of an empirical answer to what might have also been a philosophical question, we conduct research on a data set of images found within online reviews of restaurants crawled from [Yelp](https://www.yelp.com/).  With the advent of mobile phones, many online reviewers now prolifically include photos within their reviews, recounting their experiences as well as their sentiments textually and visually.

> What is visual sentiment analysis?

To test the above hypothesis, we formulate a problem known as *visual sentiment analysis*.  Given an image, we seek to determine whether the image is positive (i.e., found within a review with rating of 4 or 5 on a scale of 5) or negative (i.e., associated with a rating of 1 or 2).  We build a binary classifier based on a deep learning framework called [Convolutional Neural Networks](https://en.wikipedia.org/wiki/Convolutional_neural_network).  Our model architecture shown below is reminiscent of [AlexNet](https://en.wikipedia.org/wiki/AlexNet) for object detection, with a twist in its application to binary sentiment classification.  We describe the details of this base model in a [paper](http://www.hadylauw.com/publications/acmmm17.pdf) authored by [Tuan](https://preferred.ai/team/tuan/) and [Hady](https://preferred.ai/team/hadylauw/) and published in the [ACM Multimedia Conference 2017](http://www.acmmm.org/2017/).

![](/uploads/2018/05/vscnn_basemodel_architecture.png)

To cut a fascinating story short, we find that the trained visual sentiment analysis classifier performs significantly better than random, implying that indeed there are signals within an image that help to convey the overall sentiment of the review writer.

> What do positive images look like?

Below we show some examples of images classified as positive.  Happy faces and celebrations seem to mark happy moments.  Note that this is a general image classification, and not specifically about facial emotion recognition (which itself is an interesting but distinct problem).  For another set of examples, if one can afford to dine at restaurants with a view, chances are the experience would be positive.

![](/uploads/2018/05/vscnn_basemodel_business_positive_short.png)

> What do negative images look like?

Well, no one likes paying too much (or perhaps even paying at all?).  It is always a bummer to discover something that does not belong on one’s plate.

![](/uploads/2018/05/vscnn_basemodel_business_negative_short.png)

Interesting as it is, this is not yet the end of our exploration.  There are other factors that we would consider to improve the performance of visual sentiment analysis.  That’s the subject of a future blog post.  If you really can’t wait, here is the [paper](http://www.hadylauw.com/publications/acmmm17.pdf).

](https://preferred.ai/nhs-facial-expression/)

    #### [Look at That Facial Expression!](https://preferred.ai/nhs-facial-expression/)

    November 18, 2018

*   [![](/uploads/2020/12/way-918900_1920.jpg)

    ](https://preferred.ai/fast-and-accurate-personalized-recommendation-with-indexing/)

    #### [Fast and Accurate Personalized Recommendation with Indexing](https://preferred.ai/fast-and-accurate-personalized-recommendation-with-indexing/)

    December 31, 2020

*   [![](/uploads/2022/12/adnec.jpg)

    ](https://preferred.ai/emnlp-2022-in-abu-dhabi/)

    #### [EMNLP 2022 in Abu Dhabi](https://preferred.ai/emnlp-2022-in-abu-dhabi/)

    March 22, 2023
