const radiusInput = document.getElementById("radius");
const rupiahInput = document.getElementById("rupiah");
const hoursInput = document.getElementById("hours");
const number1Input = document.getElementById("number1");
const number2Input = document.getElementById("number2");

const resultElement = document.getElementById("result");

const calculateCircleMetrics = () => {
  const radius = parseFloat(radiusInput.value);

  if (radius <= 0) {
    resultElement.innerText = "Radius harus lebih dari 0";
    return;
  }

  const area = Math.PI * radius * radius;
  const circumference = 2 * Math.PI * radius;

  resultElement.innerText = `Luas: ${area.toFixed(
    2
  )} cm², Keliling: ${circumference.toFixed(2)} cm²`;
};

const calculateCurrency = () => {
  const rupiahValue = parseFloat(rupiahInput.value);

  if (rupiahValue <= 0) {
    resultElement.innerText = "Nilai Rupiah harus lebih dari 0";
    return;
  }

  const dollar = rupiahValue / 15900;
  const euro = rupiahValue / 16500;

  resultElement.innerText = `Dollar: $${dollar.toFixed(
    2
  )}, Euro: €${euro.toFixed(2)}`;
};

const calculateParkingFee = () => {
  const hours = parseFloat(hoursInput.value);

  if (hours <= 0) {
    resultElement.innerText = "Jam harus lebih dari 0";
    return;
  }

  if (hours <= 2) {
    resultElement.innerText = "Biaya parkir: Rp.2000";
    return;
  }

  const fee = hours * 1000;

  resultElement.innerText = `Biaya parkir: Rp.${fee}`;
};

const calculateSum = () => {
  const number1 = parseFloat(number1Input.value);
  const number2 = parseFloat(number2Input.value);

  if (isNaN(number1) || isNaN(number2)) {
    resultElement.innerText = "Masukkan angka yang valid";
    return;
  }

  const sum = number1 + number2;

  resultElement.innerText = `Hasil penjumlahan: ${sum}`;
};
