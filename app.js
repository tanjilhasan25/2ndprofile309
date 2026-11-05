import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const colRef = collection(db, "portfolio_db");

// Pre-loaded original items
const DEFAULTS = [
    { category: 'projects', title: 'Pet Papa', description: 'Mobile app for pet owners with nutrition tracking.' },
    { category: 'projects', title: 'Smart Traffic Management', description: 'Intersection coordinator with queue prediction.' },
    { category: 'projects', title: 'FocusFlow', description: 'Browser extension offering Pomodoro timers.' },
    
    { category: 'skills', title: 'Basic Programming & C', description: 'Logic structures and algorithm design.' },
    { category: 'skills', title: 'HTML & CSS', description: 'Semantic markup and responsive layouts.' },
    { category: 'skills', title: 'Java & Python', description: 'Object-oriented programming and scripting.' },

    { category: 'education', title: 'Adamjee Cantonment School', description: 'Completed JSC in Dhaka.' },
    { category: 'education', title: 'Ispahani Public School', description: 'Completed SSC & HSC in Comilla.' },
    { category: 'education', title: 'Independent University, Bangladesh', description: '4th year BSc in CSE.' }
];

// Auto seed default data into database if empty
async function seed() {
    const snap = await getDocs(colRef);
    if (snap.empty) {
        for (let item of DEFAULTS) {
            await addDoc(colRef, item);
        }
    }
}
seed();

// Real-time API Read
onSnapshot(colRef, (snapshot) => {
    let edu = "", skill = "", proj = "";
    snapshot.forEach((d) => {
        let item = d.data();
        let row = `
            <tr class="hover:bg-slate-800/40">
                <td class="p-2 font-bold text-white">${item.title}</td>
                <td class="p-2 text-slate-400">${item.description}</td>
                <td class="p-2 text-right space-x-2">
                    <button onclick="window.edit('${d.id}', '${item.category}', \`${item.title}\`, \`${item.description}\`)" class="text-amber-400 font-semibold">Edit</button>
                    <button onclick="window.del('${d.id}')" class="text-red-400 font-semibold">Delete</button>
                </td>
            </tr>`;
        if (item.category === 'education') edu += row;
        else if (item.category === 'skills') skill += row;
        else if (item.category === 'projects') proj += row;
    });

    document.getElementById("eduTable").innerHTML = edu || `<tr><td colspan="3" class="p-3 text-center text-slate-500">No data</td></tr>`;
    document.getElementById("skillTable").innerHTML = skill || `<tr><td colspan="3" class="p-3 text-center text-slate-500">No data</td></tr>`;
    document.getElementById("projTable").innerHTML = proj || `<tr><td colspan="3" class="p-3 text-center text-slate-500">No data</td></tr>`;
});

// Modal Actions
window.openModal = (cat, id = '', title = '', desc = '') => {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modalCat").value = cat;
    document.getElementById("modalId").value = id;
    document.getElementById("modalTitleInput").value = title;
    document.getElementById("modalDescInput").value = desc;
    document.getElementById("modalTitle").innerText = id ? `Edit ${cat}` : `Add ${cat}`;
};

window.edit = (id, cat, title, desc) => window.openModal(cat, id, title, desc);
window.closeModal = () => document.getElementById("modal").classList.add("hidden");

// Create & Update (API)
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let category = document.getElementById("modalCat").value;
    let id = document.getElementById("modalId").value;
    let title = document.getElementById("modalTitleInput").value;
    let description = document.getElementById("modalDescInput").value;

    if (id) {
        await updateDoc(doc(db, "portfolio_db", id), { category, title, description });
    } else {
        await addDoc(colRef, { category, title, description });
    }
    closeModal();
});

// Delete (API)
window.del = async (id) => {
    if (confirm("Delete this?")) {
        await deleteDoc(doc(db, "portfolio_db", id));
    }
};
