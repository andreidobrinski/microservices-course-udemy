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

`kubectl exec -it podname sh`: runs shell inside pod

`kubectl logs podname`: shows logs

`kubectl delete pod podname`: deletes pod imperatively

`kubectl describe pod podname`: gives info about podname

`kubectl rollout restart deployment $depl_name`: restarts deployment

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/cloud/deploy.yaml`: Ingress Nginx config

Host File Update

- macOS: /etc/hosts
  add `127.0.0.1 posts.com`

## Services for GitTix (StubHub clone)

- auth: sign in/up/out
- tickets: ticket creation and editing. knows if a ticket can be updated
- orders: order creation/editing
- expiration: expires orders after 15 mins
- payments: CC payments, cancellations

Object types:

User

- name: string
- password: string

Ticket

- title: string
- price: number
- userId: ref to user
- orderId: ref to order

Order

- userId: ref to user
- status: Created | Cancelled | AwaitingPayment | Completed
- ticketId: ref to ticket
- expiresAt: Date

Charge

- orderId: ref to order
- status: Created | Failed | Completed
- amount: number
- stripeId: string
- stripeRefundId: string

Type `thisisunsafe` into Chrome to develop with http (not s)

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf`: imperatively creates a generic jwt secret token with asdf as the string

## NATS

NATS streaming web UI

- when connected to localhost port 8222
- localhost:8222/streaming/channels
- add ?subs=1 to url to see subscriptions

NATS args in k8s depl

- hbi: how often the server makes a heartbeat request to each of its clients
- hbt: how long each client has to respond
- hbf: how many times the client can fail before nats assumes that the connection is dead

Only the primary service responsible for a record is responsible for incrementing the version number

## CI

GitHub Actions

Action to run tests

```
name: tests
on:
  pull_request:
    paths:
      - 'auth/**'
      # only runs test when changes occur in auth directory

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd auth && npm install && npm run test:ci
      # adding an additional run command runs them in series
      # adding an additional gh-action makes them run in parallel
```

Action to build image

```
# deploy-auth.yaml

name: deploy-auth

on:
  push:
    branches:
      - master
    paths:
      - 'auth/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd auth && docker build -t dockerId/auth .
      # uses gh secrets in settings
      - run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker push dockerId/auth
```
