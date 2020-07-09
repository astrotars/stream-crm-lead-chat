# Stream CRM Integration with Lead creation

> **_This API is not meant for production as there is no auth in place. Please
> use carefully in testing and development environments only!_**

## Getting Started

Create account an account with Stream and, if needed, a trial with Zendesk. Within Stream create
a new Application and create new App Keys within that Application, as described in the main README.md.

Create a `.env` file within the main directory with the
following environment variables found on https://getstream.io/dashboard and
from Zendesk, as follows:

```
NODE_ENV=production
PORT=8080

STREAM_API_KEY=<YOUR_API_KEY>
STREAM_API_SECRET=<YOUR_API_SECRET>
CRMTOKEN=<YOUR_CRM_SECURITY_TOKEN>
```

> Note: You can reference `.env.example`.

## Starting the backend

To spin this up, clone it and run `yarn install` within the `backend` directory,
then run `yarn start`.

