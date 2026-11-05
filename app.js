import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const colRef = collection(db, "portfolio_crud");

// 1. READ (Live Data Fetch via API)
onSnapshot(colRef, (snapshot) => {
    let html = "";
    snapshot.forEach((d) => {
        let item = d.data();
        html += `
            <tr class="hover:bg-slate-800/50">
                <td class="p-3 font-bold text-white">${item.title}</td>
                <td class="p-3 text-slate-400">${item.desc}</td>
                <td class="p-3 text-right space-x-2">
                    <button onclick="window.edit('${d.id}', '${item.title}', '${item.desc}')" class="text-amber-400 font-semibold">Edit</button>
                    <button onclick="window.del('${d.id}')" class="text-red-400 font-semibold">Delete</button>
                </td>
            </tr>`;
    });
    document.getElementById("table").innerHTML = html || `<tr><td colspan="3" class="p-4 text-center text-slate-500">No records found</td></tr>`;
});

// 2. CREATE & UPDATE
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let id = document.getElementById("id").value;
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;

    if (id) {
        await updateDoc(doc(db, "portfolio_crud", id), { title, desc });
    } else {
        await addDoc(colRef, { title, desc });
    }
    document.getElementById("form").reset();
    document.getElementById("id").value = "";
    document.getElementById("btn").innerText = "Save Entry";
});

// 3. EDIT (Load into Form)
window.edit = (id, title, desc) => {
    document.getElementById("id").value = id;
    document.getElementById("title").value = title;
    document.getElementById("desc").value = desc;
    document.getElementById("btn").innerText = "Update Entry";
};

// 4. DELETE
window.del = async (id) => {
    if (confirm("Are you sure to delete?")) {
        await deleteDoc(doc(db, "portfolio_crud", id));
    }
};
