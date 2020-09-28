# Zombie API

## Description

This api is created for storing zombie characters and its equipment.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ yarn build
$ yarn start
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Usage

### Zombie

To **create** zombie all you need to do is POST zombie data to `api/zombie`.

```js
axios.post('api/zombie', {
  name: 'Zombie name',
});
// returns {name:'Zombie name', id, createdAt ...}
```

To **get** zombie use GET request to `api/zombies/<zombie-id>`

To **update** zombie use PATCH request to `api/zombies/<zombie-id>`. You can change zombie name.

To **delete** zombie use DELETE request to `api/zombies/<zombie-id>`

You can also **list all** zombies with GET `api/zombies`

#

### Items

Items have to have owner so you have to provide zombie id wchich will own item.
Also you need to provide id from exchange site so api will know what is the price and name of item.

To **create** item do POST request with all required data to `api/items`.

```js
axios.post('api/items', {
  zombie: 'someValidZombieId',
  externalId: 1,
});
// returns {name:'TurboKosa', externalId, id, createdAt ...}
```

Remember that zombie can only have 5 items

To **get** item use GET request to `api/items/<item-id>`

To **update** item use PATCH request to `api/item/<item-id>`. You can change item owner by sending another zombie id.

To **delete** item use DELETE request to `api/item/<item-id>`

You can also **list all** items with GET `api/items`

Additionaly you can **list all** external items with GET `api/items/exchange`
or only one item using its id with `api/items/exchange/<external-item-id>`

#

### Character

To get character which is a zombie with items and its summed prices use GET request on `api/character/<zombie-id>`
