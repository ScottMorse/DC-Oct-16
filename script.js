const orders = document.querySelector('#orders')
const orderButton = document.querySelector('#active-order-button')
const orderFormWrap = document.querySelector('#new-order-wrap')
const orderForm = document.querySelector("#active-order-form")
const emailInput = document.querySelector('[name=email]')
const coffeeInput = document.querySelector('[name=coffee]')

function main(coffeeJson){
    Object.keys(coffeeJson).forEach(email => {
        const orderObj = coffeeJson[email]
        displayOrder(email,orderObj)
    })
    resetOrderNums()
}

function getOrders(runMainOnLoad){
    fetch('https://dc-coffeerun.herokuapp.com/api/coffeeorders/')
        .then(response => {
            return response.json()
        })
        .then(coffeeJson => {
            runMainOnLoad(coffeeJson)
        })
}

let numberedOrders = {}
function resetOrderNums(){
    numberedOrders = {}
    const orderNums = Array.from(document.querySelectorAll('.order-num'))
    const emails = document.querySelectorAll('.email')

    let n = 1
    orderNums.forEach(orderNum => {
        orderNum.parentElement.id = 'order' + n
        orderNum.innerHTML = '#' + n
        numberedOrders[emails[n - 1].innerHTML] = n
        n++
    })
}

function displayOrder(email,orderObj){
    const newDiv = document.createElement('div')
    const newOrderNum = document.createElement('div')
    const newOrderTitle = document.createElement('h3')
    const newOrderCoffee = document.createElement('coffee')
    const newDelete = document.createElement('button')

    newDiv.classList.add('order')
    newOrderNum.classList.add('order-num')
    newOrderTitle.classList.add('email')
    newOrderCoffee.classList.add('coffee')
    newDelete.classList.add('delete')
    newOrderTitle.innerHTML = email
    newOrderCoffee.innerHTML = orderObj.coffee
    newDelete.innerHTML = 'Delete'

    newDiv.appendChild(newOrderNum)
    newDiv.appendChild(newOrderTitle)
    newDiv.appendChild(newOrderCoffee)
    newDiv.appendChild(newDelete)
    orders.appendChild(newDiv)

    newDelete.addEventListener('click',clickToDelete)
}

function deleteOrder(email){
    fetch('https://dc-coffeerun.herokuapp.com/api/coffeeorders/' + email,{
        "method": "DELETE"
    })
    const orderIndex = numberedOrders[email]
    const orderEl = document.getElementById('order' + orderIndex)
    orders.removeChild(orderEl)
    resetOrderNums()
}

function clickToDelete(){
    const email = this.parentElement.children[1].innerHTML
    deleteOrder(email)
}


let formActive = false
function toggleOrderForm(active){
    if(!active){
        orderFormWrap.style.display = 'flex';
        setTimeout(()=>orderFormWrap.style.opacity = 1,100)
        formActive = true
    }
    else {
        orderFormWrap.style.opacity = 0
        setTimeout(()=>orderFormWrap.style.display = 'none',600)
        formActive = false
    }
}

function clickOutsideForm(e){
    if(e.target.id.slice(0,6) != 'active'){
        toggleOrderForm(true)
    }
}

function orderSubmission(e){
    e.preventDefault()
    const enteredEmail = emailInput.value
    const enteredCoffeee = coffeeInput.value
    emailInput.value = ''
    coffeeInput.value = ''
    const newOrder = {"emailAddress":enteredEmail,"coffee":enteredCoffeee}
    fetch('https://dc-coffeerun.herokuapp.com/api/coffeeorders/',{
        "method": "POST",
        "headers":{
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(newOrder)
    })
        .then( response => {
            displayOrder(enteredEmail,newOrder)
            resetOrderNums()

            toggleOrderForm(true)
        })
}

getOrders(main)

orderButton.addEventListener('mousedown',()=>toggleOrderForm(false))
window.addEventListener('click',clickOutsideForm)
orderForm.addEventListener('submit',orderSubmission)