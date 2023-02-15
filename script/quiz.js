// SELECIONANDO AS JANELAS
const start_btn = document.querySelector('.start_btn')
const info_box = document.querySelector('.info_box')
const quiz_box = document.querySelector('.quiz_box')
const result_box = document.querySelector('.result_box')

// SELECIONANDO OS BOTÕES
const quit_btn = document.querySelector('.btn_sair_info')
const btn_sair_result = document.querySelector('.btn_sair_result')
const restart_btn = document.querySelector('.restart')
const continue_btn = document.querySelector('.continue')
const next_btn = document.querySelector('footer button.next_btn')
const btn_som = document.querySelector('#btn_som')

// SELECIONANDO O ELEMENTO QUE CONTERÁ AS OPÇÕES
const option_list = document.querySelector('.option_list')

// SELECIONANDO OS ELEMENTOS DO RELÓGIO E A BARRA DE PROGRESSO
const timeText = document.querySelector('.timer .time_left_txt')
const timeCount = document.querySelector('.timer .timer_sec')
const time_line = document.querySelector('header .time_line')

// SELECIONANDO OS EFEITOS SONOROS
let musica = document.querySelector('#musicaDeFundo')
let gameShowOpen = document.querySelector('#gameShowOpen')
let respostaErrada = document.querySelector('#respostaErrada')
let respostaCorreta = document.querySelector('#respostaCorreta')
let resultado = document.querySelector('#resultado')

// VARIÁVEIS
let contadorQuestao = 0  // Serve como contador para saber se já chegou na última questão.
let contadorPaginacao = 1  // Serve como contador da paginação. Começando pela questão número 1.
let contadorTempo  // Contador do tempo
let duracaoTempo = 15  // Duração do tempo do relógio
let contadorBarraProgresso  // Contador da barra de progresso
let larguraDaBarra = 0  // Serve para alterar a largura da barra de progresso
let pontuacao = 0  // Serve para contagem dos pontos

/* ABRIR O info_box:
1) Clicar no botão start_btn  
2) Abrir o info_box
3) Adicionar a classe .activeInfo em info_box
4) Fechar o botão start_btn
5) Adicionar estilo de opacidade no javascript
*/
start_btn.classList.add('activeStart')  // Iniciando a página com o botão start ativo
start_btn.onclick = () => {
    start_btn.classList.remove('activeStart')
    info_box.classList.add('activeInfo')
    tocarGameShowOpen()
}

/* FECHAR O info_box e result_box:
1) Atualiza a página
*/
quit_btn.onclick = () => {
    window.location.reload();
}
btn_sair_result.onclick = () => {
    window.location.reload();
}

/* ABRIR O quiz_box
1) Clicar no botão continue
2) Fechar o info_box
3) Remover a classe .activeInfo
4) Abrir o quiz_box
5) Adiciona a classe .activeQuiz
6) Mostrar a paginação
7) Começar a contagem do tempo
8) Carregar a barra de progresso
*/
continue_btn.onclick = () => {
    info_box.classList.remove('activeInfo')
    quiz_box.classList.add('activeQuiz')
    mostrarQuestao(0)
    paginacao(1)
    startTimer(15)
    startTimerLine(0)
    gameShowOpen.muted = true
}

/*
VERIFICAR SE AINDA NÃO CHEGOU NA ÚLTIMA QUESTÃO
ALTERAR O TEXTO DO TEMPO PARA TIME LEFT
PULAR PARA A PRÓXIMA QUESTÃO
REMOVER O BOTÃO PRÓXIMO
MOSTRAR A PAGINAÇÃO
PARAR O TEMPO DO RELÓGIO E A BARRA
RECOMEÇAR O TEMPO DO RELÓGIO E A BARRA
CASO JÁ TENHA CHEGADO NA ÚLTIMA QUESTÃO
PARAR A CONTAGEM DO RELÓGIO E DA BARRA
FECHAR A JANELA DO QUIZ E ABRIR A JANELA DO RESULTADO
*/
next_btn.onclick = () => {

    // Verificar se ainda não chegou na última questão
    if (contadorQuestao < questions.length - 1) {

        // Alterando o texto para Time Left
        timeText.textContent = 'Tempo restante'

        // Incrementar o contador para mudar de questão 
        contadorQuestao++

        // Pular para próxima questão
        mostrarQuestao(contadorQuestao)

        // remover o botão next_btn
        next_btn.classList.remove('show')

        // Incrementar o contador para mudar a paginação
        contadorPaginacao++

        // Mostrar a paginação 
        paginacao(contadorPaginacao)

        // Parar o tempo do relógio e a barra de progresso
        clearInterval(contadorTempo)
        clearInterval(contadorBarraProgresso)

        // Reiniciar o tempo do relógio e a barra de progresso
        startTimer(duracaoTempo)
        startTimerLine(larguraDaBarra)
    }
    // Se chegou na última questão
    else {
        // Tocar resultado
        tocarResultado()
        
        // Pausar música de fundo do quiz
        musica.muted = true

        // Parar a contagem do relógio e a barra de progresso
        clearInterval(contadorTempo)
        clearInterval(contadorBarraProgresso)

        // Fechar a janela do quiz e abrir a janela do resultado
        showResult()
    }
}

