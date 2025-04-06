import requests
import time

def obtener_velas(symbol="USDTBRL", intervalo="1m", limite=100):
    url = "https://api.binance.com/api/v3/klines"
    params = {
        "symbol": symbol,
        "interval": intervalo,
        "limit": limite
    }
    response = requests.get(url, params=params)
    data = response.json()

    print(f"Obteniendo {len(data)} velas para {symbol} en intervalo {intervalo}")
    for vela in data:
        timestamp = vela[0]
        apertura = float(vela[1])
        maximo = float(vela[2])
        minimo = float(vela[3])
        cierre = float(vela[4])
        volumen = float(vela[5])

        print(f"Apertura: {apertura}, Cierre: {cierre}, Volumen: {volumen}")

# Ejecutar
obtener_velas()
