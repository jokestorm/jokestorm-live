console.log('App Start')
//let $ = require('jquery')

const total = document.getElementById('total')
const upgradeButton1 = document.getElementById('btn-upgrade1')
const upgradeButton2 = document.getElementById('btn-upgrade2')
const autoButton1 = document.getElementById('btn-auto1')
const autoButton2 = document.getElementById('btn-auto2')
const upgradeCost1 = document.getElementById('cost-upgrade1')
const upgradeCost2 = document.getElementById('cost-upgrade2')
const autoCost1 = document.getElementById('cost-auto1')
const autoCost2 = document.getElementById('cost-auto2')
const stuffMakerCost = document.getElementById('cost-stuff-maker')
const clickButton1 = document.getElementById('btn-click1')
const clickButton2 = document.getElementById('btn-click2')
const tick1Text = document.getElementById('tick1')
const tick2Text = document.getElementById('tick2')
const auto1Text = document.getElementById('auto1')
const auto2Text = document.getElementById('auto2')
const thingMakerEnable = document.getElementById('thing-maker-enable')
const stuffMakerEnable = document.getElementById('stuff-maker-enable')
const thingMakerButton = document.getElementById('btn-thing-maker')
const stuffMakerButton = document.getElementById('btn-stuff-maker')
const row1 = document.getElementById('row1')
const row2 = document.getElementById('row2')
const shopButton = document.getElementById('shop')
const boostText = document.getElementById('boost-text')

let tickValue1 = 1
let tickValue2 = 10
let auto1Count = 0
let auto2Count = 0
let boost = 1

shopButton.addEventListener('click', async () => {
    boost++
    boostText.classList.remove('invisible')
    boostText.childNodes[1].childNodes[1].innerText = boost
})

thingMakerButton.addEventListener('click', async () => {
    row1.classList.remove('invisible')
    thingMakerEnable.classList.add('invisible')
    stuffMakerEnable.classList.add('visible')

})

stuffMakerButton.addEventListener('click', async () => {
    row2.classList.remove('invisible')
    stuffMakerEnable.classList.add('invisible')
})

clickButton1.addEventListener('click', async () => {
    tick1()
})

clickButton2.addEventListener('click', async () => {
    tick2()
})

autoButton1.addEventListener('click', async () => {
    const oldTotal = Number(total.innerText)
    total.innerText = oldTotal - Number(autoCost1.innerText)
    autoCost1.innerText = Number(autoCost1.innerText) * 2
    checkCosts()
    setInterval(tick1, 1000)
    auto1Count++
    auto1Text.innerText = auto1Count
})

autoButton2.addEventListener('click', async () => {
    const oldTotal = Number(total.innerText)
    total.innerText = oldTotal - Number(autoCost2.innerText)
    autoCost2.innerText = Number(autoCost2.innerText) * 2
    checkCosts()
    setInterval(tick2, 2500)
    auto2Count++
    auto2Text.innerText = auto2Count
})

upgradeButton1.addEventListener('click', async () => {
    const oldTotal = Number(total.innerText)
    total.innerText = oldTotal - Number(upgradeCost1.innerText)
    tickValue1++
    const oldCost = Number(upgradeCost1.innerText)
    upgradeCost1.innerText = oldCost + 10
    checkCosts()
    tick1Text.innerText = tickValue1
})

upgradeButton2.addEventListener('click', async () => {
    const oldTotal = Number(total.innerText)
    total.innerText = oldTotal - Number(upgradeCost2.innerText)
    tickValue2 += 5
    const oldCost = Number(upgradeCost2.innerText)
    upgradeCost2.innerText = oldCost + 25
    checkCosts()
    tick2Text.innerText = tickValue2

})

function tick1() {
    const oldValue = Number(total.innerText)
    const newValue = oldValue + tickValue1 * boost
    total.innerText = newValue

    checkCosts()
}

function tick2() {
    const oldValue = Number(total.innerText)
    const newValue = oldValue + tickValue2 * boost
    total.innerText = newValue

    checkCosts()
}

function checkCosts() {
    if (Number(total.innerHTML) >= Number(upgradeCost1.innerText)) {
        upgradeButton1.classList.remove('disabled')
    } else {
        upgradeButton1.classList.add('disabled')
    }

    if (Number(total.innerHTML) >= Number(upgradeCost2.innerText)) {
        upgradeButton2.classList.remove('disabled')
    } else {
        upgradeButton2.classList.add('disabled')
    }

    if (Number(total.innerHTML) >= Number(autoCost1.innerText)) {
        autoButton1.classList.remove('disabled')
    } else {
        autoButton1.classList.add('disabled')
    }

    if (Number(total.innerHTML) >= Number(autoCost2.innerText)) {
        autoButton2.classList.remove('disabled')
    } else {
        autoButton2.classList.add('disabled')
    }

    if (Number(total.innerHTML) >= Number(stuffMakerCost.innerText)) {
        stuffMakerButton.classList.remove('disabled')
    } else {
        stuffMakerButton.classList.add('disabled')
    }
}