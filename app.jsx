document.getElementById("year").innerHTML = new Date().getFullYear();

let selectedInput = null;
let palavraSecreta;
let numTentativas = 1;
var lista = ['Extraordinário 😱', 'Fantástico 😮', 'Genial 😲', 'Impressionante 👏', 'Parabéns 👍', 'Ufa 😰', 'Perdeu 💀'];

document.addEventListener('DOMContentLoaded', () => {
    // Busca uma palavra aleatória do arquivo JSON
    fetch('palavras.json')
        .then(response => response.json())
        .then(data => {
            let palavras = data.palavras;
            palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];

            /* Exibe a palavra escolhida em um elemento HTML*//*
            const palavraEscolhida = document.getElementById('palavra-escolhida');
            palavraEscolhida.innerHTML = `Palavra escolhida: <strong>${palavraSecreta}</strong>`;*/

            const inputInicio = document.querySelectorAll(getDivSelector(numTentativas) + 'input')[0];
            inputInicio.focus();
        });
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        selectedInput = input;
    });
});

function getDivSelector(numTentativa) {
    return `#try .try${numTentativa} `;
}

const proximaDiv = document.querySelector(getDivSelector(numTentativas) + ' + div');

function verificarPalavra() {
    //Obtenha o valor dos campos de entrada na primeira div da seção "try".
    const camposDeEntrada = [...document.querySelectorAll(getDivSelector(numTentativas) + 'input')];
    const letras = [...camposDeEntrada].map(campo => campo.value);

    //Junte esses valores em uma única string.
    const palavraD = letras.join('');
    if ((palavraD.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()) !== (palavraSecreta.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase())) {
        document.querySelector(getDivSelector(numTentativas)).classList.add('respondido');
        if ((document.querySelector(getDivSelector(numTentativas) + ' + div')) !== null) {
            proximaDiv = document.querySelector(getDivSelector(numTentativas) + ' + div');
        } else {
            proximaDiv = document.querySelector('.try6')
        }
        if (proximaDiv) {
            proximaDiv.classList.remove('oculto');
          }    
        numTentativas++;
        console.log(numTentativas);
        const primeiroInput = proximaDiv.querySelector('input');
        primeiroInput.focus();

        document.querySelectorAll(getDivSelector(numTentativas - 1) + 'input').forEach((campo) => {
            if (palavraSecreta.includes(campo.value.toLowerCase())) {
                while (campo.classList.length > 0) {
                    campo.classList.remove(campo.classList.item(0));
                }
                campo.classList.add('quase');
            } else {
                while (campo.classList.length > 0) {
                    campo.classList.remove(campo.classList.item(0));
                }
                campo.classList.add('errou');
            }

            for (let i = 0; i < palavraSecreta.length; i++) {
                if (i < camposDeEntrada.length && campo.value.toLowerCase() === palavraSecreta[i].toLowerCase() && i === camposDeEntrada.indexOf(campo)) {
                    while (campo.classList.length > 0) {
                        campo.classList.remove(campo.classList.item(0));
                    }
                    campo.classList.add('certo');
                }
            }
        });
        if (numTentativas > 6) {
            var nota = lista[numTentativas-1];
            var alertBox = document.createElement('section');
            alertBox.innerHTML = nota;
            document.body.appendChild(alertBox);
            alertBox.classList.add('alert');
            setTimeout(function () {
                alertBox.remove();
            }, 2000);
        }
    } else {
        document.querySelectorAll(getDivSelector(numTentativas) + 'input').forEach((campo) => {
            campo.classList.add('certo');
        });
        var nota = lista[numTentativas-1];
        var alertBox = document.createElement('section');
        alertBox.innerHTML = nota;
        document.body.appendChild(alertBox);
        alertBox.classList.add('alert');
        setTimeout(function () {
            alertBox.remove();
        }, 2000);
    }
};

document.querySelectorAll('.letra, .backspace, .enter').forEach(botao => {
    botao.addEventListener('click', () => {
        if (selectedInput) {
            const letra = botao.textContent;
            if (botao.classList.contains('backspace')) {
                selectedInput.value = '';
                const prevInput = selectedInput.previousElementSibling;
                if (prevInput && prevInput.tagName.toLowerCase() === 'input') {
                    prevInput.focus();
                } else {
                    selectedInput.focus();
                }
            } else if (botao.classList.contains('enter')) {
                let camposEntrada = document.querySelectorAll(getDivSelector(numTentativas) + 'input');
                let digitados = [];
                camposEntrada.forEach(campo => {
                    digitados.push(campo.value);
                });

                const palavraE = digitados.join('');
                if (palavraE.length === 5) {
                    verificarPalavra();
                } else {
                    selectedInput.focus();
                }
            } else {
                if (selectedInput.value === '') {
                    selectedInput.value += letra;
                } else {
                    selectedInput.value = letra;
                }
                selectedInput.value = letra.toUpperCase();
                if (selectedInput.value.length >= selectedInput.maxLength) {
                    const nextInput = selectedInput.nextElementSibling;
                    if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
                        nextInput.focus();
                    } else {
                        selectedInput.focus();
                    }
                }
            }
        }
    });
});


document.addEventListener('keydown', event => {
    if (event.keyCode === 37) { // seta esquerda
        event.preventDefault();
        const prevInput = selectedInput.previousElementSibling;
        if (prevInput && prevInput.tagName.toLowerCase() === 'input') {
            prevInput.focus();
        } else {
            selectedInput.focus();
        }
    } else if (event.keyCode === 39) { // seta direita
        event.preventDefault();
        const nextInput = selectedInput.nextElementSibling;
        if (nextInput && nextInput.tagName.toLowerCase() === 'input') {
            nextInput.focus();
        } else {
            selectedInput.focus();
        }
    }
});

