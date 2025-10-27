---
title: Istio and Telepresence
created: 1725023935623
updated:
tags: istio,telepresence
slug: Istio%20and%20Telepresence
---
# Istio and Telepresence

If you wish to use Telepresence together with Istio, and you're using the default setup where the traffic manager resides in the `ambassador` namespace, then you will need a network policy to allow communication from the `ambassador` namespace to the namespaces with Istio. The policy looks like this:

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-from-ambassador
  namespace: eph-test
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ambassador
  policyTypes:
    - Ingress
```

