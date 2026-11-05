import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const colRef = collection(db, "crud_table");

// 1. READ (Real-time data fetch & show)
onSnapshot(colRef, (snapshot) => {
    let html = "";
    snapshot.forEach((d) => {
        let item = d.data();
        html += `
            <tr>
                <td class="p-3 font-bold">${item.title}</td>
                <td class="p-3 text-slate-400">${item.desc}</td>
                <td class="p-3 text-right space-x-2">
                    <button onclick="window.edit('${d.id}', '${item.title}', '${item.desc}')" class="text-amber-400">Edit</button>
                    <button onclick="window.del('${d.id}')" class="text-red-400">Delete</button>
                </td>
            </tr>`;
    });
    document.getElementById("table").innerHTML = html || `<tr><td colspan="3" class="p-4 text-center text-slate-500">No data found</td></tr>`;
});

// 2. CREATE & UPDATE (Form Submit)
document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    let id = document.getElementById("id").value;
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;

    if (id) {
        // Update
        await updateDoc(doc(db, "crud_table", id), { title, desc });
    } else {
        // Create
        await addDoc(colRef, { title, desc });
    }
    document.getElementById("form").reset();
    document.getElementById("id").value = "";
    document.getElementById("btn").innerText = "Save Entry";
});

// 3. EDIT (Fill form to update)
window.edit = (id, title, desc) => {
    document.getElementById("id").value = id;
    document.getElementById("title").value = title;
    document.getElementById("desc").value = desc;
    document.getElementById("btn").innerText = "Update Entry";
};

// 4. DELETE
window.del = async (id) => {
    if (confirm("Delete this?")) {
        await deleteDoc(doc(db, "crud_table", id));
    }
};