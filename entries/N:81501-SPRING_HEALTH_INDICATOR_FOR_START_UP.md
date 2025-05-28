---
title: Spring Health Indicator for start up
created: 1715157601210
updated:
tags: spring,java
---
# Custom health indicator
Create a custom health indicator that handles the startup part of health

```java
@Component
public class StartupHealthCheck implements HealthIndicator {
    private final StartupRunner runner;

    StartupHealthCheck(StartupRunner runner) {
        this.runner = runner;
    }

    @Override
    public Health health() {
        if (startup.complete())
            return Health.up().build();

        return Health.down()
                .withDetail("Status", "Start up in progress")
                .build();
    }
}
```

# Startup executor
Create a class that runs the startup tasks
```java
@Component
public class StartupRunner {
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private final List<NeedsStartup> startupComponents;
    private Future<?> future;

    public WarmupExecutor(List<NeedsStartup> startupComponents) {
        this.startupComponents = startupComponents;
    }

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        future = executorService.submit(this::runStartup);
        executorService.shutdown(); // Queue shutdown of the exeuctor as soon as it done with its task
    }

    @PreDestroy
    public void destroy() {
        executorService.shutdown();
    }

    public boolean complete() {
        return future.isDone();
    }

    public void runStartup() {
        StopWatch sw = new StopWatch();

        for (NeedsStartup component : startupComponents) {
            String componentName = component.getClass().getName();
            log.info("Starting up component: {}", componentName);
            try {
                sw.start(componentName);

                warmupComponent.runStartup();
            } catch (Exception e) {
                log.error("Failed to start component {}", componentName, e);
            } finally {
                sw.stop();
            }
        }

        for (StopWatch.TaskInfo taskInfo : sw.getTaskInfo())
            log.info("Start time for {}: {} seconds", taskInfo.getTaskName(), taskInfo.getTimeSeconds());

        log.info("Start time total: {} seconds", sw.getTotalTimeSeconds());
    }
}
```

# Interface
```java
public interface NeedsStartup {
    void runStartup();
}
```