/*
BOTÃO RECOMEÇAR O QUIZ
FECHA RESULT_BOX
ABRE QUIZ
*/
restart_btn.onclick = () => {

    // Fechar result_box
    result_box.classList.remove('activeResult')

    // Abrir quiz
    quiz_box.classList.add('activeQuiz')

    // Redefinindo os valores das variáveis do início porque o quiz precisa ser reiniciado
    duracaoTempo = 15
    contadorQuestao = 0
    contadorPaginacao = 1
    pontuacao = 0
    larguraDaBarra = 0

    mostrarQuestao(contadorQuestao)  // Mostra as questões
    paginacao(contadorPaginacao)  // Mostra a paginação
    clearInterval(contadorTempo)  // Limpar o contador do tempo
    clearInterval(contadorBarraProgresso)  // Limpar o contador da barra
    startTimer(duracaoTempo)  // Recomeçar a contagem regressiva
    startTimerLine(larguraDaBarra)  // Recomeçar a largura da barra
    timeText.textContent = 'Tempo restante'  // Recomeçar o texto padrão do relógio
    next_btn.classList.remove('show')  // Remove o botão next_btn
}

/* 
MOSTRAR O NÚMERO DA QUESTÃO
MOSTRAR A QUESTÃO
MOSTRAR AS ALTERNATIVAS
Adicionando as tags dinamicamente no HTML via Javascript
*/
function mostrarQuestao(indice) {

    // Pegando os textos do número e da pergunta do objeto listaDePerguntas e adicionando em uma tag <span> na classe .que_text
    let questao = document.querySelector('.que_text')
    questao.innerHTML = '<span>' + questions[indice].numb + '. ' + questions[indice].question + '</span>'

    // Atribuir a variavel das tags na variavel pai
    option_list.innerHTML = '<div class="option" onclick="optionSelected(this)"><span>' + questions[indice].options[0] + '</span></div>'
        + '<div class="option" onclick="optionSelected(this)"><span>' + questions[indice].options[1] + '</span></div>'
        + '<div class="option" onclick="optionSelected(this)"><span>' + questions[indice].options[2] + '</span></div>'
        + '<div class="option" onclick="optionSelected(this)"><span>' + questions[indice].options[3] + '</span></div>'
}

