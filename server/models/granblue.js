/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (dbPoolInstance) => {

  let getAll = (callback) => {
    console.log('in model getAll');
    const query = `SELECT * FROM characters`;
    dbPoolInstance.query(query, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });
  }

  let add = (data, callback) => {
    console.log('in model add');
    console.log('data in model:', data);
    let values = [data.userId, data.charId];

    const query = `INSERT INTO users_characters (user_id, character_id) VALUES ($1, $2) RETURNING *`;
    dbPoolInstance.query(query, values, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });

  };

  let getUsersCharacter = (data, callback) => {
    let values = [parseInt(data.userId), parseInt(data.charId)];
    console.log('values', values);

    const query = `SELECT DISTINCT ON (characters.id) * FROM characters INNER JOIN users_characters ON (users_characters.character_id = characters.id) WHERE users_characters.user_id = $1 AND users_characters.character_id = $2`;
    dbPoolInstance.query(query, values, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });
  };

  let getUsersCharacters = (data, callback) => {
    console.log('in getUsersCharacters');
    console.log(data)
    let values = [parseInt(data.id)];
    console.log('values', values);

    const query = `SELECT DISTINCT ON (characters.id) * FROM characters INNER JOIN users_characters ON (users_characters.character_id = characters.id) WHERE users_characters.user_id = $1`;
    dbPoolInstance.query(query, values, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });

  };

  let editSlot = (data, callback) => {
    console.log('in editSlot model');
    let values = [data.slot, parseInt(data.charId), parseInt(data.userId)];

    const query = `UPDATE users_characters SET slot = $1 WHERE character_id = $2 AND user_id = $3 RETURNING *`;
    dbPoolInstance.query(query, values, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });
  };

  let login = (data, callback) => {
    console.log('in login model');
    let values = [data.username, data.password];

    const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    dbPoolInstance.query(query, values, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });
  };

  let register = (data, callback) => {
    console.log('in register model');
    let values = [data.username, data.password];

    const query = `INSERT INTO users (username, password) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM users WHERE username = $1) RETURNING *`;
    dbPoolInstance.query(query, values, (err, result) => {
        if(err){
            callback(err, null);
        } else if (result.rows.length > 0){
            callback(null, result.rows);
        } else {
            callback(null, null);
        }
    });
  };

  return {
    getAll,
    add,
    getUsersCharacters,
    getUsersCharacter,
    editSlot,
    login,
    register
  };
};