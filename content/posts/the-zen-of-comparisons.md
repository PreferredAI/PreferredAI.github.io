---
title: "The Zen of Comparisons"
date: "2019-12-12"
author: "Maksim T"
excerpt: "During the teaching appointment at Montana State University, Robert M. Pirsig, the author of “Zen and the Art of Motorcycle Maintenance“, conducted a following..."
featuredImage: "/uploads/2019/12/cover.jpg"
categories: ["Education"]
tags: []
seoTitle: "The Zen of Comparisons - Preferred.AI"
seoDescription: "During the teaching appointment at Montana State University, Robert M. Pirsig, the author of “Zen and the Art of Motorcycle Maintenance“, conducted a following..."
---

*   [Education](https://preferred.ai/category/education/)

# The Zen of Comparisons

During the teaching appointment at Montana State University, [Robert M. Pirsig](https://en.wikipedia.org/wiki/Robert_M._Pirsig), the author of “[Zen and the Art of Motorcycle Maintenance](https://en.wikipedia.org/wiki/Zen_and_the_Art_of_Motorcycle_Maintenance)“, conducted a following “experiment”. He selected a couple of students’ essays: “the first was a rambling, disconnected thing with interesting ideas” and “\[t\]he second was a magnificent piece”. Then he asked his students to express their preferences, whether the first essay was better or the second. The students were not aware of the Pirsig’s judgement, however, the outcome coincided, and the second essay won the votes. But why did it happen?

Nominally, we would say the reason is a better quality, and the process of judgement might look seamless to us. However, in a system as complex as an essay, the quality is comprised of many small bits, like style, vocabulary, strength of argument, etc. Although they are still sometimes are hard to notice or even to formalize, we can employ this idea of multifaceted quality to explain some parts of the students’ decision.

The Pirsig’s experiment is remarkably operationalizable and can be laid out in a computational manner. If we have sizable set of essays and their pair-wise comparisons, indicating the reviews of a better quality, we can apply natural language processing approaches to find the quality bits that matters across different essays and judges.

In Preferred.AI, we designed [CompareLDA](http://www.hadylauw.com/publications/aaai19b.pdf), a topic model which looks for the word patterns consistent with the pairwise comparisons. [Latent Dirichlet allocation](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation) (LDA) is a statistical model that is often used to discover latent topics in a text collection. For example, the content of a newspapers is usually composed of several topics, like politics, finance, sports, technology, etc. and the topics identify the set of words used to express them. Thus, finance can be described by “money”, “bonds”, “taxes”, technology by “artificial”, “innovation”, “quantum”, and so on. CompareLDA takes a step further and seeks for the topics that are associated with document comparisons. For example, in case of essays, these could be topics associated with some peculiar arguments.

Let’s look at how CompareLDA works in practice and whether we can derive some sensible hypothesis about essay quality. We use student-written (10th grade) persuasive essays. The assignment was to write a persuasive essay to a newspaper reflecting the student vies on censorship in libraries. We compared the essays based on their grades: the higher the grade is, the better the essay quality is. The topics are represented by the most probable words associated with them.

Not surprisingly, better essays tend to be are associated with the topic of censorship, library, and society, which is essentially the main line of the essays. Here is the output of CompareLDA, that captures it:

CENSORSHIP: library would censorship censored censor many censoring one public material idea could information place this it however way society group

There are a couple of more arguments we can infer from the topic distribution. Here are the couple of them associated with better essays:

FREEDOM OF SPEECH: right freedom opinion away take express medium free say speech world we limit country banned work everyone taking censorship taken

CHILD-PARENT: thing child kid bad life drug parent see know learn young think sex world school need age way hear violence

Censorship topic is often come in confrontation with the freedom of speech argument (FREEDOM OF SPEECH). If institution of censorship is implemented in society, then it violates the right to speak freely. Here is an excerpt from a highly graded essay:

Freedom of speech and freedom of press are both protected by the constitution upon which our country was founded. Censorship of said materials will effectively undermine both of these rights. Authors, illustrators, journalists and the slew of other individuals who compose the materials available in libraries are exercising their right to free speech through their works. They are constitutionally protected in the things they say.

Another common argument associated with good essays focuses on parent-child censorship (CHILD-PARENT). Children should be protected from disturbing content, such as drugs, violence, and nudity. And it is the parents’ responsibility to implement such censorship. Should libraries undertake this responsibility as well?

CompareLDA can also identify topics associated with a worse grade, here is one:

COMMON MISTAKES: like people think dont thing want music stuff movie get kid say see bad thats alot something take read shouldnt

Rather than obeying clear topic coherence, this one partially serves as a collector for common misspellings: dont, thats, alot, and shouldnt. We can hypothesize, that the grading scheme also includes weightage for the use of language, and failure to use the grammatical English spoils the essays quality.

It seems as well that the use of generic argumentation is also associated with a lower grade, this is suggested by following topic:

EVERYONE-SOMEHTING: people everyone different like person read one want if right opinion thing find something someone would take everything mean every

Let’s look at the essay of the lowest grade, which shows the presence of both topics:

Some books in libraries offended some people. But other people want to read this book. None persone have right to say this book offended me so should the libraries removed it. If some book offend soome person that dosn’t me all the people will offend by this book.My opinion is they should not removed this book, because some people like to read that book. If some one don’t like this book and this book offended them.They shold don’t read this book and read what they like. but son’t say should be removed this book. I think evey one like different books. So should the libraries but every thing the people like read it…

CompareLDA helps us to explore this grading process from the perspective of word regularities, which correlate and, possibly, influence our judgement of “a better”. This is, of course, not the only interpretation that is worth looking at, and there are a few obvious pieces we can embed into CompareLDA, for example, understanding of grammar, use of figurative language, knowledge of spelling rules, etc. However, more complex models are usually harder to reason about, and due to this complexity CompareLDA provides a reasonable start for your investigation. Feel free to [try](https://github.com/PreferredAI/compare-lda) it!

The story of quality and comparisons does not end here, but rather is developed from computational perspective. I hope more exciting discussions are yet to come.

](https://preferred.ai/guide-to-understanding-crawlers/)

    #### [The Best Web Scraper for You: A Guide to Understanding Crawlers](https://preferred.ai/guide-to-understanding-crawlers/)

    February 25, 2019

*   [![](/uploads/2019/07/group.jpg)

    ](https://preferred.ai/techfest2019/)

    #### [TechFest 2019](https://preferred.ai/techfest2019/)

    July 31, 2019

*   [![](/uploads/2020/08/sunglasses.jpg)

    ](https://preferred.ai/visual-sentiment-analysis-a-need-of-context/)

    #### [Visual Sentiment Analysis: A Need for Context](https://preferred.ai/visual-sentiment-analysis-a-need-of-context/)

    August 19, 2020
