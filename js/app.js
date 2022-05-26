//Importando o JSON e adicionando seus dados a uma variavel "questions"

var request = new XMLHttpRequest()
request.open("GET", "../questoes.json", false);
request.send(null);
const questions = JSON.parse(request.responseText);


//Salvando as chaves de cada pergunta em uma variavel
const questionsList = Object.keys(questions);

//Atribuindo elementos do HTML em variaveis
const textContainer = document.getElementById("textos-container");
const alternativeContainer = document.getElementById("alternativas-container");
const questionNumber = document.getElementById("numero-questao");
const statuss = document.getElementById("status-atividades");
const unansweredCard = document.getElementById("card-sem-resposta"); // Div do Pop Up "Sem resposta"
const wrongAnswerCard = document.getElementById("card-errada"); // Div do Pop Up "Resposta Errada"
const infoWrongAnswer = document.getElementById("info-resposta"); 
const correctAnswerCard = document.getElementById("card-certa"); // Div do Pop Up "Resposta certa"
const instructionsCard = document.getElementById("instrucoes");
const finishedCard = document.getElementById("finalizada");
const spanResult = document.getElementById("resultado");
const spanSkip = document.getElementById("skip"); 

//Declaração de variaveis
let finished = false; //Verifica se o simulado foi finalizado
let questionCorrect = '';
let result = {}; //Objeto que guarda o gabarito, conforme o usuario responde
let count = 0; // Questão atual
let questionInfo = questions[questionsList[count]]; //Guarda as informações da questão atual
let statusItems = "";
let correta = 0; //Quantidade de resposta correta
let skip = 0; //Quantidade de resposta puladas

//Declaração das variaveis usadas para os graficos

var myChartFinal;
var myChart;
var myChart2;

