const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

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
    database.users.forEach(user => {
        if (req.body.email === user.email &&
            req.body.password === user.password) {
            return res.json(user.name + ' You are Login with Sucess');
        }
    })
    res.status(400).json('User not found!!');

})

// Muda senha do usuario
app.put('/changepasswd', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.password = req.body.password;
            return res.json('Hey '+user.name+' you has a NEWPASS: '+user.password);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// Retorna o usuario pelo ID
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

// registra um novo usuario com o id 125 e dados recebidos
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        height: '',
        weight: '',
        goal: '',
        imc: '',
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
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
app.listen(3000, () => {
    console.log('app is running on port 3000');
});