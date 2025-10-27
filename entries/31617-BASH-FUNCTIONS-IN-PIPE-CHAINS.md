---
title: Bash functions in pipe chains
created: 1733479960307
updated:
tags: bash
slug: Bash%20functions%20in%20pipe%20chains
---
You can add a bash function in-line a series of pipes like this:

```bash
#! /usr/bin/env bash

style() { 
    tr b x |
    tr c x
}

echo abcd | tr a x | style | tr d x
```

