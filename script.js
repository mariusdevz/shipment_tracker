// let shipments = [];  // { id, description, status }
// 1. render() draws "#1 Phone - Received" for each, with a "Next status" button
// 2. A new shipment gets the next number and the status Received
// 3. "Next status" moves it forward (Delivered stays Delivered)
// 4. Summary: "3 shipments, 1 delivered" (use "1 shipment" for one)
// 5. Save to localStorage so a refresh keeps everything

const STATUSES = ["Received", "In Transit", "Delivered"];

const desc = document.getElementById("description");
const form = document.getElementById('form');
const list = document.getElementById('list');
const summary = document.getElementById('summary')

let shipments = [];

try {
    const saved = JSON.parse(localStorage.getItem('shipments'))
    shipments = Array.isArray(saved) ? saved : []

} catch {
    shipments = []
}

function render() {
    list.innerHTML = "";
    shipments.forEach((ship, index) => {
        //CREATING ELEMENTS
        const li = document.createElement('li');
        li.classList.add('list')
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('next')
        nextBtn.textContent = "Next status"

        nextBtn.disabled = ship.status === 'Delivered';
        nextBtn.addEventListener('click', () => {
            nextStatus(ship.id)
        })



        li.textContent = `#${index + 1} ${ship.text} - ${ship.status}`;
        li.appendChild(nextBtn)
        list.appendChild(li)
    })

    //UPDATE SHIPMENTS  
    const total = shipments.length;
    const deliveredCounts = shipments.filter(s => s.status === 'Delivered').length;
    summary.textContent = total === 1 ? `1 shipment, ${deliveredCounts} delivered`
        : `${total} shipments, ${deliveredCounts} delivered`

    localStorage.setItem('shipments', JSON.stringify(shipments))
}

form.addEventListener('submit', e => {
    e.preventDefault();
    addShipments()
})

function nextStatus(id) {
    shipments = shipments.map(ship => {
        if (ship.id === id) {
            const currentIndex = STATUSES.indexOf(ship.status);
            if (currentIndex < STATUSES.length - 1) {
                return { ...ship, status: STATUSES[currentIndex + 1] }
            }
        }
        return ship;
    })
    render()
}


function addShipments() {
    const descInput = desc.value.trim();
    if (desc.value.trim() === '') return;

    const newShipment = {
        id: Date.now(),
        text: descInput,
        status: STATUSES[0]
    }

    shipments.push(newShipment)
    desc.value = "";
    render()
}

render()