# apollo-graphql-federation-starter-kit

> Apollo-mongo-datasource, Dataloader, handle cache with Redis

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![MIT License][license-shield]][license-url]

This project is guide start with mongoDatasource, Dataloader and handle cache with Redis.

![](https://github.com/othneildrew/Best-README-Template/raw/master/images/logo.png)

<!-- GETTING STARTED -->

## Installing / Getting started

- You must be a member and added ssh key of workspace on bitbucket/gitlab. Clone the repo

```sh
git clone https://github.com/vunguyen2009techdev/apollo-graphql-federation-starter-kit.git
```

## Development setup

### Built With

- @apollo/federation@0.23.0

- @apollo/gateway@0.26.1

- apollo-server@2.22.2

- concurrently@6.0.1

- ...

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- NodeJS v14.16.x

### Setting up

Follow all step bellow to setup your dev environment

1. Setup environment variables.
   Create environment config file

```sh
cp .env.example .env
```

2. Install NPM packages

```sh
yarn install
```

3. Running sub services:

```sh
yarn server
```

4. Run gateway service:

```sh
yarn gateway
```

## Versioning

- [Current] `beta`: All code is on `master`

## Error Library graphql-shield

applyMiddleware + __resolveReference 351 (https://github.com/maticzav/graphql-middleware/issues/351)


## Contributing

1. Fork it (<https://github.com/vunguyen2009techdev/apollo-graphql-federation-starter-kit.git>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## Licensing

vunguyen2009techdev – [@DEV](anhvu.hcmus.2012@gmail.com) – anhvu.hcmus.2012@gmail.com

Private License.

All Rights Reserved

- Unauthorized copying of this file, via any medium is strictly prohibited
- Proprietary and confidential

[npm-image]: https://img.shields.io/npm/v/npm
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt