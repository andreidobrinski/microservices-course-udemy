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
