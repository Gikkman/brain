---
title: Splunk JOIN query
created: 1709112465500
updated:
tags: splunk
slug: Splunk%20JOIN%20query
---
The following is an example of a JOIN query in Splunk. It will find all pods that's spawned from a Job, that has the text "PodFailed" somewhere in its event. Then, it will join it with all events that says "Created job...", and join them on the name of the job.

What's good to know is that the merge key (i.e. what's used in the `where` clause in the `join` command) cannot be a field that's the result of a `eval` (but apparently a field from a `rex` command is just fine).

```
(index=openshift_generic_logs) PodFailed
  | search "object.kind"=Pod
  | search "object.metadata.ownerReferences{}.kind"=Job
  | spath "object.metadata.name" output=PodName,
  | spath "object.metadata.creationTimestamp" output=Created,
  | spath "object.metadata.namespace" output=Namespace
  | spath "object.metadata.ownerReferences{}.name" output=OwnerName
  | stats dc(PodName) by Namespace, OwnerName, PodName, Created
  | table Namespace, OwnerName, PodName, Created
| join type=inner left=Pod right=Cron where Pod.OwnerName=Cron.CreatedJob
[
  search (index=openshift_generic_logs)
  | search message="Created job*"
  | search kind=CronJob
  | rex field=message "^.*Created job (?<CreatedJob>[\w\d-]+)$"
  | rex field=object "^.*/(?<CronJobName>[\w\d-]+)$"
  | table CreatedJob, CronJobName
]
| stats min(Pod.Created) as FirstTime, max(Pod.Created) as LastTime, dc(Pod.PodName) as Count, by Cron.CronJobName, Pod.Namespace
| sort -LastTime
| rename Cron.CronJobName to CronJob
| rename Pod.Namespace to Namespace
| table FirstTime, LastTime, Namespace, CronJob, Count
```

