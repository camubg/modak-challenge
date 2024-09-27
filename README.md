<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Requirements

We have a Notification system that sends out email notifications of various types (status update, daily news, project invitations, etc). 
We need to protect recipients from getting too many emails, either due to system errors or due to abuse, so let’s limit the number of emails sent to them by implementing a rate-limited version of NotificationService.
The system must reject requests that are over the limit.
Some sample notification types and rate limit rules, e.g.:
- Status: not more than 2 per minute for each recipient
- News: not more than 1 per day for each recipient
- Marketing: not more than 3 per hour for each recipient
Etc. these are just samples, the system might have several rate limit rules!

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
$ npm run start
```

## Run tests

```bash
$ npm run test
```

## Endpoints

Once you run the app, you can access the swagger [here](http://localhost:3000/api/)

- [GET] Health point check
```
curl --request GET 'http://localhost:3000/hello'
```

- [POST] Send a sms
```
curl --request POST \
  --url http://localhost:3000/v1/notification \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/9.2.0' \
  --data '{
	"type": "status",
	"userId": "cami@gmail",
	"message": "holaaa"
}'

```