/*
PARAR O TEMPO E A BARRA QUANDO UMA OPÇÃO FOR CLICADA
PEGAR A OPÇÃO QUE FOI CLICADA
VERIFICAR SE A OPÇÃO ESTÁ CORRETA
ADICIONAR CLASSE DE ESTILO PARA A OPÇÃO CORRETA E INCORRETA
BLOQUEAR O CLIQUE APÓS SELECIONAR UMA OPÇÃO
INSERIR OS ÍCONES NAS OPÇÕES CORRETA E ERRADA
MOSTRAR O ÍCONE DA OPÇÃO CORRETA AUTOMATICAMENTE
MOSTRAR O BOTÃO PRÓXIMO QUANDO CLICAR NUMA OPÇÃO
*/
function optionSelected(opcaoSelecionada) {

    // Alterando o texto para Time Left
    timeText.textContent = 'Tempo parado'

    // Parar o tempo e a barra de progresso quando clicar numa opção
    clearInterval(contadorTempo)
    clearInterval(contadorBarraProgresso)

    let correcAns = questions[contadorQuestao].answer //obtendo a resposta correta do array
    const allOptions = option_list.children.length //obtendo todos os itens de opção

    next_btn.classList.add('show')

    // Criando icone para opção correta
    let iconTagOpcaoCorreta = '<div class="icon tick"><i class="fas fa-check"></i></div>'

    // Desabilitar todas as opções após o clique
    let opcoes = document.querySelectorAll('.option')
    for (let opcao of opcoes) {
        opcao.classList.add('disabled')
    }

    // Comparando o texto da opção clicada, com o texto da resposta correta da listaDeOpcoes
    if (opcaoSelecionada.textContent == questions[contadorQuestao].answer) {

        // Tocar resposta correta
        tocarRespostaCorreta()

        // Incrementando a pontuação
        pontuacao++

        // Acicionando a classe do estilo na opção correta
        opcaoSelecionada.classList.add('correct')

        // Adicionando a tag HTML do ícone na opção correta
        opcaoSelecionada.insertAdjacentHTML("beforeend", iconTagOpcaoCorreta)
    }
    else {
        // Tocar som de resposta errada
        tocarRespostaErrada()

        // Adicionando a classe de estilo na opção errada
        opcaoSelecionada.classList.add('incorrect')

        // Criando icone para opção errada
        let iconTagOpcaoErrada = '<div class="icon cross"><i class="fas fa-times"></i></div>'

        // Adicionando a tag HTML do ícone na opção errada
        opcaoSelecionada.insertAdjacentHTML("beforeend", iconTagOpcaoErrada)

        // Percorreno todas as opções. Adicionando automaticamente a tag HTML do ícone na opção correta
        for (let i = 0; i < allOptions; i++) {

            // Verificando se algum texto das opções é igual a resposta certa
            if (option_list.children[i].textContent == correcAns) {

                // Pegando cada filho de option_list e setando as classes .option .correct
                option_list.children[i].setAttribute('class', 'option correct')

                // Pegando cada filho de option_list e inserindo o ícone após o elemento filho de .option (que é um <SPAN>)
                option_list.children[i].insertAdjacentHTML("beforeend", iconTagOpcaoCorreta)
            }
        }
    }
}

/*
SELECIONAR O ELEMENTO 
O ELEMENTO SELECIONADO RECEBERÁ A VARIÁVEL COM AS TAGS HTML
A função será usada no: botão próximo, botão recomeçar, botão continuar
*/
function paginacao(numeroDaQuestao) {

    // Criar uma variável para pegar a paginação
    const total_que = document.querySelector("footer .total_que");

    // Criar as tags
    total_que.innerHTML = '<span><p>' + numeroDaQuestao + '</p> de <p>' + questions.length + '</p> Questões</span>'
}

/*
CONTAGEM REGRESSIVA DE SEGUNDOS
CRIAR UM INTERVALO DE TEMPO DE 1 SEGUNDO
CRIAR UMA VARIÁVEL PARA ARMAZENAR OS SEGUNDOS QUE SERÃO PASSADOS NO PARÂMETRO
DECREMENTAR A VARIÁVEL DO TEMPO PARA CONTAGEM REGRESSIVA
QUANDO O TEMPO ATINGIR O NÚMERO 9, ADICIONAR UM ZERO NA FRENTE DO NÚMERO NA CONTAGEM REGRESSIVA DO 09 ATÉ O 00
QUANDO O TEMPO CHEGAR NO ZERO, LIMPAR O CONTADOR DE TEMPO
TROCAR O TEXTO DO RELÓGIO PARA 'FIM DO TEMPO'
ADICIONAR OS ÍCONES NAS RESPOSTAS CORRETA QUANDO O TEMPO CHEGAR EM ZERO
BLOQUEAR O CLIQUE DAS OPÇÕES
MOSTRAR O BOTÃO PRÓXIMO
*/
function startTimer(time) {

    // Criando um intervalo de 1 segundo
    contadorTempo = setInterval(timer, 1000)

    // Criando a função callback do setInterval
    function timer() {

        // Tocar música de fundo
        tocarMusicaDeFundo()

        // Atribuindo o tempo do parâmetro na variável do relógio
        timeCount.textContent = time

        // Decrementando o valor do parâmetro
        time--

        // Quando o tempo chegar em 9 segundos
        if (time < 9) {

            // Criando uma variável para receber o texto do tempo do relógio
            let zero = timeCount.textContent

            // Adicionando um zero na frente do texto do tempo do relógio
            timeCount.textContent = '0' + zero
        }

        // Quando o tempo chegar em 0 segundos
        if (time < 0) {

            // Limpar o tempo do contador. Parar o tempo no zero
            clearInterval(contadorTempo)

            // Alterando o texto para Fim do Tempo
            timeText.textContent = 'Fim do tempo'

            // Mostra os ícones das opções correta e errada

            let correcAns = questions[contadorQuestao].answer //obtendo a resposta correta do array
            const allOptions = option_list.children.length //obtendo todos os itens de opção

            // Criando icone para opção correta
            let iconTagOpcaoCorreta = '<div class="icon tick"><i class="fas fa-check"></i></div>'

            // Percorreno todas as opções
            for (let i = 0; i < allOptions; i++) {

                // Verificando se algum texto das opções é igual a resposta certa
                if (option_list.children[i].textContent == correcAns) {

                    // Pegando cada filho de option_list e setando as classes .option .correct
                    option_list.children[i].setAttribute('class', 'option correct')

                    // Pegando cada filho de option_list e inserindo o ícone após o elemento filho de .option (que é um <SPAN>)
                    option_list.children[i].insertAdjacentHTML("beforeend", iconTagOpcaoCorreta)
                }

                // Desabilitar todas as opções após o clique
                option_list.children[i].classList.add("disabled")
            }

            // Mostrar o botão próximo
            next_btn.classList.add('show')
        }
    }
}

