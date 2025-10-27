---
title: Developing k6 test scripts locally
created: 1715761903231
updated:
tags: k6,k8s
---
# Basics

The library `k6` if often used to run some kind of workload when performing load tests. This might be on demand, or it might be as part of an application startup/rollout.

But developing these scripts locally can be tricky, since `k6` typically runs withing a docker runner. To do local development, one can install the `k6` binary, but I prefer using docker for this.

First, create a file named `script.js`, and write the test:

```js
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:8080');
  sleep(1);
}
```

Then, we feed this script to a docker container that will run `k6` for us:

```bash
docker run --rm -i grafana/k6 run - <script.js
``` 

# Cluester access - Port-forward
But say we want to test our script against a workload running in `k8s`. One of the easier way to do this is to open a port-forward to our service, and then let our docker container access the host network:

```bash
kubectl port-forward dep/my-app 8080:8080
```

Then we change our script to point to `host.docker.internal:8080`

```js
import http from 'k6/http';

import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('http://host.docker.internal:8080/something');
  sleep(1);
}
```

And now when we invoke docker with the `--net=host` flag:

```bash
docker run --rm --net=host -it grafana/k6 run - <script.js
```

# Cluster access - Telepresence
In a similar way, if our kluster uses [Telepresence](https://telepresence.io), we can instead connect with Telepresence, and then use the service names (with the namespace as TLD) directly. So in this case, if our namespace is `dev`:

```bash
telepresence connect --namespace=dev
```

And then our script:

```js
import http from 'k6/http';

import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('http://my-app-svc.dev:8080/something');
  sleep(1);
}
```

And then we run docker with the `--net=host` flag:
```bash
docker run --rm --net=host -it grafana/k6 run - <script.js
```