function mudarPergunta(){

    //Caso o contador for igual a 45 ou a variavel que consta se o simulado foi finalizado estiver verdadeiro, significa que o simulado foi finalizado, então a tela de resultados será renderizada
    if(count == 45 || finished == true){
        
        spanResult.innerText = correta + "/45 - Você errou: " + (45 - correta ) + "/45" ;
        spanSkip.innerText = skip;
        finishedCard.className = "";

        //Mapea a variavel com os resultados para contar quantas variaveis foram erradas
        const keys = Object.keys(result);
        let errada = 0;
        keys.map((a)=>{
            if(result[a].acertou == false && result[a].tentativa != "skip"){
                errada +=1;
            }
        })

        //Gera o grafico com as informações obtidas
        const graficoFinal = document.getElementById("grafico-final").getContext('2d');
        const dadosFinal =  {
            type: "bar",
            data: {
                labels: ['Acertos', 'Erros', 'Em branco'],
                datasets: [{
                    label: 'Suas respostas',
                    data: [correta, errada, skip],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                      display: false
                    }
                },
                scales: {
                    x:{
                        title: {
                          display: true,
                          text: "Resposta"
                        }
                      },
    
                    y:{
                        title: {
                          display: true,
                          text: "Quantidade"
                        }
                      }
                  }
            }
        }

        //Verifica se o grafico existe, caso existir ele o atualiza, caso não, ele o cria
        try{
            myChartFinal.data = dadosFinal.data;
            myChartFinal.update();

        }catch{
            myChartFinal = new Chart(graficoFinal, dadosFinal)
        }
        
    }else{
        // Se o simulado não estiver sido finalizado
        questionInfo = questions[questionsList[count]]; //Adiciona as informações do JSON referentes a questão atual na variavel

        //Verifica se está nas primeiras questões, caso esteja ele renderiza os status com as questões de forma diferente
        if(count == 0){
            statusItems = `
                            <div>
                                <div class="status azul">${count+1}</div> <div class="status cinza">${count + 2}</div> <div class="status cinza">${count + 3}</div> <div class="status cinza">${count + 4}</div> <div class="status cinza">${count + 5}</div> <div class="status cinza">${count + 6}</div> <div class="status cinza">${count + 7}</div> 
                            <div>
            `;
        }else
        if(count == 1){
            statusItems = `
                            <div>
                                <div class="status ${result[count-1].acertou ? "verde" : "vermelho"}">${count}</div> <div class="status azul">${count + 1}</div> <div class="status cinza">${count + 2}</div> <div class="status cinza">${count + 3}</div> <div class="status cinza">${count + 4}</div> <div class="status cinza">${count + 5}</div> <div class="status cinza">${count + 6}</div> 
                            <div>
            `;
        }else
        if(count == 2){
            statusItems = `
                            <div>
                                <div class="status ${result[count-2].acertou ? "verde" : "vermelho"}">${count - 1}</div> <div class="status  ${result[count-1].acertou ? "verde" : "vermelho"}">${count}</div> <div class="status azul">${count + 1}</div> <div class="status cinza">${count + 2}</div> <div class="status cinza">${count + 3}</div> <div class="status cinza">${count + 4}</div> <div class="status cinza">${count + 5}</div> 
                            <div>
            `
        }else
        if(count == 3){
            statusItems = `
                            <div>
                                <div class="status ${result[count-3].acertou ? "verde" : "vermelho"}">${count - 2}</div> <div class="status  ${result[count-2].acertou ? "verde" : "vermelho"}">${count - 1}</div> <div class="status  ${result[count-1].acertou ? "verde" : "vermelho"}">${count}</div> <div class="status azul">${count + 1}</div> <div class="status cinza">${count + 2}</div> <div class="status cinza">${count + 3}</div> <div class="status cinza">${count + 4}</div> 
                            <div>
            `;
        }else{
            statusItems = `
                            <div>
                                <div class="status ${result[count-4].acertou ? "verde" : "vermelho"}">${count -3}</div> <div class="status  ${result[count-3].acertou ? "verde" : "vermelho"}">${count - 2}</div> <div class="status  ${result[count-2].acertou ? "verde" : "vermelho"}">${count-1}</div> <div class="status ${result[count-1].acertou ? "verde" : "vermelho"}">${count}</div> <div class="status azul">${count + 1}</div> <div class="status cinza">${count + 2}</div> <div class="status cinza">${count + 3}</div> 
                            <div>
            `;
        }

        
        
        //mapea todas os textos presente na questão e adiciona a variavel "textos" 
        let textos = "";
        if(questionInfo){
            questionInfo.textoAux.map((value, index)=>{
                textos += `
                    <p> ${value.texto}</p>
                `;
            })
        }
        
        //Adiciona os status e o numero da questão na tela
        statuss.innerHTML = statusItems;
        questionNumber.innerText = `Questão ${count+1}`;

        //Adiciona qual a alternativa certa no pop up de "Questão errada"
        infoWrongAnswer.innerHTML = `
                                        <h3> Resposta errada </h3>
                                        <p>A alternativa correta seria: ${questionCorrect} </p>
        `;
        
        //Adiciona na tela todos os textos da variavel "textos" e as imagens das questões
        textContainer.innerHTML = `<div id="texto-content">
                                        
                                        ${textos.substring(2, textos.length)}
                                        ${questionInfo.textoAux[0].imagem? `<img src="${questionInfo.textoAux[0].imagem}" />`: ""}
                                        <div class="fonte">  ${questionInfo.textoAux[0].fonte} </div>
                                    </div>`

        if(questionInfo.textoAux[1]){ //Adiciona os textos e imagens caso tenha mais de um
            textContainer.innerHTML = `<div id="texto-content">                       
                                            
                                            ${questionInfo.textoAux[0].texto? questionInfo.textoAux[0].texto: ""}
                                            ${questionInfo.textoAux[0].imagem? `<img src="${questionInfo.textoAux[0].imagem}" />`: ""}
                                            <div class="fonte">  ${questionInfo.textoAux[0].fonte} </div><br>
                                            ${questionInfo.textoAux[1].texto? questionInfo.textoAux[1].texto: ""}
                                            ${questionInfo.textoAux[1].imagem? `<img src="${questionInfo.textoAux[1].imagem}" />`: ""}
                                            <div class="fonte">  ${questionInfo.textoAux[1].fonte} </div>
                                        
                                            </div>`
        }

        //Adiciona na tela os inputs com cada alternativa
        alternativeContainer.innerHTML = `<div id="alternativas">
                                                <div id="pergunta-container">
                                                    <p> ${questionInfo.pergunta}</p>

                                                </div>
                                                <div id="respostas-container"> 
                                                    <div> <input type="radio" value="A" name="alternativas" id="A"> <label to="A"> A:  ${questionInfo.respostas.A} </label> </div>
                                                    <div> <input type="radio" value="B" name="alternativas" id="B"> <label to="B"> B: ${questionInfo.respostas.B} </label> </div> 
                                                    <div> <input type="radio" value="C" name="alternativas" id="C"> <label to="C"> C: ${questionInfo.respostas.C} </label> </div>
                                                    <div> <input type="radio" value="D" name="alternativas" id="D"> <label to="D"> D: ${questionInfo.respostas.D} </label> </div>
                                                    <div> <input type="radio" value="E" name="alternativas" id="E"> <label to="E"> E: ${questionInfo.respostas.E} </label> </div>
                                                   
                                                </div>
                                                
                                            </div>`;
    }
                                    
}

