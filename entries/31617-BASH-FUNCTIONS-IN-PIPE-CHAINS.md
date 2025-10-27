---
title: Bash functions in pipe chains
created: 1733479960307
updated:
tags: 
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

