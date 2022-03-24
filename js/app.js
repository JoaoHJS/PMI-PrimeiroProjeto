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

let questionCorrect = '';
let result = {};
let count = 0;
let questionInfo = questions[questionsList[count]];
let statusItems = "";

function mudarPergunta(){
    
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
                            <div class="status ${result[count-4].acertou ? "verde" : "vermelho"}">${count -2}</div> <div class="status  ${result[count-3].acertou ? "verde" : "vermelho"}">${count - 1}</div> <div class="status  ${result[count-2].acertou ? "verde" : "vermelho"}">${count}</div> <div class="status ${result[count-1].acertou ? "verde" : "vermelho"}">${count + 1}</div> <div class="status azul">${count + 2}</div> <div class="status cinza">${count + 3}</div> <div class="status cinza">${count + 4}</div> 
                        <div>
        `;
    }


    
    let textos = "";
    questionInfo.textoAux.map((value, index)=>{
        textos += `
            <p> ${value.texto}</p>
        `;
    })
    statuss.innerHTML = statusItems;
    questionNumber.innerText = `Questão ${count+1}`;

    infoWrongAnswer.innerHTML = `
                                    <h3> Resposta errada </h3>
                                    <p>A alternativa correta seria: ${questionCorrect} </p>
    `;

    textContainer.innerHTML = `<div id="texto-content">
                                    
                                    ${textos.substring(2, textos.length)}
                                    <div class="fonte">  ${questionInfo.textoAux[0].fonte} </div>
                                </div>`

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
                                                <button onclick="addCounter()"> Enviar resposta</button>
                                            </div>
                                        </div>`;
                                    
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


mudarPergunta();