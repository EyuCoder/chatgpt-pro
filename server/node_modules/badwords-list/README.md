badwords-list v1.0.0
========

A highly consumable list of bad (profanity) english words based on the nice short and simple list found in [Google's "what do you love" project](http://www.wdyl.com/) made accessable by [Jamie Wilkinson](https://gist.github.com/jamiew) [here](https://gist.github.com/jamiew/1112488)

Inspired by [badwords](https://github.com/MauriceButler/badwords)

This data has been exposed as an object that contains

 - an array
 - an object
 - a regular expression

depending on what is required for your purposes.


Install
=======

    npm install badwords-list

Usage
=====

```
var list = require('badwords-list'),
	array = list.array,
	object = list.object,
	regex = list.regex;
```

Testing
=======

####Requires
- Mocha
- better-assert


```
npm test
```

**or**

```
REPORTER=spec make
```

**or**

```
mocha
```



