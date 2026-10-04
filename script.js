import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    runTransaction
} from
"https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";


// Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyBDtd7W9NdHuy25LqneiqzSa-1FIRDHfPk",

    authDomain: "my-online-poll.firebaseapp.com",

    databaseURL: "https://my-online-poll-default-rtdb.firebaseio.com",

    projectId: "my-online-poll",

    storageBucket: "my-online-poll.firebasestorage.app",

    messagingSenderId: "500775602526",

    appId: "1:500775602526:web:9b93c5536b4f91a2ae67cf"

};


// Start Firebase

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);


// Vote button

const voteButton = document.getElementById("voteBtn");

const message = document.getElementById("message");


voteButton.addEventListener("click", async () => {

    const selected = document.querySelector(
        'input[name="candidate"]:checked'
    );


    // Agar option select nahi kiya

    if (!selected) {

        message.textContent =
            "⚠️ Pehle ek option select karein.";

        return;
    }


    // Check whether this browser already voted

    if (localStorage.getItem("hasVoted") === "true") {

        message.textContent =
            "⚠️ Aap is device se pehle hi vote kar chuke hain.";

        return;
    }


    const candidate = selected.value;


    // Candidate ka database name

    const candidateKey =
        candidate.replaceAll(" ", "_");


    try {

        const voteReference = ref(
            database,
            "votes/" + candidateKey
        );


        // Vote +1

        await runTransaction(
            voteReference,
            (currentValue) => {

                return (currentValue || 0) + 1;

            }
        );


        // Is browser ko voted mark karein

        localStorage.setItem(
            "hasVoted",
            "true"
        );


        message.textContent =
            "✅ Aapka vote successfully submit ho gaya!";


        voteButton.disabled = true;


    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ Vote submit nahi ho saka.";

    }

});


// Live results

const resultsReference =
    ref(database, "votes");


onValue(
    resultsReference,
    (snapshot) => {

        const data =
            snapshot.val() || {};


        const candidates = [
            "Qazi_Touqeer",
            "Arishfa_Khan",
            "Kanika_Mann"
        ];


        let html = "";


        candidates.forEach(
            (candidate) => {

                const voteCount =
                    data[candidate] || 0;


                const candidateName =
                    candidate.replaceAll("_", " ");


                html += `
                    <div class="result">
                        <b>${candidateName}</b>
                        <span>${voteCount} vote(s)</span>
                    </div>
                `;

            }
        );


        document.getElementById(
            "results"
        ).innerHTML = html;

    }
);