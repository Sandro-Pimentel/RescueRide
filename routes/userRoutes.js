const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/registro', async (req, res) => {
    const { nome, email, senha, telefone, modelo, placa } = req.body;

    try {
        const [result] = await db.execute(
            'INSERT INTO usuarios(nome, email, senha, telefone, modelo, placa) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, email, senha, telefone, modelo, placa]
        );
        res.status(201).json({message: 'Usuário cadastrado com sucesso!'});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
})

router.post('/login', async (req, res) => {
    const {email, senha} = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        if(rows.length > 0) {
            res.status(200).json({message: 'Login realizado com sucesso!'})
        } else {
            res.status(401).json({message: 'Credenciais inválidas!'})
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
});

router.get('/get', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios'
        )

        if(rows.length > 0) {
            res.status(200).json(rows)
        } else {
            res.status(401).json({message: 'Credenciais inválidas!'})
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
})

router.get('/getone', async (req, res) => {
    const { email } = req.query;
    try {
        const [rows] = await db.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if(rows.length > 0) {
            res.status(200).json(rows[0])
        } else {
            res.status(404).json({message: 'Usuário não encontrado!'})
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
})

router.get('/getbyid', async (req, res) => {
    const { id } = req.query;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );

        if(rows.length > 0) {
            res.status(200).json(rows[0])
        } else {
            res.status(404).json({message: 'Usuário não encontrado!'})
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {nome, email, telefone, modelo, placa} = req.body

    try {
        const [rows] = await db.execute(
            'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, modelo = ?, placa = ? WHERE id = ?',
            [nome, email, telefone, modelo, placa, id]
        );

        if(rows.affectedRows > 0) {
            res.status(200).json({message: 'Usuário atualizado com sucesso!'})
        } else {
            res.status(404).json({message: 'Usuário não encontrado'})
        }
    } catch(e) {
        res.status(500).json({error: e.message})
    }
})



module.exports = router;