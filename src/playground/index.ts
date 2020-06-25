import {constants, F1TelemetryClient} from '..';

const {PACKETS} = constants;

const client = new F1TelemetryClient({port: 20777});

const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new RaspiIO()
});

board.on('ready', () => {
    const g1 = new five.Led('P1-11');
    const g2 = new five.Led('P1-13');
    const g3 = new five.Led('P1-15');
  

    const r1 = new five.Led('P1-29');
    const r2 = new five.Led('P1-31');
    const r3 = new five.Led('P1-33');

    const b1 = new five.Led('P1-35');
    const b2 = new five.Led('P1-37');
    const b3 = new five.Led('P1-7');

    client.on(PACKETS.carTelemetry, ( data ) => {
      const {m_carTelemetryData} = data;
      const telemetry = m_carTelemetryData[0];
      const {m_speed,m_throttle,m_steer,m_brake,m_clutch,m_gear,m_engineRPM,m_drs,m_revLightsPercent,m_brakesTemperature,m_tyresSurfaceTemperature,m_tyresInnerTemperature,m_engineTemperature, m_tyresPressure, m_surfaceType} = telemetry;
      
      console.log(m_revLightsPercent);
      m_revLightsPercent > 0  ? g1.on() : g1.off();
      m_revLightsPercent > 10 ? g2.on() : g2.off();
      m_revLightsPercent > 20 ? g3.on() : g3.off();

      m_revLightsPercent > 40 ? r1.on() : r1.off();
      m_revLightsPercent > 60 ? r2.on() : r2.off();
      m_revLightsPercent > 80 ? r3.on() : r3.off();

      m_revLightsPercent > 85 ? b1.on() : b1.off();
      m_revLightsPercent > 90 ? b2.on() : b2.off();
      m_revLightsPercent > 95 ? b3.on() : b3.off();
  });
});

client.start();

// stops the client
[`exit`,
 `SIGINT`,
 `SIGUSR1`,
 `SIGUSR2`,
 `uncaughtException`,
 `SIGTERM`,
].forEach(eventType => {
  (process as NodeJS.EventEmitter).on(eventType, (err) => {
    console.log(err);
    client.stop();
  });
});