/*
BARRA DE PROGRESSO
CRIAR UM INTERVALO DE TEMPO
INCREMENTAR O TEMPO DO PARÂMETRO
ALTERAR A LARGURA DA BARRA DE ACORDO COM O PARÂMETRO
*/
function startTimerLine(time) {

    // Criar um intervalo de tempo que sincronize com o término da contagem do relógio (neste caso 29)
    contadorBarraProgresso = setInterval(function () {

        // Incrementar o parâmetro para manter o crescimento da barra
        time++

        // Adicionar um estilo na largura da barra conforme o valor do parâmetro
        time_line.style.width = time + 'px'

        // Se a largura da barra atingir a mesma largura do conteiner, então para a contagem da barra
        if (time == 549) {
            clearInterval(contadorBarraProgresso)
        }
    }, 29)
}

/*
RESULTADO DO QUIZ

*/
function showResult() {

    // Fechar a janela do quiz
    quiz_box.classList.remove('activeQuiz')

    // remover o botão next_btn porque, caso contrário o botão permance porém invisível e pode ser clicado.
    next_btn.classList.remove('show')

    // Abrir a janela resultado
    result_box.classList.add('activeResult')

    // Seleconar a pontuação
    const scoreText = result_box.querySelector('.score_text')

    // Verificar se a pontuação é maior que 3
    if (pontuacao == 5) {
        let scoreTag = '<span>Parabéns! 🎉 Você acertou <p>' + pontuacao + '</p> de <p>' + questions.length + '</p></span>'
        scoreText.innerHTML = scoreTag
    }
    else if (pontuacao > 1) {
        let scoreTag = '<span>Legal! 😎 Você acertou <p>' + pontuacao + '</p> de <p>' + questions.length + '</p></span>'
        scoreText.innerHTML = scoreTag
    }
    else {
        let scoreTag = '<span>Desculpe! 😐 Sua pontuação foi <p>' + pontuacao + '</p> de <p>' + questions.length + '</p></span>'
        scoreText.innerHTML = scoreTag
    }
}

function tocarResultado() {
    resultado.play()
}

function tocarRespostaCorreta() {
    respostaCorreta.play()
}

function tocarRespostaErrada() {
    respostaErrada.play()
}

function tocarGameShowOpen() {
    gameShowOpen.play()
}

function tocarMusicaDeFundo() {
    musica.play()
}

function ativarDesativarMusica() {
    if (musica.muted || gameShowOpen.muted) {
        musica.muted = false
        gameShowOpen.muted = false
        btn_som.innerHTML = '<i class="fa-solid fa-pause"></i>'
    } else {
        musica.muted = true
        gameShowOpen.muted = true
        btn_som.innerHTML = '<i class="fa-solid fa-play"></i>'
    }
}