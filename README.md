## PGA Recruiting - Players API Project

The purpose of this project is to give you an opportunity to showcase your coding style with node.

You can use any tools (IDE, npm, ...) and resources (google, stackoverflow,...) you use in your day to day.
However, _you_ should come up with the implementation on your own.

## Overview

We need to manage players, with data consisting of:
* `id` — player's unique ID
* `name` — player's full name
* `team` — player's team — one of `red`, `blue`, `green`, or `yellow`
* `isActive` — player's status, `true` or `false`
* `points` — player's points [`0` — `100`]

For that purpose create a REST API with the following endpoints:
* `GET /players` — lists all players
* `POST /players` — creates new player
* `GET /players/:id` — get a player
* `DELETE /players/:id` — deletes a player
* `PUT /players/:id` — update a player

## Requirements

* Code must be written using [`standard`](https://www.npmjs.com/package/standard) style convention

* Code should run in `Node 8.10`

* Code should be tested (_we use and prefer `jest`, but other testing frameworks will do_)

* Use `./src/db.json` as a starting list of players — you can continue using `db.json` to store the players for this project, or you can just use it to import the players into a DB of your choice if that works better for you

* Free to use anything for developing and hosting the API (express, Heroku, AWS, Google Cloud etc.), anything works as long as it's JavaScript

* _Although not required, bonus points for pagination, sorting, and filtering_

## Submitting the project
 * Clone (_not fork_) this repo
 * Implement a working solution
 * Submit the links to your PGA contact
## Serverless Functions - Packaging and Deployment
  * Serverless Functions - Packaging Command
    * `sam package --output-template-file packaged.yaml --s3-bucket pga.codetest.sls.package.bucket`
  * Serverless Functions - Deploy Command
    * `sam deploy --template-file packaged.yaml --stack-name pga-codetest-sls-stack --capabilities CAPABILITY_IAM  --region us-east-2`
