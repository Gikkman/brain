---
title: Common Istio error codes
created: 1711102409175
updated:
tags: istio
slug: Common%20Istio%20error%20codes
---

## delayed connect error: 111
```
upstream connect error or disconnect/reset before headers. reset reason: connection failure, transport failure reason: delayed connect error: 111
```
The error code 111 typically corresponds to the `ECONNREFUSED` error in Linux, which means that the connection was refused by the server(sidecar). This generally indicates that no process is listening on the IP:Port combination that the client is trying to connect to.

A common cause of this can be that the sidecar is not available (restarting/crashing) and continue to receive request.You typically need to configure Istio to use graceful shutdown or readiness probes.

## delayed connect error: 113
```
upstream reset: reset reason: connection failure, transport failure reason: delayed connect error: 113
```
The error code 113 typically corresponds to the `EHOSTUNREACH`  error in Linux, which means that the host you are trying to reach is unreachable. This error occurs at the network level and indicates that a route to the specified host cannot be found, preventing any kind of network connection or communication.

# Useful links
https://support.hashicorp.com/hc/en-us/articles/5295078989075-Resolving-Common-Errors-in-Envoy-Proxy-A-Troubleshooting-Guide

