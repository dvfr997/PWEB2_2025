var express = require('express');
var router = express.Router();
const {body, validationResult } = require('express-validator');

/**
 * GET /contato - exibe o formulário.
 * Enviamos 'data' vazio e 'erros' vazio para facilitar o template.
 */

router.get('/', (req, res ) => {
    res.render('cadastro', {
      title: 'Formulário de Cadastro de usuário',
      data: {},
      errors: {}
    });
});

/**
 * POST /contato - valida, sanitiza e decide: erro -> reexibir formulário;
 sucesso -> página de sucesso
 */

 router.post('/', 
    // Validações e sanitizações
    [
        body('nome')
          .trim().isLength({ min: 3, max: 60}).withMessage('Nome deve ter entre 3 e 60 caracteres.')
          .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome contém caracteres inválidas.')
          .escape(),
        body('email')
          .trim().isEmail().withMessage('E-mail inválido.')
          .normalizeEmail(),
        body('data_nascimento')
          .isISO8601().withMessage('Data inválida.')
          .custom((value) => new Date(value) <= new Date())
          .withMessage('A data de nascimento não pode ser no futuro.'),
        body('genero')
          .isIn(['masculino', 'feminino', 'outro']).withMessage('Selecione um gênero válido.'),
        body('telefone')
          .matches(/^\d{10,11}$/).withMessage('Telefone deve conter apenas números e ter 10 ou 11 dígitos.'),
        body('senha')
          .isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres.')
          .matches(/[A-Za-z]/).withMessage('A senha deve conter no mínimo uma letra.')
          .matches(/\d/).withMessage('A senha deve conter no mínimo um número.'),
        body('confirmacao_senha')
          .custom((value, { req }) => value === req.body.senha)
          .withMessage('As senhas não coincidem.'),
        body('aceite')
          .equals('on').withMessage('Você deve aceitar os termos para continuar.')
    ],

    (req, res) => {
        const errors = validationResult(req);

        // Para repovoar o formulário, mantemos os dados originais(com algumas sanitizações acima)

        const data = {
            nome: req.body.nome,
            email: req.body.email,
            data_nascimento: req.body.data_nascimento,
            genero: req.body.genero,
            telefone: req.body.telefone,
            senha: req.body.senha,
            confirmacao_senha: req.body.confirmacao_senha,
            aceite: req.body.aceite === 'on'


        };

        if(!errors.isEmpty()) {
            // Mapeamos erros por campo para facilitar no EJS

            const mapped = errors.mapped(); //  { campo: { msg, param,...} }

            return res.status(400).render('cadastro', {
                title: 'Formulário',
                data,
                errors: mapped
            });
        }

        // Aqui você poderia persistir no banco, enviar e-mail, etc.
       

        return res.render('validacaoCadastro', {
            title: 'Enviado com sucesso',
            data
        });
    }
 );

 module.exports = router;