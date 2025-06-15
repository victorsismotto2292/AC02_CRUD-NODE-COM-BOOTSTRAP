const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = 3001;

const tarefasPath = path.join(__dirname, 'tarefas.json');
const tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
const tarefas = JSON.parse(tarefasData);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// FUNÇÕES SALVAR:

function SalvarTarefas(tarefas){
    fs.writeFileSync(tarefasPath, JSON.stringify(tarefas, null, 2));
}

function SalvarDadosTarefa(tarefas){
    fs.writeFileSync(tarefasPath, JSON.stringify(tarefas, null, 2));
}

// FUNÇÃO EXCLUIR

function ExcluirTarefa(tarefas){
    fs.writeFileSync(tarefasPath, JSON.stringify(tarefas, null, 2));
}

// FUNÇÕES BUSCAR

function BuscarTarefasNome(nome){
    const tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    const tarefas = JSON.parse(tarefasData);

    return tarefas.find(tarefa => tarefa.nome.toLowerCase() === nome.toLowerCase());
}

function BuscarTarefasDisciplina(disciplina){
    const tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    const tarefas = JSON.parse(tarefasData);

    return tarefas.filter(tarefa => String(tarefa.disciplina) === String(disciplina)); // PARA TAREFAS QUE POSSUEM MAIS DE UMA DISCIPLINA
}

function BuscarTarefasPrioridade(prioridade){
    const tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    const tarefas = JSON.parse(tarefasData);

    return tarefas.filter(tarefa => String(tarefa.prioridade) === String(prioridade)); // PARA TAREFAS QUE TÊM A MESMA PRIORIDADE
}

// FUNÇÃO TRUNCAR DESCRIÇÃO

function truncarDescricao(descricao, comprimentoMax){
    if(descricao.length > comprimentoMax){
        return descricao.slice(0, comprimentoMax) + '...';
    }
    return descricao;
}

// ROTA PRINCIPAL

app.get('/', (req, res) => {
    let tarefasTable = '';

    let tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    let tarefas = JSON.parse(tarefasData);

    tarefas.forEach(tarefa => {

        const descricaoTruncada = truncarDescricao(tarefa.desc, 100);
        
        tarefasTable += `
        <tr>
            <td><div class="text-wrap" style="width: 15rem;">${tarefa.nome}</div></td>
            <td><p class="fst-italic">${tarefa.disciplina}</p></td>
            <td><p class="text-uppercase fw-bold">${tarefa.prioridade}</p></td>
            <td><p class="font-monospace fw-medium text-decoration-underline fst-italic">${tarefa.data_entrega}</p></td>
            <td><div class="text-nowrap bg-body-secondary border">${descricaoTruncada}</div></td>
            <td><a href="http://localhost:3001/tarefas/atualizar-tarefa" class="btn btn-primary">Editar</a></td>
            <td><a href="http://localhost:3001/tarefas/excluir-tarefa?nome=${tarefa.nome}" class="btn btn-danger">Excluir</a></td>
        </tr>
        `; // TABELA PARA A ESTILIZAÇÃO DO BOOTSTRAP
    });

    const htmlContent = fs.readFileSync('agenda.html', 'utf-8');
    const htmlFinal = htmlContent.replace('{{tarefasTable}}', tarefasTable);

    res.send(htmlFinal);
});

// GET ADICIONAR TAREFA:

app.get('/tarefas/adicionar-tarefa', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionartarefa.html'));
});

// POST ADICIONAR TAREFA:

