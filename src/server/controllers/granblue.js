module.exports = (db) => {
  // let get = (request, response) => {
  //     // use pokemon model method `get` to retrieve pokemon data
  //     console.log( db )
  //     db.pokemon.get(request.params.id, (error, pokemon) => {
  //       // queryResult contains pokemon data returned from the pokemon model
  //       if (error) {
  //         console.error('error getting pokemon', error);
  //         response.status(500);
  //         response.send('server error');
  //       } else {
  //         if( pokemon === null ){
  //           // render pokemon view in the pokemon folder
  //           response.status(404);
  //           response.send('not found');
  //         }else{
  //           // render pokemon view in the pokemon folder
  //           response.render('pokemon/show', { pokemon: pokemon });
  //         }
  //       }
  //     });
  // };


  let getUsersCharacters = (req, res) => {
    db.granblue.getUsersCharacters(req.params, (err, result) => {
        if(err){
            console.log(err);
        } else if (result === null){
            res.send('null');
        } else {
            res.send(result);
        }
    });
  };



  let getAll = (req, res) => {
    console.log('in ctrler getAll');
    db.granblue.getAll((err, result) => {
        if(err){
            console.log('err', err);
        } else if (result === null){
            res.status(404).send('not found');
        } else {
            res.send(result);
        };
    });
  };

  let add = (req, res) => {
    console.log('in ctr add');
    db.granblue.add(req.body, (err, result) => {
        if(err){
            console.log('err,', err);
        } else if (result === null){
            res.status(404).send('not found');
        } else {
            res.send(result);
        };
    });
  };

  return {
    getUsersCharacters : getUsersCharacters,
    getAll : getAll,
    add : add
  }

};