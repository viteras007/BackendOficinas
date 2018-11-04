const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'Oficinas'
    }
  });



  db.select('*').from('users').then(data=>{
      //console.log(data);
  });

app.use(bodyParser.json());
app.use(cors())

//    ========================================== DAO ==========================================
const database = {
    users: [
        {
            id: '123',
            name: 'Victor',
            email: 'victor@gmail.com',
            password: '1234',
            height: '',
            weight: '',
            goal: '',
            imc: '',
            joined: new Date()
        },
        {
            id: '124',
            name: 'Andre',
            email: 'andre@gmail.com',
            password: '1234',
            height: '',
            weight: '',
            goal: '',
            imc: '',
            joined: new Date()
        }
    ],
}
const databaseAlimento = {
    alimento: [
        {
            id: '1',
            name: 'Banana',
            caloria: '20g',
            proteina: '20g',
            carboidrato: '20g',
            gordura: '20g',
            dataRegistro: new Date()
        },
        {
            id: '2',
            name: 'maça',
            caloria: '20g',
            proteina: '20g',
            carboidrato: '20g',
            gordura: '20g',
            dataRegistro: new Date()
        }
    ],
}
//    ========================================== USUARIO ==========================================

// Mostrar todos no DAO (database.users)
app.get('/', (req, res) => {
    res.send(database.users);
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
    databaseAlimento.alimento.push({
        id: '3',
        name: name,
        caloria: caloria,
        proteina: proteina,
        carboidrato: carboidrato,
        gordura: gordura,
        dataRegistro: new Date()
    })
    res.json(databaseAlimento.alimento[databaseAlimento.alimento.length - 1]);
})

// Retorna o alimento pelo ID
app.get('/food/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    databaseAlimento.alimento.forEach(food => {
        if (food.id === id) {
            found = true;
            return res.json(food);
        }
    })
    if (!found) {
        res.status(400).json('Food not found');
    }
})
// update no alimento passando id e alterando apenas o nome
app.put('/updatefood', (req, res) => {
    const { id } = req.body;
    let found = false;
    databaseAlimento.alimento.forEach(food => {
        if (food.id === id) {
            found = true;
            food.name = req.body.name;
            return res.json('ID: '+food.id+' NAME: '+food.name);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// deletar alimento (dando um erro no cmd de headers)
app.delete('/delfood', (req, res) => {
    databaseAlimento.alimento.forEach(food => {
        if (req.body.id === food.id){
            databaseAlimento.alimento.slice(food);
            return res.json(food.name + ' deleted with Sucess');
        }
    })
    res.status(400).json('User not found!!');

})



//    ========================================== Servidor ==========================================
app.listen(3001, () => {
    console.log('app is running on port 3001');
});