// 🔴 Firebase config (REPLACE WITH YOUR VALUES)
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

const spo2Text = document.getElementById("spo2");
const statusText = document.getElementById("status");
const alertSound = document.getElementById("alertSound");

// Chart setup
const ctx = document.getElementById("spo2Chart").getContext("2d");
const spo2Chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "SpO₂ %",
      data: [],
      borderColor: "red",
      fill: false
    }]
  },
  options: {
    animation: false,
    scales: {
      y: {
        min: 80,
        max: 100
      }
    }
  }
});

// Firebase live listener
firebase.database().ref("patient").on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  const spo2 = data.spo2;
  const status = data.status;

  spo2Text.innerText = spo2;
  statusText.innerText = status;

  // ALERT
  if (status === "CRITICAL") {
    alertSound.play();
  } else {
    alertSound.pause();
  }

  // Update chart
  if (spo2Chart.data.labels.length > 15) {
    spo2Chart.data.labels.shift();
    spo2Chart.data.datasets[0].data.shift();
  }

  spo2Chart.data.labels.push(new Date().toLocaleTimeString());
  spo2Chart.data.datasets[0].data.push(spo2);
  spo2Chart.update();
});
