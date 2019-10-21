# Meetup API

Event management API made with NodeJS/Express

# Install

After clone the project on your local machine, configure the `.env` file and fill with your private informations. Run in your project directory:

```bash
$ cp .env.example .env
```

### Runing with `Docker`

Install `Docker` and `Docker Compose` and run:

```bash
$ docker-compose up -d
```

# Endpoints

## File Upload

#### Request

> POST `/files`

#### Response

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
Content-Type: multipart/form-data

{
  "file": [YOUR_FILE]
}
```

```javascript
{
    "url": "http://localhost:3333/files/970628bdc4794eedc3fe2a57501b745f.jpeg",
    "id": 2,
    "name": "original-filename.jpeg",
    "path": "970628bdc4794eedc3fe2a57501b745f.jpeg",
    "updatedAt": "2019-10-12T20:42:00.505Z",
    "createdAt": "2019-10-12T20:42:00.505Z"
}
```

## Users

### Create User

> POST /users

#### Request

```javascript
{
	"name": "Jhon Doe",
	"email": "john@hotmail.com",
	"password": "123456",
	"passwordConfirmation": "123456"
}
```

#### Response

```javascript
{
    "id": 7,
    "name": "Jhon Doe",
    "email": "john@hotmail.com"
}
```

### Update User

Update token user.

> PUT /users

#### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

```javascript
{
	"name": "Jhon Jhon",
	"email": "john@gmail.com",
	"password": "123456",
	"passwordConfirmation": "123456"
}
```

#### Response

```javascript
{
    "id": 7,
    "name": "Jhon Jhon",
    "email": "john@gmail.com"
}
```

### Authentication

Get a token of access.

> POST /users

#### Request

```javascript
{
	"email": "john@gmail.com",
	"password": "123456"
}
```

#### Response

```javascript
{
    "user": {
        "id": 7,
        "name": "Jhon Doe",
        "email": "john@gmail.com",
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTcxNTIxMzExLCJleHAiOjE1NzIxMjYxMTF9.6aMCRnFkYhe1MMrOCLiD764OhyyJzHHFJFNECB5JYzM"
}
```

## Meetups

### List Meetups

> GET /meetups

or you can filter by `date` and paginate your results

> GET /meetups?date=2019-10-19&page=1

### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

#### Response

```javascript
[
    {
        "finished": true,
        "id": 12,
        "title": "React JS Meetup",
        "description": "Lorem ipsum dolor sit armet",
        "location": "San Andreas, n 6587, 898.989-989",
        "date": "2019-10-19T18:00:00.000Z",
        "createdAt": "2019-10-19T21:53:02.966Z",
        "updatedAt": "2019-10-19T21:53:02.966Z",
        "file_id": 2,
        "user_id": 1,
        "organizer": {
            "id": 7,
            "name": "Jhon Doe",
            "email": "jhon@gmail.com"
        },
        "banner": {
            "url": "http://localhost:3333/files/970628bdc4794eedc3fe2a57501b745f.jpeg",
            "name": "image-name.jpeg",
            "path": "970628bdc4794eedc3fe2a57501b745f.jpeg",
            "id": 2
        }
    },
  ...
]
```

### Create Meetups

> POST /meetups

### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

```javascript
{
	"title": "React JS Meetup",
	"description": "Lorem ipsum dolor sit armet",
	"date": "Sat Oct 19 2019 14:00:00 GMT-0400 (Amazon Standard Time)",
	"location": "San Andreas, n 6587, 898.989-989",
	"file_id": 2
}
```

#### Response

```javascript
{
  "finished": true,
  "id": 12,
  "title": "React JS Meetup",
  "description": "Lorem ipsum dolor sit armet",
  "location": "San Andreas, n 6587, 898.989-989",
  "date": "2019-10-19T18:00:00.000Z",
  "file_id": 2,
  "user_id": 1,
  "updatedAt": "2019-10-19T21:53:02.966Z",
  "createdAt": "2019-10-19T21:53:02.966Z"
}
```

### Update Meetups

> PUT /meetups/:id

### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

```javascript
{
	"title": "Other React JS Meetup ",
}
```

#### Response

```javascript
{
  "finished": true,
  "id": 12,
  "title": "Other React JS Meetup",
  "description": "Lorem ipsum dolor sit armet",
  "location": "San Andreas, n 6587, 898.989-989",
  "date": "2019-10-19T18:00:00.000Z",
  "file_id": 2,
  "user_id": 1,
  "updatedAt": "2019-10-19T21:53:02.966Z",
  "createdAt": "2019-10-19T21:53:02.966Z"
}
```

### Cancel Meetup

> DELETE /meetups/:id

#### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

#### Response

```javascript
{
    "message": "Meetup canceled."
}
```

### Subscribe

> POST /meetups/:id/subscriptions

#### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

#### Response

```javascript
{
    "id": 1,
    "meetup_id": 8,
    "user_id": 6,
    "updatedAt": "2019-10-19T22:10:21.126Z",
    "createdAt": "2019-10-19T22:10:21.126Z"
}
```

## Subscriptions

### List Your Subscriptions

> GET /subscriptions

#### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

#### Response

```javascript
[
  {
    id: 1,
    createdAt: '2019-10-19T22:10:21.126Z',
    updatedAt: '2019-10-19T22:10:21.126Z',
    meetup_id: 8,
    user_id: 6,
    Meetup: {
      finished: false,
      id: 8,
      title: 'React Js Meetup',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
      location: 'Avenida Calama, n 6128, Porto Velho',
      date: '2019-10-25T23:00:00.000Z',
      createdAt: '2019-10-19T18:32:01.011Z',
      updatedAt: '2019-10-19T18:32:01.011Z',
      file_id: 57,
      user_id: 1,
    },
  },
  // list others subscriptions
];
```

## Organizer

### List your meetups

> GET /organizing

#### Request

```
Authorization: Bearer [YOUR_AUTH_TOKEN]
```

#### Response

```javascript
[
  {...},
  // your meetups
]
```
