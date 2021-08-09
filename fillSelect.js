//use of export
export function fillSelect( array, select) {
    //ES6 arrow function
    array.forEach( item => {
        const option = document.createElement('option');
        const optionHTML = `<option value="${item}">${item}</option>`;
        option.innerHTML = optionHTML;
        select.append(option);
    });
}