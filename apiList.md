### DEVTINDER API's

### authRouter
- POST  /signup
- POST  /login 
- POST  /logout 

### profileRouter
- GET  /profile/view
- PATCH  /profile/edit
- PATCH /profile/password/edit 

### connectionRequestsRouter
- POST  /connection/sent/interested/:userId
- POST  /connection/sent/ignore/:userId
- POST ACCEPT  /connection/review/accept/:requestId
- POST REJECT  /connection/review/reject/:requestId

### userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed

### Status : ignore,interested,accepted,rejected 

