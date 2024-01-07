# Requisitos Funcionais

O que o usuário pode e não pode fazer no app

- [x] O usuário deve poder criar uma nova transação;
- [x] O usuário deve poder obter um resumo da sua conta;
- [x] O usuário deve pdoer listar todas as transações que já ocorreram;
- [x] O usuário deve poder visualizar uma transação única.

# Regras de Negócios

Condicionais -> Coisas que podem acontecer e a aplicação vai validar

- [x] A transação pode ser do tipo crédito que somará ao valor total;
- [x] A transação pode ser do tipo débito que subtrará do valor total;
- [x] Deve ser possível identificar o usuário entre as requisições;
- [x] O usuário só pode visualizar transações o qual ele criou;

# Requisitos Não Funcionais

Tecnologias e estrategias que o app usa

- Typescript
- Fastify
- Knex
- sqlite3
- zod
- .env
