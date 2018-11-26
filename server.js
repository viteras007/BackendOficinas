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
    .where('Id', id)
    .update({password: req.body.password})
    .returning('*')
    .then(user => {
        res.json("ALTERADO COM SUCESSO")/*
        if(user.length){
            res.json(user)
        }
        else{
            res.status(400).json('change password fail!')
        }*/
    })
    .catch(err => res.status(400).json('error!'));
})
//Altera todos dados do usuario
app.put('/alterauser', (req, res) => {
    const { id, height, weight, goal, idade} = req.body;
    const imc = weight / ((height/100) * (height/100)); //ALTURA EM METROS , SE USAR EM CM  TEM Q MUDAR
    db('users')
    .where('id', id)
    .update({        
        height: height,
        weight: weight,
        imc: imc,
        idade: idade,
        goal: goal   
    })
    .returning('*')
    .then(user => {
        res.json(user);
    })
    .catch(err => res.status(400).json('error!'));
})
/*//Alterar meta do usuario
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
})*/



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
    const { email, name, password, sexo, weight, height, idade} = req.body;
    const imc = weight / ((height/100) * (height/100));
    db('users')
    .returning('*')
    .insert({
        name: name,
        email: email,
        password: password, 
        sexo: sexo,
        weight: weight,
        height: height,
        imc: imc,
        idade: idade,
        joined: new Date()
    })       
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'))

})

//busca pelo email
app.post('/buscaemail', (req, res) => {   
    const { email} = req.body;
    db.where({
        email: email
    }).select()
    .from('users')
    .then(user => {        
        res.json(user[0]);       
    })
    .catch(err => res.status(400).json('error!!'));
})

//    ========================================== ALIMENTO ==========================================

//busca alimento pelo id
app.post('/buscafood', (req, res) => {   
    const { id } = req.body;
    db.where({
        id: id
    }).select()
    .from('food')
    .then(food => {        
        res.json(food[0]);       
    })
    .catch(err => res.status(400).json('error!!'));
})


// Inserir alimento
app.post('/insertfood', (req, res) => {    
    const { caloria, name, proteina, carboidrato, gordura, imglink } = req.body;
    db('food')
    .returning('*')
    .insert({
        name: name,
        caloria: caloria,
        proteina: proteina, 
        carboidrato: carboidrato, 
        gordura: gordura,     
        dataregistro: new Date(),
        imglink: imglink
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

// ============================================== DIETA =============================
app.post('/criardieta', (req, res) => {    
    const { caloria, idusuario, proteina, carboidrato, gordura } = req.body;
    db('dieta')
    .returning('*')
    .insert({        
        caloria: caloria,
        proteina: proteina, 
        carboidrato: carboidrato, 
        gordura: gordura,     
        idusuario: idusuario        
    })       
        .then(dieta => {
            res.json(dieta[0]);
        })
        .catch(err => res.status(400).json('unable to create!'))
})

app.post('/progresso', (req, res) => {    
    const { idusuario, peso } = req.body;
    db('progresso')
    .returning('*')
    .insert({        
        peso: peso,     
        idusuario: idusuario,
        data: new Date()        
    })       
        .then(progresso => {
            res.json(progresso[0]);
        })
        .catch(err => res.status(400).json('unable to create!'))
})

app.post('/caloriatotal', (req, res) => {   
    const { idusuario } = req.body;
    db.where({
        idusuario: idusuario        
    }).select('*')
    .from('dieta')
    .then(dieta => {        
        res.json(dieta[0].caloria);        
    })
    .catch(err => res.status(400).json('error!!'));
})

app.post('/dietamacros', (req, res) => {   
    const { idusuario } = req.body;
    db.where({
        idusuario: idusuario        
    }).select('*')
    .from('dieta')
    .then(dieta => {        
        res.json(dieta[0]);        
    })
    .catch(err => res.status(400).json('error!!'));
})

app.post('/progressouser', (req, res) => {   
    const { idusuario } = req.body;
    db.where({
        idusuario: idusuario        
    }).select('*')
    .from('progresso')
    .then(progresso => {        
        res.json(progresso);        
    })
    .catch(err => res.status(400).json('error!!'));
})


//    ========================================== Servidor ==========================================
app.listen(3001, () => {
    console.log('app is running on port 3001');
});