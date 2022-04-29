var request = new XMLHttpRequest()

request.open("GET", "../questoes.json", false);
request.send(null)
const questions = JSON.parse(request.responseText);

const questionsList = Object.keys(questions);

const textContainer = document.getElementById("textos-container");
const alternativeContainer = document.getElementById("alternativas-container");
const questionNumber = document.getElementById("numero-questao");
const statuss = document.getElementById("status-atividades");
// Cards 
const unansweredCard = document.getElementById("card-sem-resposta");
const wrongAnswerCard = document.getElementById("card-errada");
const infoWrongAnswer = document.getElementById("info-resposta");
const correctAnswerCard = document.getElementById("card-certa");
const instructionsCard = document.getElementById("instrucoes");
const finishedCard = document.getElementById("finalizada");
const spanResult = document.getElementById("resultado");
const spanSkip = document.getElementById("skip");

let finished = false;
let questionCorrect = '';
let result = {};
let count = 0;
let questionInfo = questions[questionsList[count]];
let statusItems = "";
let correta = 0;
let skip = 0;
function mudarPergunta(){
    if(count == 45 || finished == true){
        
        spanResult.innerText = correta + "/" + count;
        spanSkip.innerText = skip;
        finishedCard.className = "";
    }else{
        questionInfo = questions[questionsList[count]];

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

        
        

        let textos = "";
        if(questionInfo){
            questionInfo.textoAux.map((value, index)=>{
                textos += `
                    <p> ${value.texto}</p>
                `;
            })
        }
        
        statuss.innerHTML = statusItems;
        questionNumber.innerText = `Questão ${count+1}`;

        infoWrongAnswer.innerHTML = `
                                        <h3> Resposta errada </h3>
                                        <p>A alternativa correta seria: ${questionCorrect} </p>
        `;

        textContainer.innerHTML = `<div id="texto-content">
                                        
                                        ${textos.substring(2, textos.length)}
                                        ${questionInfo.textoAux[0].imagem? `<img src="${questionInfo.textoAux[0].imagem}" />`: ""}
                                        <div class="fonte">  ${questionInfo.textoAux[0].fonte} </div>
                                    </div>`

        if(questionInfo.textoAux[1]){
            textContainer.innerHTML = `<div id="texto-content">                       
                                            
                                            ${questionInfo.textoAux[0].texto? questionInfo.textoAux[0].texto: ""}
                                            ${questionInfo.textoAux[0].imagem? `<img src="${questionInfo.textoAux[0].imagem}" />`: ""}
                                            <div class="fonte">  ${questionInfo.textoAux[0].fonte} </div><br>
                                            ${questionInfo.textoAux[1].texto? questionInfo.textoAux[1].texto: ""}
                                            ${questionInfo.textoAux[1].imagem? `<img src="${questionInfo.textoAux[1].imagem}" />`: ""}
                                            <div class="fonte">  ${questionInfo.textoAux[1].fonte} </div>
                                        
                                            </div>`
        }

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
function stopSimulate(){
    finished = true;
    finishedCard.className = "";
    mudarPergunta();
}

function resetQuestions(){
    result = {}
    count = 0;
    skip = 0;
    statusItems = "";
    correta = 0;
    mudarPergunta();
    finished = false;
    finishedCard.className = "invisible";
    mudarPergunta();
}

function skipQuestion(){
    result[count] = {tentativa: "skip", acertou: false}
    count += 1;
    
    skip +=1;
    
    
    mudarPergunta();
}

function addCounter(){
    questionCorrect = questionInfo.respostas.correta;
    const radios = document.getElementsByName("alternativas")
    let notResponse = 0;
    let correctResponse = false;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            if(radios[i].value == questionInfo.respostas.correta){
                correctResponse = true;
                correta +=1;
                console.log(correta)
            }else{
                
                correctResponse = false;
                
            }
            result[count] = {tentativa: radios[i].value, acertou: correctResponse}
        }else{
            notResponse += 1;
        }
    }
    console.log(result)
    if(notResponse < radios.length){
        
        if(correctResponse){
            rederizeCorrectAnswerCard()
        }else{
            rederizeWrongAnswerCard()
        }
        count += 1;
        mudarPergunta();
    }else{
        rederizeUnansweredCard();
    }
    
}

function rederizeUnansweredCard(){
    unansweredCard.className = "visible";
    setTimeout(()=>{
        unansweredCard.className = "";
    }, 1000)
}

function rederizeWrongAnswerCard(){
    wrongAnswerCard.className = "visible";
    setTimeout(()=>{
        wrongAnswerCard.className = "";
    }, 1000)
}


function rederizeCorrectAnswerCard(){
    correctAnswerCard.className = "visible";
    setTimeout(()=>{
        correctAnswerCard.className = "";
    }, 1000)
}

function invisibleCardInstructions(){
    instructionsCard.className = "invisible";
}

function showFeedback(){

    window.jsPDF = window.jspdf.jsPDF;
    let columns = ["Questão", "Acertou", "Tentativa", "Resposta Correta"];
    let rows = [];
    


    // Only pt supported (not mm or in)
    let doc = new jsPDF('p', 'pt');
    const keys = Object.keys(result);
    keys.map((value, index)=>{

        let resultQuestion =  result[value].acertou ? "Sim" : "Não";
        let tentativa =  result[value].tentativa == "skip" ? "Questão pulada" : result[value].tentativa;
        let correta = questions[questionsList[index]].respostas.correta;

        rows = [...rows , [index+1, resultQuestion, tentativa, correta]]
        console.log(rows)
    })
    doc.autoTable(columns, rows);
    doc.save('gabarito.pdf');
        
        
}

function seeReports(){

    const relatorio = document.getElementById("relatorios");

    relatorio.className = " ";
    const keys = Object.keys(result);
    let errada = 0;
    keys.map((a)=>{
        if(result[a].acertou == false && result[a].tentativa != "skip"){
            errada +=1;
        }
    })

    const perguntaSelect = document.getElementById("pergunta");
    let listOptions = "";
    questionsList.map((key, index)=>{

        const opt = `<option value='${key}'> Questão  ${index + 1} </option>`;

        listOptions += opt;
        perguntaSelect.innerHTML = listOptions;
    })
    

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
            }
        }
    }
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
    const myChart = new Chart(grafico, dados);
    const myChart2 = new Chart(grafico2, dados2);
}

function closeReports(){
    const relatorio = document.getElementById("relatorios");

    relatorio.className = "invisible";
}
mudarPergunta();