app.post('/tarefas/adicionar-tarefa', (req, res) => {
    const novaTarefa = req.body;

    const tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    const tarefas = JSON.parse(tarefasData);

    if(tarefas.find(tarefa => tarefa.nome.toLowerCase() === novaTarefa.nome.toLowerCase())){
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Adicionar Tarefa</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">O nome da tarefa solicitada já existe, por favor, tente novamente.</p>
                <hr>
                <a href="http://localhost:3001/tarefas/adicionar-tarefa" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
        `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
        return;
    }
    else{
        tarefas.push(novaTarefa);

        SalvarTarefas(tarefas);

        res.send(`

                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sucesso - Adicionar Tarefa</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="bg-light">
                <div class="container mt-5">
                    <div class="alert alert-success text-center shadow" role="alert">
                    <h4 class="alert-heading">Sucesso!</h4>
                    <p class="fw-semibold">NOVA TAREFA ADICIONADA COM SUCESSO!</p>
                    <hr>
                    <a href="http://localhost:3001/" class="btn btn-outline-success">Voltar</a>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
                </script>
                </body>
                </html>
            
            `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
    }
});

// GET ATUALIZAR TAREFA:

app.get('/tarefas/atualizar-tarefa', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizartarefa.html'));
});

// POST ATUALIZAR TAREFA:

app.post('/tarefas/atualizar-tarefa', (req, res) => {
    const { nome, disciplina, prioridade, data_entrega, desc } = req.body;

    let tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    let tarefas = JSON.parse(tarefasData);

    const tarefasIndex = tarefas.findIndex(tarefa => tarefa.nome.toLowerCase() === nome.toLowerCase());

    if(tarefasIndex == -1){
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Atualizar Tarefa</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">A tarefa solicitada não existe, por favor, tente novamente.</p>
                <hr>
                <a href="http://localhost:3001/tarefas/atualizar-tarefa" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
        `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
        return;                   
    }
    else{
        tarefas[tarefasIndex].nome = nome;
        tarefas[tarefasIndex].disciplina = disciplina;
        tarefas[tarefasIndex].prioridade = prioridade;
        tarefas[tarefasIndex].data_entrega = data_entrega;
        tarefas[tarefasIndex].desc = desc;

        SalvarDadosTarefa(tarefas);

        res.send(`
            
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sucesso - Atualizar Tarefa</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body class="bg-light">
                <div class="container mt-5">
                    <div class="alert alert-success text-center shadow" role="alert">
                    <h4 class="alert-heading">Sucesso!</h4>
                    <p class="fw-semibold">TAREFA ATUALIZADA COM SUCESSO!</p>
                    <hr>
                    <a href="http://localhost:3001/" class="btn btn-outline-success">Voltar</a>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
                </script>
                </body>
                </html>                        
            
            `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
    }
});

// GET EXCLUIR TAREFA (NÃO PRECISA DO POST)

app.get('/tarefas/excluir-tarefa', (req, res) => {
    const tarefaBuscada = req.query.nome;

    let tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    let tarefas = JSON.parse(tarefasData);

    const tarefasIndex = tarefas.findIndex(tarefa => tarefa.nome.toLowerCase() === tarefaBuscada.toLowerCase());

    if(tarefasIndex == -1){ // CASO DÊ ERRO BOTÃO DE EXCLUIR NÃO CONSEGUIR ASSOCIAR O NOME DA TAREFA
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Excluir Tarefa</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Tarefa solicitada não encontrada, por favor, tente novamente.</p>
                <hr>
                <a href="http://localhost:3001/" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
        `);
        return;
    }
    else{
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmação - Excluir Tarefa</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-warning text-center shadow" role="alert">
                <h4 class="alert-heading">Atenção!</h4>
                <p class="fw-semibold">Tem certeza de que quer excluir a tarefa <strong>${tarefaBuscada}</strong>?</p>
                <hr>
                <div class="d-grid gap-2 d-md-block">
                    <a class="btn btn-success" href="http://localhost:3001/tarefas/excluir-tarefa-confirmado?nome=${tarefaBuscada}">Sim</a>
                    <a href="http://localhost:3001/" class="btn btn-danger">Não</a>
                </div>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>
            
        `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
    }
});

// GET EXCLUIR TAREFA -> CONFIRMADO

app.get('/tarefas/excluir-tarefa-confirmado', (req, res) => {
    const tarefaBuscada = req.query.nome;

    let tarefasData = fs.readFileSync(tarefasPath, 'utf-8');
    let tarefas = JSON.parse(tarefasData);

    const tarefasIndex = tarefas.findIndex(tarefa => tarefa.nome.toLowerCase() === tarefaBuscada.toLowerCase());

    tarefas.splice(tarefasIndex, 1);
    ExcluirTarefa(tarefas);

    res.send(`

        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sucesso - Excluir Tarefa</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
        <div class="container mt-5">
            <div class="alert alert-success text-center shadow" role="alert">
            <h4 class="alert-heading">Sucesso!</h4>
            <p class="fw-semibold fs-3">TAREFA <p class="text-decoration-underline fw-bold fs-2">"${tarefaBuscada}"</p> <p class="fw-semibold fs-3">REMOVIDA COM SUCESSO!</p></p>
            <hr>
            <a href="http://localhost:3001/" class="btn btn-outline-success">Voltar</a>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
        </script>
        </body>
        </html> 
        
    `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
});

// GET BUSCAR -> NOME (NÃO PRECISA DO POST):

app.get('/tarefas/buscar-tarefa-nome', (req, res) => {
    const tarefaBuscada = req.query.nome;
    const tarefaEncontrada = BuscarTarefasNome(tarefaBuscada);

    if (tarefaEncontrada) {
        let TarefaCardResultado = '';
        const descricaoTruncada = truncarDescricao(tarefaEncontrada.desc, 100);

        TarefaCardResultado += `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">${tarefaEncontrada.nome}</h5>
                </div>
                <div class="card-body">
                    <p class="card-text"><strong>Disciplina:</strong> <span class="fst-italic">${tarefaEncontrada.disciplina}</span></p>
                    <p class="card-text"><strong>Prioridade:</strong> <span class="text-uppercase fw-bold">${tarefaEncontrada.prioridade}</span></p>
                    <p class="card-text"><strong>Data de Entrega:</strong> <span class="font-monospace fw-medium text-decoration-underline fst-italic">
                    ${tarefaEncontrada.data_entrega}</span></p>
                    <p class="card-text"><strong>Descrição:</strong> <div class="bg-body-secondary border p-2 rounded">${descricaoTruncada}</div></p>
                </div>
                <div class="card-footer text-center">
                    <a href="http://localhost:3001/" class="btn btn-primary">Voltar</a>
                </div>
            </div>
        `;

        let htmlContent = fs.readFileSync('buscartarefanome.html', 'utf-8');
        let htmlFinal = htmlContent.replace('{{TarefaCardResultado}}', TarefaCardResultado);

        res.send(htmlFinal);
    } 
    else {
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Buscar Tarefa Nome</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Tarefa solicitada não encontrada, por favor, tente novamente.</p>
                <hr>
                <a href="http://localhost:3001/" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>

        `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
        return;
    }
});

// GET BUSCAR DISCIPLINA (NÃO PRECISA DO POST)

app.get('/tarefas/buscar-tarefa-disciplina', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscartarefadisciplina.html'));
});

// GET BUSCAR DISCIPLINA RESULTADO

app.get('/tarefas/buscar-tarefa-disciplina-resultado', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscartarefadisciplinaresultado.html'));
});

// POST BUSCAR DISCIPLINA RESULTADO

app.post('/tarefas/buscar-tarefa-disciplina-resultado', (req, res) => {
    const tarefaBuscada = req.body.disciplina;
    const tarefaEncontrada = BuscarTarefasDisciplina(tarefaBuscada);

    if(tarefaEncontrada.length > 0){
        let TarefaCardResultado = '';

        tarefaEncontrada.forEach(tarefa => {
            const descricaoTruncada = truncarDescricao(tarefa.desc, 100);

            TarefaCardResultado += `
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">${tarefa.nome}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Disciplina:</strong> <span class="fst-italic">${tarefa.disciplina}</span></p>
                        <p class="card-text"><strong>Prioridade:</strong> <span class="text-uppercase fw-bold">${tarefa.prioridade}</span></p>
                        <p class="card-text"><strong>Data de Entrega:</strong> <span class="font-monospace fw-medium text-decoration-underline fst-italic">
                        ${tarefa.data_entrega}</span></p>
                        <p class="card-text"><strong>Descrição:</strong> <div class="bg-body-secondary border p-2 rounded">${descricaoTruncada}</div></p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="http://localhost:3001/" class="btn btn-primary">Voltar</a>
                    </div>
                </div>
            `;
        });
        let htmlContent = fs.readFileSync('buscartarefadisciplinaresultado.html', 'utf-8');
        let htmlFinal = htmlContent.replace('{{TarefaCardResultado}}', TarefaCardResultado);

        res.send(htmlFinal);
    }
    else{
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Buscar Tarefa Disciplina</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Disciplina solicitada não encontrada, por favor, tente novamente.</p>
                <hr>
                <a href="http://localhost:3001/" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>

        `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
        return;
    }
});

// GET BUSCAR PRIORIDADE (NÃO PRECISA DO POST)

app.get('/tarefas/buscar-tarefa-prioridade', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscartarefaprioridade.html'));
});

// GET BUSCAR PRIORIDADE RESULTADO

app.get('/tarefas/buscar-tarefa-prioridade-resultado', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscartarefaprioridaderesultado.html'));
});

