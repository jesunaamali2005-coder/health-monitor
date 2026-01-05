// 🔴 Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyCq4-w3QU9AWdu97W3moKyih6ANCN0mFxE",
  authDomain: "health-monitor-58970.firebaseapp.com",
  databaseURL: "https://health-monitor-58970-default-rtdb.firebaseio.com",
  projectId: "health-monitor-58970",
  storageBucket: "health-monitor-58970.firebasestorage.app",
  messagingSenderId: "389520868404",
  appId: "1:389520868404:web:e2e915837835454825f661",
  measurementId: "G-P2ZDW69QXQ"
};
firebase.initializeApp(firebaseConfig);

// DOM Elements
const loginDiv = document.getElementById("login");
const dashboardDiv = document.getElementById("dashboard");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const spo2El = document.getElementById("spo2");
const statusEl = document.getElementById("status");
const alertSound = document.getElementById("alertSound");

// Chart setup
let spo2ChartCtx = document.getElementById('spo2Chart').getContext('2d');
let spo2Chart = new Chart(spo2ChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'SpO₂ (%)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
        }]
    },
    options: {
        responsive: true,
        animation: false,
        scales: {
            x: { display: true },
            y: { min: 80, max: 100 }
        }
    }
});

// Login function
function login() {
    const email = emailInput.value;
    const password = passwordInput.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        loginDiv.style.display = "none";
        dashboardDiv.style.display = "block";
        startRealtimeUpdates();
    })
    .catch(err => {
        loginError.textContent = err.message;
    });
}

// Logout
function logout() {
    firebase.auth().signOut();
    dashboardDiv.style.display = "none";
    loginDiv.style.display = "block";
}

// Realtime updates
function startRealtimeUpdates() {
    firebase.database().ref("patient").on("value", snapshot => {
        const data = snapshot.val();
        if (!data) return;

        const spo2 = data.spo2;
        const status = data.status;

        spo2El.textContent = spo2;
        statusEl.textContent = status;

        // Play alert sound if critical
        if (status === "CRITICAL") alertSound.play();
        else alertSound.pause();

        // Update chart
        if (spo2Chart.data.labels.length > 20) {
            spo2Chart.data.labels.shift();
            spo2Chart.data.datasets[0].data.shift();
        }
        spo2Chart.data.labels.push(new Date().toLocaleTimeString());
        spo2Chart.data.datasets[0].data.push(spo2);
        spo2Chart.update();
    });
}
