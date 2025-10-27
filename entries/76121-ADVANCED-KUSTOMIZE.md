---
title: Advanced Kustomize
created: 1717580577465
updated:
tags: k8s,kustomize
slug: Advanced%20kustomize
---
# Inline patch

This patch will add a label to `/metadata/labels` with key `MY-LABEL` and value `MY-VALUE`, on a deployment named `DEP-NAME`.

```yaml
-- kustomization.yaml

patches:
- patch: |-
    - op: add
      path: /metadata/labels/MY-LABEL
      value: MY-VALUE
  target:
    kind: Deployment
    name: DEP-NAME
EOF
```

The available operations are `add`, `remove` and `replace`

# Delete
You can create a patch to delete an entire resource, like this:
```yaml
$patch: delete
apiVersion: v1
kind: Service
metadata:
  name: app-svc
```
And then include it in your kustomization.yaml

Another alternaltive is just deleting a sub-part of a resource. Say we got this:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc
spec:
  metadata:
    labels:
      app: something
```
Then you can delete the `labels` object (and everything below it) with the following patch:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc
spec:
  metadata:
    labels:
     $patch: delete
```

# Transformers
Transformers are built-in ways to modified resources that are typically exposed through special keywords (such as `commonLabels` or `imageTransformers`). But you can write your own.

This example creates a custom label transformer, that will add the label `purpose: run-task` to all CronJobs. Please note that the `metadata.name` doesn't really matter, but has to have _some_ value (or the patch is rejected with an error). The `fieldSpec` is a list, so it can target multiple types of resources.
```yaml
-- kustomization.yaml

transformers:
  - label-transformer.yaml
```

```yaml
-- label-transformer.yaml
apiVersion: builtin
kind: LabelTransformer
metadata:
  name: ".*"
labels:
  purpose: run-tasks
fieldSpecs:
- kind: CronJob
  path: metadata/labels
  create: true
```

# More
See https://www.innoq.com/en/blog/2022/07/advanced-kustomize-features/
