# One User Login REST API

## Description

Stories:

1. A user can login with a username and password
2. Return success and a JWT token if username and password are correct
3. Return fail if username and password are not matched
4. A user has a maximum of 3 attempts within 5 minutes, otherwise, the user will be locked.
5. Return fail if a user is locked

Stacks: Express.js, MongoDB
Mainly uses modules: `mongoose`, `express-session`, `body-parser`

Use `express-generator` to generate the skeleton code of an express project.

## Demo

https://www.youtube.com/watch?v=rzusT6767y8

## How to run

### Install all dependencies listed in the `package.json` file

```
npm install
```

### Build js(commonjs) based on ts

```
npm run build
```

### Run the project locally

```
npm run start
```

### Open the simple login ui `index.html` to test the RESTful API

## Database

### Connecting with MongoDB Driver and insert a new user

Install your driver

```
npm install mongodb
```

Add your connection string into your application code, and insert hard code data to db

```
node path/to/insert_user.js <inserted_username> <inserted_password>
```

Then will give log the new created user information that insert to user_service.user_info if it is connected to the MongoDB Driver successfully.

```
Connected to MongoDB
Successfully inserted: {
  acknowledged: true,
  insertedId: new ObjectId('65657c80984166072f15f694')
}
Connection closed
```

### Pre-commit Hooks

- sets up Husky to run `lint-staged` before each commit
- specifies that for files matching the specified patterns `*.{js,jsx,ts,tsx}`

## Testing Strategy

### Unit Test

#### How to run

```
npm run test:unit
```

### Integration Test

```
npm run test:integration
```