// POST BUSCAR PRIORIDADE RESULTADO

app.post('/tarefas/buscar-tarefa-prioridade-resultado', (req, res) => {
    const tarefaBuscada = req.body.prioridade;
    const tarefaEncontrada = BuscarTarefasPrioridade(tarefaBuscada);

    if(tarefaEncontrada.length > 0){
        let TarefaCardResultado = '';

        tarefaEncontrada.forEach(tarefa => {
            const descricaoTruncada = truncarDescricao(tarefa.desc, 100);

            TarefaCardResultado += `
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">${tarefa.nome}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Disciplina:</strong> <span class="fst-italic">${tarefa.disciplina}</span></p>
                        <p class="card-text"><strong>Prioridade:</strong> <span class="text-uppercase fw-bold">${tarefa.prioridade}</span></p>
                        <p class="card-text"><strong>Data de Entrega:</strong> <span class="font-monospace fw-medium text-decoration-underline fst-italic">
                        ${tarefa.data_entrega}</span></p>
                        <p class="card-text"><strong>Descrição:</strong> <div class="bg-body-secondary border p-2 rounded">${descricaoTruncada}</div></p>
                    </div>
                    <div class="card-footer text-center">
                        <a href="http://localhost:3001/" class="btn btn-primary">Voltar</a>
                    </div>
                </div>
            `;
        });
        let htmlContent = fs.readFileSync('buscartarefaprioridaderesultado.html', 'utf-8');
        let htmlFinal = htmlContent.replace('{{TarefaCardResultado}}', TarefaCardResultado);

        res.send(htmlFinal);
    }
    else{
        res.send(`

            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Buscar Tarefa Prioridade</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
            <div class="container mt-5">
                <div class="alert alert-danger text-center shadow" role="alert">
                <h4 class="alert-heading">Erro!</h4>
                <p class="fw-semibold">Prioridade solicitada não encontrada, por favor, tente novamente.</p>
                <hr>
                <a href="http://localhost:3001/" class="btn btn-outline-danger">Voltar</a>
                </div>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous">
            </script>
            </html>

        `); // PÁGINA HTML PARA A ESTILIZAÇÃO DO BOOTSTRAP
        return;
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});