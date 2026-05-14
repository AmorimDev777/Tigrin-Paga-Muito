const simbolos = [
    {
        nome:"wild",
        img:"https://tigre.br.com/wp-content/uploads/2026/02/fortunetiger-icons-1.webp",
        wild:true
    }, 
    {
        nome:"item4",
        img:"https://tigre.br.com/wp-content/uploads/2026/02/fortunetiger-icons-5.webp"
    },
    {
        nome:"item3",
        img:"https://tigre.br.com/wp-content/uploads/2026/02/fortunetiger-icons-4.webp"
    },
    {
        nome:"item2",
        img:"https://tigre.br.com/wp-content/uploads/2026/02/fortunetiger-icons-3.webp"
    },
    {
        nome:"item1",
        img:"https://tigre.br.com/wp-content/uploads/2026/02/fortunetiger-icons-2.webp"
    }
]

const grid = document.getElementById("grid")
let girando = false
let saldo = 100
let aposta = 10

let slots = []

/* criar slots */

for(let i=0;i<9;i++){
    const div = document.createElement("div")

    div.classList.add("slot")
    div.innerHTML = "❓"

    grid.appendChild(div)
    slots.push(div)
}

/* random */

function simbolo(){
    const chanceWild = 0.08

    if(Math.random() < chanceWild) { return simbolos.find(s => s.wild) }
    const normais = simbolos.filter(s => !s.wild)

    return normais[ Math.floor(Math.random() * normais.length) ]

}
function atualizarAposta(){
    document.getElementById("aposta").innerHTML = `R$${aposta.toFixed(2).replace('.', ',')}`
}

function aumentarAposta(){
    aposta += 10;
    atualizarAposta();
}

function diminuirAposta(){
    if(aposta > 10){
        aposta -= 10;
        atualizarAposta();
    }
}

/* saldo */

function atualizarSaldo(){
    document.getElementById("saldo").innerHTML = `R$${saldo.toFixed(2).replace('.', ',')}`;
}

/* limpar */

function limpar(){
    slots.forEach(slot => { slot.classList.remove("win") })
}

/* GIRAR */

function girar(){
    if(girando) return
    girando = true

    const mensagem = document.getElementById("mensagem")

    if(saldo < aposta){
        mensagem.innerHTML = "Saldo insuficiente"
        girando = false
        return
    }

    saldo -= aposta

    atualizarSaldo()
    limpar()

    let tempo = 30

    slots.forEach(slot=>{
        const s = simbolo()
        
        slot.dataset.nome = s.nome
        slot.dataset.wild = s.wild || false
        slot.innerHTML = `<img src="${s.img}" class="slot-img">`
    })

    const animacao = setInterval(()=>{
        slots.forEach(slot=>{
            const s = simbolo()

            slot.dataset.nome = s.nome
            slot.dataset.wild = s.wild || false
            slot.innerHTML = `<img src="${s.img}" class="slot-img">`
        })

        tempo--

        if(tempo <= 0){
            clearInterval(animacao)

            slots.forEach(slot => { slot.classList.remove("spinning") })
            verificar()

            girando = false
        }
    },90)
}

/* verificar */

function verificar(){
    const mensagem = document.getElementById("mensagem")

    const linhas = [
        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,4,8],
        [2,4,6]
    ]

    let ganhou = false
    let premio = 0

    linhas.forEach(linha => {
        const [a,b,c] = linha

        const slotsLinha = [
            slots[a],
            slots[b],
            slots[c]
        ]

        const nomes = slotsLinha.map( s => s.dataset.nome )
        const semWild = nomes.filter( n => n !== "wild" )

        if(semWild.length === 0){
            ganhou = true
            premio += aposta * 10

            slotsLinha.forEach(slot => { slot.classList.add("win") })

            return
        }

        const referencia = semWild[0]
        const venceu = nomes.every(nome => { return nome === referencia || nome === "wild" })

        if(venceu){
            ganhou = true
            premio += aposta * 5

            slotsLinha.forEach(slot => { slot.classList.add("win") })
        }
    })

    if(ganhou){
        saldo += premio;
        mensagem.innerHTML = `GANHO R$${premio.toFixed(2)}`;
    }
    else{
        mensagem.innerHTML = "";
    }

    atualizarSaldo();

}