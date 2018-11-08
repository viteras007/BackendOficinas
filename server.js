const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex');
/*
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'Oficinas'
    }
  });
  */
  var db = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'Oficinas'
    }
  });


app.use(bodyParser.json());
app.use(cors())

// Mostrar todos no DAO (database.users)
app.get('/', (req, res) => {
    
})
// Faz login com o usuário requerido no DAO
app.post('/login', (req, res) => {   
    const { email, password} = req.body;
    db.where({
        email: email,
        password: password
    }).select()
    .from('users')
    .then(user => {
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json('user not found!');
        }
    })
    .catch(err => res.status(400).json('error!!'));
})

// Muda senha do usuario
app.put('/changepasswd', (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', id)
    .update({password: req.body.password})
    .returning('*')
    .then(user => {
        if(user.length){
            res.json(user)
        }
        else{
            res.status(400).json('change password fail!')
        }
    })
    .catch(err => res.status(400).json('error!'));
})
//Altera todos dados do usuario
app.put('/alterauser', (req, res) => {
    const { id, height, weight} = req.body;
    const imc = weight / (height * height); //ALTURA EM METROS , SE USAR EM CM  TEM Q MUDAR
    db('users')
    .where('id', id)
    .update({        
        height: height,
        weight: weight,
        imc: imc     
    })
    .returning('*')
    .then(user => {
        res.json(user);
    })
    .catch(err => res.status(400).json('error!'));
})
//Alterar meta do usuario
app.put('/alteragoal', (req, res) => {
    const { id,goal } = req.body;
    db('users')
    .where('id', id)
    .update({goal: goal})
    .returning('*')
    .then(user => {
        res.json(user);
    })
    .catch(err => res.status(400).json('error!'));
})

// Retorna o usuario pelo ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;    
    db.select('*').from('users').where({ id })
        .then(user =>{
            if(user.length){
                res.json(user[0])
            }
            else{
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))
    
})

// registra um novo usuario com o id 125 e dados recebidos
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*')
    .insert({
        name: name,
        email: email,
        password: password,        
        joined: new Date()
    })       
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'))

})

//    ========================================== ALIMENTO ==========================================

// Inserir alimento
app.post('/insertfood', (req, res) => {    
    const { caloria, name, proteina, carboidrato, gordura } = req.body;
    db('food')
    .returning('*')
    .insert({
        name: name,
        caloria: caloria,
        proteina: proteina, 
        carboidrato: carboidrato, 
        gordura: gordura,     
        dataregistro: new Date()
    })       
        .then(food => {
            res.json(food[0]);
        })
        .catch(err => res.status(400).json('unable to register this food'))
})

// Retorna o alimento pelo ID
app.get('/food/:id', (req, res) => {
    const { id } = req.params;    
    db.select('*').from('food').where({ id })
        .then(food =>{
            if(food.length){
                res.json(food[0])
            }
            else{
                res.status(400).json('Not Found')
            }
        })
        .catch(err => res.status(400).json('Error getting Food'))
})
// update no alimento passando id e alterando apenas o nome
app.put('/updatefood', (req, res) => {
    const { id , name, caloria, proteina, carboidrato , gordura} = req.body;
    db('food')
    .where('id', id)
    .update({
        name: name,
        caloria: caloria,
        proteina: proteina, 
        carboidrato: carboidrato, 
        gordura: gordura,
    })
    .returning('*')
    .then(food => {
        if(food.length){
            res.json(food)
        }
        else{
            res.status(400).json('change food fail!')
        }
    })
    .catch(err => res.status(400).json('error!'));
})

// deletar alimento (dando um erro no cmd de headers)
app.delete('/delfood', (req, res) => {
    const { id } = req.body;    
    db('food')
    .where('id', id)
    .del()
    .then(response => {
      res.json("REMOVIDO COM SUCESSO")
    })
    .catch(err => res.status(400).json('error!'));
          
})
// 
app.get('/allfood', (req, res) => {     
    db.select().from('food').then(response => {res.json(response)})
          
})



//    ========================================== Servidor ==========================================
app.listen(3001, () => {
    console.log('app is running on port 3001');
});