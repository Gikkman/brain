---
title: Running Java program inside Jib built image
created: 1761730399230
updated:
tags: java,jib,docker
slug: Running%20Java%20program%20inside%20Jib%20built%20image
---
# Running Java manually inside Jib container
Jib builds a Docker image, but there is no clear Dockerfile to follow. But the following information is good to know and will help out:


When Jib builds an image, it installs your app (classes, resources, dependencies) under `/app`. It also sets the entrypoint of the image to something akin to this:
```
ENTRYPOINT ["java", "-cp", "/app/resources:/app/classes:/app/libs/*", "com.example.YourMainClass"]
```
So if we just run the image "normally", via say `docker run my-image`, it will launcht the Java app inside a container right away due to the entrypoint.


Instead, we can run the image via a custom entrypoint, like so:
```
docker run -it --entrypoint /bin/bash my-image
```
And then we can run the Java process manually via the same command:
```
java -cp /app/resources:/app/classes:/app/libs/* com.example.TheMainClass
```

# Running in parallell with the normal entrypoint
If you're starting a session towards a container that is alreay running your Java image, and want to start another Java process, you might see the following error:

```
Picked up JAVA_TOOL_OPTIONS: <OPTIONS>
ERROR: transport error 202: bind failed: Address already in use 
ERROR: JDWP Transport dt_socket failed to initialize
```

This is because Jib sets a debug socket to be open on port 5005 via `JAVA_TOOL_OPTS`. To fix this, run:
```
unset JAVA_TOOL_OPTS
```
Then launch your Java process.

# Good to know

It might be good to set a Spring profile as you launch Java
```
SPRING_PROFILES_ACTIVE=test java -cp /app/resources:/app/classes:/app/libs/* com.example.TheMainClass
```

You can naviage the app's content via:
```
ls -lah /app/<path>
```

If something's up with the classpath, you can inspect what it is set to via
```
echo $CLASSPATH
```

