---
title: "Introduction to CSVPL"
date: "2019-05-11"
author: "Chong Cher"
excerpt: "Here in Preferred.AI, much of our work involves processing and manipulating data. We regularly find ourselves wanting to explore a given dataset quickly and..."
featuredImage: "/uploads/2019/04/ccchia.png"
categories: ["Education"]
tags: []
seoTitle: "Introduction to CSVPL - Preferred.AI"
seoDescription: "Here in Preferred.AI, much of our work involves processing and manipulating data. We regularly find ourselves wanting to explore a given dataset quickly and..."
---

# Introduction to CSVPL

Here in Preferred.AI, much of our work involves processing and manipulating data. We regularly find ourselves wanting to explore a given dataset quickly and simply, and CSVPL (CSV Processing Language) allows us to do just that. CSVPL is  a Java library for simple and extensible CSV (comma-separated values) file processing and manipulation, and in this post, we will be introducing CSVPL, as well as demonstrating its usage and features.

## Why CSVPL?

One of our favorite ways to collect data from the web is with our very own [Venom](https://github.com/PreferredAI/venom) web crawler, and we often store the output in a CSV file, as shown below.

![Text within icecream.csv](/uploads/2019/04/icecream_sample_trunc.png)

Now that we have collected all this data, how do we make use of it? Typically, we use large datasets for the training of a mathematical model, which calculates an output through a learnt combination of its input variables. Such models, once trained, can then used to predict results from arbitrary inputs. Before we begin to construct the model, however, we typically find it useful to conduct an initial data exploration. This step involves understanding the relations between various variables in the dataset, which then allows us to create models that better fit the dataset. CSVPL simplifies such data exploration tasks, allowing us to conduct them quickly through a simple API.

## **Using CSVPL**

How simple is CSVPL to use? Definitely simpler than it is to pronounce[^1^](#footnote), that’s for sure! Suppose we want to visualize the relation between the Consumption and Temperature columns in icecream.csv. All it takes is a single line of code:

This command runs the [PlotData](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/PlotData.java) class with two arguments, input and name. The input argument is the location of the CSV file to be visualised, while the name argument is used for the title of the output plot.

![](/uploads/2019/04/icecream_regression.png)

Suppose we now want to plot the square of Consumption against Temperature. First, we can get the square of Consumption with the following line of code:

This creates a new output file at the specified location, and opening icecream_2.csv, we can see that a new column ((Consumption)^2) has been added to the end of each row:

![](/uploads/2019/04/icecream_2_sample_trunc.png)

Next, we remove the Consumption column, and swap the Temperature and (Consumption)^2 columns:

Opening up icecream_4.csv, we see that our data has been transformed into the proper format for PlotData

![](/uploads/2019/04/icecream_3_sample_trunc.png)

We can then visualize icecream_4.csv the same way we did before:

If everything goes to plan, you should get the following plot:

![](/uploads/2019/04/icecream_2_regression.png)

## Extending CSVPL

CSVPL is also built to be extensible, allowing you to add your own custom processing elements! To do so, just edit [dummy.java](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/Dummy.java) and place the modified java file into the pe folder. There are two parts to the file to edit, corresponding to the modifications required for the headers and the data.

For headers, we typically add a new column [at the end](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/AddX2.java#L23) of the existing headers. However, if you intend to to modify the value of an existing header, consider moving the [header to the end](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/AverageCell.java#L26) instead.

Data is received as an ArrayList, with each String object representing one row of data. First, we can get a column value by [record.get(column_index)](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/AddX2.java#L28). Next, we process the data, after which we add it to end of the record with [record.add(new_value)](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/AddX2.java#L31). Again, if we are modifying the value of an existing header, remember to remove the old value with [record.remove(column)](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/AverageCell.java#L40)! Lastly, we do [printer.printRecord(record)](https://github.com/PreferredAI/csvpl/blob/master/src/main/java/ai/preferred/regression/pe/AddX2.java#L32) to write the processed row to the output file.

## Next Steps

After reading this post, you should now know what CSVPL is and how to use it. We hope that CSVPL is able to provide you with a simple and extensible alternative to packages such as [SciPy](https://www.scipy.org/) or [Scikit-Learn](https://scikit-learn.org/stable/) for data exploration.

Interested to try CSVPL for yourself? Clone (and star!) the [CSVPL github repository](https://github.com/PreferredAI/csvpl), where you can try the [exercises](https://github.com/PreferredAI/csvpl/tree/master/src/main/java/ai/preferred/regression/exercise) or just use it to explore some [sample datasets](https://github.com/PreferredAI/csvpl/tree/master/data). Also, don’t forget to send a pull requests if you create a new Processing Element!

[1] Here at Preferred.AI, we [pronounce](https://itinerarium.github.io/phoneme-synthesis/?w=/si ɛs vi pi ɛl/﻿) it [/si ɛs vi pi ɛl/](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet)﻿

