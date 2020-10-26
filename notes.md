## Monolithic Architecture

- all code is in one codebase, deployed all at once
- contains all routing, middleware, business logic and database access to implement all features of the app

## Microservice

- contains all routing, middleware, business logic and db access to implement one feature of the app
- challenge: data management between services
- service A will never reach into service B's database

## Database-per-service

- services should run independently of other services
  - if a DB crashes, it won't take another service down with it
- db schemas can change independently
- services might function more efficiently with a different type of db (sql vs nosql)

## Communicating between services

### Sync

- services communicate with direct requests
- service X makes HTTP request to service Y
- service X doesn't need a db
- (-)dependency between services
  - downtime affects both
  - dependency web can get complicated
- (-)entire request is only as fast as the slowest request

### Async

- services communicate with events
- using an Event Bus to communicate, has issues similar to Sync

Create a new db from existing dbs with just the data you need

- when service B updates its db, an event is emitted about the update
- event flows into event bus and then moves to any other interested services
- other services record that data in their db
- (+) no dependencies on other services
- (-) data gets duplicated

## Docker

`docker build -t username/reponame .`: Builds image

`docker run username/reponame`: runs image in container

`docker run -it username/reponame sh`: runs a shell inside the running image

`docker ps`: shows running containers

`docker logs $ID`: prints logs emitted from process

## Kubernetes

- `cd` into k8s directory
- after creating a k8s posts.yaml config, run `kubectl apply -f posts.yaml`

`kubectl get pods`: shows running pods
