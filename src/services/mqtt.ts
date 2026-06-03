import mqtt from "mqtt";

const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";

function getTopic(salaId: number): string {
  return `senac/biblioteca/sala${salaId}/comando`;
}

let client: mqtt.MqttClient | null = null;

export function connectMQTT(): Promise<mqtt.MqttClient> {
  if (client && client.connected) {
    return Promise.resolve(client);
  }

  return new Promise((resolve, reject) => {
    client = mqtt.connect(BROKER_URL);

    client.on("connect", () => {
      console.log("[MQTT] Conectado ao broker");
      resolve(client!);
    });

    client.on("error", (err) => {
      console.error("[MQTT] Erro:", err);
      reject(err);
    });

    client.on("close", () => {
      console.log("[MQTT] Conexão fechada");
    });
  });
}

export function sendCommand(salaId: number, payload: "ocupar" | "liberar"): void {
  const topic = getTopic(salaId);

  if (!client || !client.connected) {
    console.warn("[MQTT] Cliente não conectado. Tentando reconectar...");
    connectMQTT().then(() => {
      client!.publish(topic, payload, { qos: 1 }, (err) => {
        if (err) {
          console.error("[MQTT] Erro ao publicar:", err);
        } else {
          console.log(`[MQTT] Mensagem enviada: "${payload}" → ${topic}`);
        }
      });
    });
    return;
  }

  client.publish(topic, payload, { qos: 1 }, (err) => {
    if (err) {
      console.error("[MQTT] Erro ao publicar:", err);
    } else {
      console.log(`[MQTT] Mensagem enviada: "${payload}" → ${topic}`);
    }
  });
}
