# Human API

This API is used retrieve session and access tokens from Human API.

## Overview

This Node API has one endpoint, `/humanApiSessionService`, used to consume **POST** responses as follows.

- In response to the session token post, the Human API service returns the following object as response
- "expires_in": 3600,
    "human_id": "446d30ee4c67ce441c566c052cbf5acf",
    "session_token": "eyJraWQiOiJsRGxXMXNXUWZlUG1XVTVmcWRLdHZBV3JiS2ZaOUtIa0JWWFlHbkh6RGZvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULld2VlVNQmxBUlBEcTNuNWpvWnpjalBDMldnaThnem0xNW5URVZwRGFoUHciLCJpc3MiOiJodHRwczovL2h1bWFuYXBpLm9rdGEuY29tL29hdXRoMi9hdXN1bHY5d2tjcEx5UDJEZDI5NiIsImF1ZCI6ImNvLmh1bWFuYXBpLnByb2R1Y3Rpb24iLCJpYXQiOjE1Njk1OTA5OTMsImV4cCI6MTU2OTU5NDU5MywiY2lkIjoiMG9hdWx2aWRxdE5VeUZlYkoyOTYiLCJ1aWQiOiIwMHUyOGJ0c2ZuYldsMzM2STI5NyIsInNjcCI6WyJhbm9ueW1vdXMiXSwic3ViIjoiYW5vbi11c2VyKzJlYjVhZWIwLWRmYzktMTFlOS04NDkwLTBkNWZhMGU0MzliM0Bub3QuaHVtYW5hcGkuY28iLCJjbGllbnRJZCI6IjY3Y2QxNGQxOTlhZjJiMjUyMTFiMDRiZmNhMjUyYWNmZDI5YmUzYTAiLCJodW1hbklkIjoiNDQ2ZDMwZWU0YzY3Y2U0NDFjNTY2YzA1MmNiZjVhY2YiLCJncm91cHMiOlsiZW5kdXNlcnNfYW5vbnltb3VzIl0sInVzZXJJZCI6IjVkOGJiZDY1OTg2ZTkwMmUwMDRjYzQ5NSJ9.LLdGcSi7MBVW6q3sU5Mw_gx6NwOo-pLkhY-1PhWgmi5UKbdwIfJJYPz_tRpPpWRIxIijQp5A4QX7ncTZD9ZlwH53m5mfVN5My50tkTh24Xk8cDQEd--FmIFDijLi641Tser9QI3IoR9j6VkmGoooAGJLC7z9VOcNrUwzHq_2At4CtwLx4TeA9YGh_qHD_dlCT9obSqXV7YiO2gYezSwHOXfXC5rhhCZ3557G1Ft1kC5B7r0BGxjFgNNtsRyvDTPPQBr229axHRBXdSfPzxuWRqfbXY6degqr7WQJE1gTVLPGXQol51ImZi_jV5v2SaEwKFCP4Rza2GMN9UFpGKXDDw"
}

## Important Commands

Here is a list of `npm` commands you will need to interact with the API:

### `npm install`

Allows you to install the `dependencies` and `devDependencies` that are listed within the `package.json` file.

### `npm test`

This command runs the entire test suite for the API. This repository uses [Jest](https://jestjs.io/) for testing.

### `npm run dev`

Allows you to run this API locally for testing purposes. The app will be listening on port `8000` by default.

### `npm build`

Builds a production-ready version of the API and outputs it into a `dist/` folder. This command is primarily meant for production builds, and is being run in the concoursepipeline before pushing to PCF.

### `npm run coverage`

Allows you to view the test coverage of the code. The results are saved to a `coverage/` folder, and can be viewed in a browser by running `open coverage/index.html` from the project's root directory.

## Possible API Requests

