# Docker init

```
cd MicroServices

cp .env.example .env

docker-compose up -d --build
```
You can install node package outside of docker to IDE indexed (not mount with docker - only for IDE), ex:
```
cd AuthService
npm i
```

---
#API LIST
## User

#### API user list
```
http://localhost:3001/api/users
```

#### API user detail
```
http://localhost:3001/api/users/:id
```

#### create sample user
```
http://localhost:3001/api/users/mock
```

---
## Product

#### API product list
```
http://localhost:3002/api/products
```

#### API product detail
```
http://localhost:3002/api/products/:id
```

#### create sample product
```
http://localhost:3002/api/products/create
```

---
## Order

#### API order list
```
http://localhost:3003/api/orders
```

#### API order detail
```
http://localhost:3003/api/orders/:id
```

---
## Payment

#### API payment list
```
http://localhost:3004/api/payments
```

#### API payment detail
```
http://localhost:3004/api/payments/:id
```

---