//Função usada para finalizar o simulado atraves do botão "Finalizar simulado"
function stopSimulate(){
    finished = true; 
    skip += 45 - count; //Adiciona a variavel de questões em branco todas as questões a frente da questão atual 
    finishedCard.className = ""; // Faz a tela e resultado aparecer
    mudarPergunta();
}

//Reseta o formulario, basicamente ela reseta todas as variaveis criadas no inicio do codigo
function resetQuestions(){
    result = {}
    count = 0;
    skip = 0;
    statusItems = "";
    correta = 0;
    myChartFinal.destroy()
    mudarPergunta();
    finished = false;
    finishedCard.className = "invisible";
    mudarPergunta();
}

//Função usada para pular a questão
function skipQuestion(){
    result[count] = {tentativa: "skip", acertou: false} // Adiciona para a variavel com o gabarito que a questão atual foi pulada
    count += 1;
    skip +=1;
    
    mudarPergunta();
}

//Função usada para verificar se a questão está correta ou não e para adicionar adicionar o contador
function addCounter(){
    questionCorrect = questionInfo.respostas.correta; //Atribui a alternativa correta a uma variavel
    const radios = document.getElementsByName("alternativas");
    let notResponse = 0; // Variavel para contar quantas alternativas não estão marcadas, se o total for 5, significa que nenhuma alternativa está marcada
    let correctResponse = false; // Variavel que guarda se acertou ou não

    //Mapea toda a lista com os inputs das alternativas
    for (var i = 0; i < radios.length; i++) {

        //se a alternativa está marcada
        if (radios[i].checked) {

            //se a alternativa estiver correta, adiciona um na variavel correta e consta que acertou na variavel
            if(radios[i].value == questionInfo.respostas.correta){
                correctResponse = true;
                correta +=1;

            }else{
                //Se a alternativa estiver errada, consta que errou
                correctResponse = false;
                
            }

            //Após verificar se acertou ou errou, coloca as informações na variavel com o resultado
            result[count] = {tentativa: radios[i].value, acertou: correctResponse}
        }else{
            //se a alternativa não estiver marcada, adiciona um na variavel que conta as alternativas
            notResponse += 1;
        }
    }

    //Se a variavel que conta as alternativas não marcadas for menor que a quantidade de alternativas, significa que uma alternativa está marcada, então se estiver correto mostrará o Pop up de "Questão correta" e se estiver errado mostrará o de "Questão errada"
    if(notResponse < radios.length){
        
        if(correctResponse){
            rederizeCorrectAnswerCard()
        }else{
            rederizeWrongAnswerCard()
        }
        count += 1;
        mudarPergunta();
    }else{
        //Se a variavel que conta as alternativas não marcadas for igual que a quantidade de alternativas, significa que não tem alternativa marcada, então mostra o pop up de "Questão não respondida"
        rederizeUnansweredCard();
    }
    
}

//Função usada para renderizar o PopUp de "Questão não respondida"
function rederizeUnansweredCard(){
    unansweredCard.className = "visible";
    setTimeout(()=>{
        unansweredCard.className = "";
    }, 1000)
}

//Função usada para renderizar o PopUp de "Questão errada"
function rederizeWrongAnswerCard(){
    wrongAnswerCard.className = "visible";
    setTimeout(()=>{
        wrongAnswerCard.className = "";
    }, 1000)
}

//Função usada para renderizar o PopUp de "Questão correta"
function rederizeCorrectAnswerCard(){
    correctAnswerCard.className = "visible";
    setTimeout(()=>{
        correctAnswerCard.className = "";
    }, 1000)
}

//Função que faz a tela de Instruções sumir
function invisibleCardInstructions(){
    instructionsCard.className = "invisible";
}

