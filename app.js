// 🔹 FIREBASE CONFIG (PUT YOUR REAL VALUES)
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

// 🔹 INIT FIREBASE
firebase.initializeApp(firebaseConfig);

// ================= LOGIN =================
function login() {
  var email = document.getElementById("email").value;
  var pass = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      document.getElementById("loginMsg").innerText = error.message;
    });
}

// ================= DASHBOARD =================
if (window.location.pathname.includes("dashboard")) {

  var db = firebase.database();
  var ref = db.ref("patient/1");

  var hrSpan = document.getElementById("hr");
  var spo2Span = document.getElementById("spo2");
  var statusSpan = document.getElementById("status");
  var alertSound = document.getElementById("alertSound");

  // CHART
  var ctx = document.getElementById("chart").getContext("2d");
  var chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Heart Rate", data: [], borderColor: "red", fill: false },
        { label: "SpO₂", data: [], borderColor: "lime", fill: false }
      ]
    }
  });

  ref.on("value", snapshot => {
    var d = snapshot.val();
    if (!d) return;

    hrSpan.innerText = d.heart_rate;
    spo2Span.innerText = d.spo2;

    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(d.heart_rate);
    chart.data.datasets[1].data.push(d.spo2);
    chart.update();

    // SIMPLE AI LOGIC
    var status = "NORMAL";
    if (d.heart_rate < 50 || d.heart_rate > 120 || d.spo2 < 92) {
      status = "CRITICAL";
      alertSound.play();
    }
    statusSpan.innerText = status;
  });
}
