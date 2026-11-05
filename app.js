import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const colRef = collection(db, "portfolio_db");

// Default initial items
const DEFAULTS = [
    { category: 'projects', title: 'Pet Papa 🐱', description: 'Mobile app for pet owners with nutrition tracking and vet appointment scheduling.' },
    { category: 'projects', title: 'Smart Traffic Management 🚸', description: 'Intersection coordinator with vehicle queue prediction and emergency green-wave overrides.' },
    { category: 'projects', title: 'FocusFlow 🛸', description: 'Browser extension providing Pomodoro timers, distraction shields, and soundscapes.' },
    { category: 'projects', title: 'Ratio & Iconic Academy 🎓', description: 'Educational portals empowering students across Bangladesh.' },

    { category: 'skills', title: 'Basic Programming & C', description: 'Logic structures, algorithm design, and core programming paradigms.' },
    { category: 'skills', title: 'HTML & CSS', description: 'Semantic markup, accessibility, and modern responsive layout styling.' },
    { category: 'skills', title: 'Java & Python', description: 'Object-oriented programming, data structures, and script automation.' },
    { category: 'skills', title: 'Web Dev & Lovable', description: 'Building interactive web solutions and low-code AI prototypes.' },

    { category: 'education', title: 'JSC · Adamjee Cantonment School', description: 'Junior School Certificate completed at Adamjee Cantonment School, Dhaka.' },
    { category: 'education', title: 'SSC & HSC · Ispahani Public School', description: 'Secondary & Higher Secondary Certificates from Ispahani Public School, Comilla.' },
    { category: 'education', title: 'Undergraduate CSE · IUB', description: '4th year BSc in Computer Science and Engineering at Independent University, Bangladesh.' }
];

// Auto seed default data if empty
async function seedData() {
    const snap = await getDocs(colRef);
    if (snap.empty) {
        for (let item of DEFAULTS) {
            await addDoc(colRef, item);
        }
    }
}
seedData();

// Real-time Read
onSnapshot(colRef, (snapshot) => {
    let eduHtml = "", skillHtml = "", projHtml = "";
    
    snapshot.forEach((d) => {
        let item = d.data();
        let row = `
            <tr class="hover:bg-slate-800/40">
                <td class="p-3 font-bold text-white">${item.title}</td>
                <td class="p-3 text-slate-400">${item.description}</td>
                <td class="p-3 text-right space-x-2">
                    <button onclick="window.edit('${d.id}', '${item.category}', \`${item.title}\`, \`${item.description}\`)" class="text-amber-400 font-semibold">Edit</button>
                    <button onclick="window.del('${d.id}')" class="text-red-400 font-semibold">Delete</button>
                </td>
            </tr>`;

        if (item.category === 'education') eduHtml += row;
        else if (item.category === 'skills') skillHtml += row;
        else if (item.category === 'projects') projHtml += row;
    });

    document.getElementById("eduTable").innerHTML = eduHtml || `<tr><td colspan="3" class="p-4 text-center text-slate-500">No records</td></tr>`;
    document.getElementById("skillTable").innerHTML = skillHtml || `<tr><td colspan="3" class="p-4 text-center text-slate-500">No records</td></tr>`;
    document.getElementById("projTable").innerHTML = projHtml || `<tr><td colspan="3" class="p-4 text-center text-slate-500">No records</td></tr>`;
});

// Modal Controls
window.openModal = (category, id = '', title = '', desc = '') => {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modalCat").value = category;
    document.getElementById("modalId").value = id;
    document.getElementById("modalTitleInput").value = title;
    document.getElementById("modalDescInput").value = desc;
    document.getElementById("modalTitle").innerText = id ? `Edit ${category}` : `Add ${category}`;
};

window.edit = (id, category, title, desc) => {
    window.openModal(category, id, title, desc);
};

window.closeModal = () => {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("form").reset();
};

// Create & Update
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

// Delete
window.del = async (id) => {
    if (confirm("Delete this entry?")) {
        await deleteDoc(doc(db, "portfolio_db", id));
    }
};