//Função usada para criar o gabarito com o jsPDF
function showFeedback(){

    window.jsPDF = window.jspdf.jsPDF;

    //Declaração das colunas e linhas usadas para a criação da tabela do gabarito
    let columns = ["Questão", "Acertou", "Tentativa", "Resposta Correta"];
    let rows = [];
    
    let doc = new jsPDF('p', 'pt');

    //A variavel com o resultado está sendo mapeada para criar uma linha para cada alternativa, com as informações da questão
    const keys = Object.keys(result);
    keys.map((value, index)=>{

        let resultQuestion =  result[value].acertou ? "Sim" : "Não"; // Verifica se a questão foi acertada e atribui a uma variavel
        let tentativa =  result[value].tentativa == "skip" ? "Questão pulada" : result[value].tentativa; // verifica se a questão foi pulada e se for, muda as informações que serão adicionadas na linha
        let correta = questions[questionsList[index]].respostas.correta; //Adiciona a alternativa correta a uma variavel


        rows = [...rows , [index+1, resultQuestion, tentativa, correta]];//Adiciona uma linha para a questão atual na variavel com as linhas, usando as informações obtidas acima

    })
    //Para cada questão não respondida após a finalização do simulado, será adicionado uma linha constando que foi pulada
    for(let cont = 0; cont < 45; cont++ ){
        if(!keys[cont]){
            rows = [...rows , [cont+1, "Não", "Questão pulada", questions[questionsList[cont]].respostas.correta]];

        }
    }
    //Cria uma tabela com as colunas e linhas criadas e salva em um documento chamado "gabarito.pdf";
    doc.autoTable(columns, rows); 
    doc.save('gabarito.pdf');
        
        
}

//Função que mostra a tela de relatorios
function seeReports(){

    const relatorio = document.getElementById("relatorios");

    relatorio.className = " "; //Tira a class 'invisible' da janela

    //Mapea a variavel com os resultados e conta quantas questões estão erradas
    const keys = Object.keys(result);
    let errada = 0;
    keys.map((a)=>{
        if(result[a].acertou == false && result[a].tentativa != "skip"){
            errada +=1;
        }
    })

    //Mapea todas as questões e adiciona uma opção para cada no select
    const perguntaSelect = document.getElementById("pergunta");
    let listOptions = "";
    questionsList.map((key, index)=>{

        const opt = `<option value='${key}'> Questão  ${index + 1} </option>`;

        listOptions += opt;
        perguntaSelect.innerHTML = listOptions;
    })
    
    //Adiciona um evento para que sempre que o select das questões for alterado, ele atualiza as informações do grafico de acordo com a questão
    perguntaSelect.addEventListener('change', (event)=>{
        myChart2.data = {
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [{
                    label: 'Media de respostas',
                    data:  questions[perguntaSelect.value].estatisticas,
                    backgroundColor: [
                        questions[perguntaSelect.value].respostas.correta == "A" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "B" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "C" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "D" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "E" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        questions[perguntaSelect.value].respostas.correta == "A" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "B" ? 'rgba(75, 192, 192,1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "C" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "D" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "E" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                }]
            }

        myChart2.update();
    })

    //Verifica se os graficos já existem, caso não existir ele serão criados, caso exista, eles serão atualizados
    if(!myChart){

            
        const grafico = document.getElementById("grafico-acertos").getContext('2d');
        const dados =  {
            type: "bar",
            data: {
                labels: ['Acertos', 'Erros', 'Em branco'],
                datasets: [{
                    label: 'Suas respostas',
                    data: [correta, errada, skip],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                    display: false
                    }
                },
                scales: {
                    x:{
                        title: {
                        display: true,
                        text: "Resposta"
                        }
                    },

                    y:{
                        title: {
                        display: true,
                        text: "Quantidade"
                        }
                    }
                }
            
            }
            
        }
        const grafico2 = document.getElementById("grafico-media").getContext('2d');
        const dados2 =  {
            type: "bar",
            data: {
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [{
                    label: 'Media de respostas',
                    data:  questions[perguntaSelect.value].estatisticas,
                    backgroundColor: [
                        questions[perguntaSelect.value].respostas.correta == "A" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "B" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "C" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "D" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                        questions[perguntaSelect.value].respostas.correta == "E" ? 'rgba(75, 192, 192, 0.2)':  'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        questions[perguntaSelect.value].respostas.correta == "A" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "B" ? 'rgba(75, 192, 192,1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "C" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "D" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                        questions[perguntaSelect.value].respostas.correta == "E" ? 'rgba(75, 192, 192, 1)':  'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                    display: false
                    }
                },
                scales: {
                    x:{
                        title: {
                        display: true,
                        text: "Alternativas"
                        }
                    },

                    y:{
                        title: {
                        display: true,
                        text: "Quantidade"
                        }
                    }
                }
            }
        }
        myChart = new Chart(grafico, dados);
        myChart2 = new Chart(grafico2, dados2);
    }else{
    myChart.data ={
        labels: ['Acertos', 'Erros', 'Em branco'],
        datasets: [{
            label: 'Suas respostas',
            data: [correta, errada, skip],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    myChart.update();}
}

//Função usada para fechar a tela de relatorios
function closeReports(){
    const relatorio = document.getElementById("relatorios");

    relatorio.className = "invisible";
}
mudarPergunta();