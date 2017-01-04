'use strict';

module.exports = function(Game) {
    Game.request = function(address, cb) {
      this.find(null, (err,data) => {
          if (data.length == 0) { // start new game
            this.create({player1: address}, err, data => {
                this.find(null, (err, data) => {
                    cb(null, data)
                })
            })
          } 
          else { // player waiting to start game
            let game = data[0];
            game.player2 = address;
            this.upsert(game, (err, data) => {
                cb(null, data)
            })
          }
      })
    }

    Game.remoteMethod('request', {
        accepts: {arg: 'address', type: 'string'},
        returns: {arg: 'data', type: 'string'}
    });

    Game.move = function(address, row, col, cb) {
      this.find(null, (err,data) => {
        let game = data[0]
        let obj = {}
        obj.address = address
        obj.row = row
        obj.col = col
        game.tx_log.push(obj)
        this.upsert(game, (err, data) => {
            cb(null, data)
        })
      })
    }

    Game.remoteMethod('move', {
        accepts: [
            {arg: 'address', type: 'string'},
            {arg: 'row', type:'string'},
            {adr: 'col', type:'string'}
        ],
        returns: {arg: 'data', type: 'string'}
    });
};