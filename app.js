const btnPrev = document.querySelector('.fleche--prev')
const btnNext = document.querySelector('.fleche--next')
const cards = document.querySelectorAll('.carte')
let currentCardIndex = 0

const init = () => {


  const nbCards = cards.length - 1
  cards.forEach((card, i) => {
    if (i===0){
      card.classList.add('active')
    }

    const isEven = i % 2 ===0

    // 10, c'est l'offset entre chaque carte

    const mult =  (isEven? 1 : -1)

    const spaceX = (0.4 * Math.random() * mult) + 4
    const spaceY = (3 * Math.random() * mult) + 2

    const offsetX = `${i * spaceX}px`
    const offsetY = `${i * spaceY}px`

    card.style.setProperty('--offsetX', offsetX)
    card.style.setProperty('--offsetY', offsetY)

    const color = `rgb(${180 - (i/30 * 255)}, 0, 200)`
    card.style.setProperty('--color', color)

    const z = nbCards - i
    card.style.setProperty('--zIndex', z)

    const rota = (isEven ? (Math.PI * 0.1) : (Math.PI * -0.1))
    const rotationX = (i + 1) * rota
    card.style.setProperty('--rotationX', `${rotationX}deg`)

    let contenue = document.createElement('span')
    contenue.classList.add('contenue')
    card.appendChild(contenue)
    contenue.textContent = Math.round(Math.random() * 150)
    //contenue.textContent(
  })
}

const goNext = (isNext) => { 
  if (currentCardIndex === cards.length){
    resetCard()
    return
  }
  const activeCard = cards[currentCardIndex]
  
  const z =  cards.length +currentCardIndex 
  console.log(z)
  cards[currentCardIndex].style.setProperty('--zIndex', z)

  const left = isNext ? 80 : 20
  activeCard.style.setProperty('--left', `${left}%`)

  currentCardIndex += 1
  currentCardIndex = Math.min(currentCardIndex, cards.length)

  const nextCard = cards[currentCardIndex]  

}

const resetCard = () => {
  currentCardIndex = 0
  
  cards.forEach((card, i) => {
    const z = cards.length - i

    card.style.setProperty('--left', `50%`)
    card.style.setProperty('--zIndex', z)
  })
}

const addListeners = () => {
  btnPrev.addEventListener('click', () => {
    goNext(false)
  })
  btnNext.addEventListener('click',  () => {
    goNext(true)
  })
  document.onkeydown = function(e) {
    switch (e.keyCode) {
          case 37:
            goNext(false)
            break;
        case 39:
          goNext(true)
            break;
        case 40:
          resetCard()
          break;
        case 38:
          resetCard()
        break;
    };
  }
}


init()
addListeners()