---
title: Splunk search around matches
created: 1709650813417
updated:
tags: splunk
---
This is an example of a splunk search that searches around matching rows:

```
host="prod*" AND ("service" OR "SQLSTATE")
[
  | search host="prod*" openshift_deployment_name="service-a-*" SQLSTATE
  | eval earliest=_time-1
  | eval latest=_time+0.1
  | fields earliest latest
  | FORMAT "(" "(" "" ")" "OR" ")"
]
```

The "inner" search (between `[` and `]`) will run first, and find a set of rows that contains the word `SQLSTATE`. Then we format those rows so we get a time span for each row (in this example, -1 second and +0.1 seconds). 
The outer search will then search for the words `service` or `SQLSTATE` in the time spans returned by the inner search.  

It is also possible to return additional fields from the inner search. For example, you could include `host` in the fields list, as long as it comes before `earliest` and `latets`. The outer search will then require that field too.

# Useful links
https://support.hashicorp.com/hc/en-us/articles/5295078989075-Resolving-Common-Errors-in-Envoy-Proxy-A-Troubleshooting-Guide
