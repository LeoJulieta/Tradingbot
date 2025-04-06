const axios = require('axios');

// Función para detectar patrón bajista con interrupciones verdes
function detectarPatron(velas) {
  const smaPeriod = 50;
  const closes = velas.map(v => parseFloat(v.close));

  // Calcular la media móvil simple (SMA)
  const sma = closes.map((_, i) => {
    if (i < smaPeriod) return null;
    const slice = closes.slice(i - smaPeriod, i);
    const avg = slice.reduce((a, b) => a + b, 0) / smaPeriod;
    return avg;
  });

  // Buscar el patrón en las últimas 20 velas
  let interrupciones = 0;

  for (let i = velas.length - 20; i < velas.length; i++) {
    const vela = velas[i];
    const anterior = velas[i - 1];
    const smaActual = sma[i];

    if (!smaActual) continue;

    const esBajista = parseFloat(vela.close) < parseFloat(vela.open);
    const esAlcista = parseFloat(vela.close) > parseFloat(vela.open);
    const porDebajoSMA = parseFloat(vela.close) < smaActual;

    if (esAlcista && porDebajoSMA) {
      interrupciones++;
    }

    if (esBajista && interrupciones >= 3) {
      console.log(`Patrón detectado en vela #${i}, hora: ${new Date(vela.openTime).toLocaleTimeString()}`);
      interrupciones = 0; // reiniciar para detectar solo una vez
    }
  }
}

// Función para obtener velas reales de Binance
async function obtenerVelas() {
  const simbolo = 'USDTBRL';
  const intervalo = '1m';
  const limite = 100;

  const url = `https://api.binance.com/api/v3/klines?symbol=${simbolo}&interval=${intervalo}&limit=${limite}`;

  try {
    const response = await axios.get(url);
    const velas = response.data.map(v => ({
      openTime: v[0],
      open: v[1],
      high: v[2],
      low: v[3],
      close: v[4],
      closeTime: v[6]
    }));

    console.log(`Velas obtenidas: ${velas.length}`);
    detectarPatron(velas);
  } catch (error) {
    console.error('Error al obtener velas:', error.message);
  }
}

obtenerVelas();
