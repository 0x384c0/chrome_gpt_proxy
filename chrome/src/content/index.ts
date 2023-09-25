import divHtml from './page.html?raw'

function addPage() {
    var container = document.createElement('div');
    container.innerHTML = divHtml;
    var redDiv = container.firstChild;
    document.body.appendChild(redDiv!);
}


function addClickListener(){
    const button = document.querySelector('#test_button')
    let count = 0
    button?.addEventListener('click', () => {
        count++
        button.textContent = `Count: ${count}`
    })
}

addPage()
addClickListener()