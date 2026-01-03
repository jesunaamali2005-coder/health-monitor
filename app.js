// FIREBASE CONFIG
const firebaseConfig = {
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

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => window.location.href = "dashboard.html")
    .catch(e => document.getElementById("loginMsg").innerText = e.message);
}

// EMAILJS INIT
emailjs.init("Eh_PvU_iJv8iVeyRW");

// DATABASE
const db = firebase.database();
const ref = db.ref("patient/1");

// CHART
let ctx = document.getElementById("chart");
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Heart Rate', data: [], borderWidth: 2 },
      { label: 'SpO₂', data: [], borderWidth: 2 }
    ]
  }
});

// LIVE DATA LISTENER
ref.on("value", snap => {
  let d = snap.val();
  if (!d) return;

  document.getElementById("hr").innerText = d.heart_rate;
  document.getElementById("spo2").innerText = d.spo2;

  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets[0].data.push(d.heart_rate);
  chart.data.datasets[1].data.push(d.spo2);
  chart.update();

  // AI RULE-BASED PREDICTION
  let status = "NORMAL";
  if (d.heart_rate < 50 || d.heart_rate > 120 || d.spo2 < 92) {
    status = "CRITICAL";
    document.getElementById("alertSound").play();
    sendEmail(d);
  }
  document.getElementById("status").innerText = status;
});

// EMAIL ALERT
function sendEmail(data) {
  emailjs.send("service_kbpknsu", "template_898oe0j", {
    patient_id: "1",
    heart_rate: data.heart_rate,
    spo2: data.spo2
  });
}
