var scrollama = scrollama();

function handleStepEnter(response) {
    console.log(response)
    response.element.classList.add('active')
    
}

function handleStepExit(response) {
    console.log(response)
    response.element.classList.remove('active')
}

scrollama.setup({
    step: 'div',
    debug: true,
    offset: 0.6,
})
.onStepEnter(handleStepEnter)
.onStepExit(handleStepExit)
