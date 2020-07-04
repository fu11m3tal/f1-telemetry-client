
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

    const r1 = new five.Led('P1-31');
    const r2 = new five.Led('P1-29');
    const r3 = new five.Led('P1-16');
    const r4 = new five.Led('P1-18'); 
    const r5 = new five.Led('P1-37');

    const b1 = new five.Led('P1-40');
    const b2 = new five.Led('P1-38');
    const b3 = new five.Led('P1-36');
    const b4 = new five.Led('P1-32');
    const b5 = new five.Led('P1-22');

    client.on(PACKETS.carTelemetry, ( data ) => {
      const {m_carTelemetryData} = data;
      const telemetry = m_carTelemetryData[0];
      const {m_speed,m_throttle,m_steer,m_brake,m_clutch,m_gear,m_engineRPM,m_drs,m_revLightsPercent,m_brakesTemperature,m_tyresSurfaceTemperature,m_tyresInnerTemperature,m_engineTemperature, m_tyresPressure, m_surfaceType} = telemetry;
      
      console.log("speed: ", m_speed);
      console.log("RPM: ", m_engineRPM);
      console.log("throttle: ", m_throttle);
      console.log("break: :", m_brake);

      //const starting_fan_speed = 0;
      //if(m_speed > 50) motor.forward(100)
      //if(m_speed > 100) motor.forward(200)
      //if(m_speed <= 0) motor.forward(0);

      m_revLightsPercent > 1  ? g1.on() : g1.off();
      m_revLightsPercent > 10 ? g2.on() : g2.off();
      m_revLightsPercent > 20 ? g3.on() : g3.off();

      m_revLightsPercent > 30 ? r1.on() : r1.off();
      m_revLightsPercent > 40 ? r2.on() : r2.off();
      m_revLightsPercent > 50 ? r3.on() : r3.off();
      m_revLightsPercent > 60 ? r4.on() : r4.off();
      m_revLightsPercent > 70 ? r5.on() : r5.off();

      m_revLightsPercent > 80 ? b1.on() : b1.off();
      m_revLightsPercent > 85 ? b2.on() : b2.off();
      m_revLightsPercent > 90 ? b3.on() : b3.off();
      m_revLightsPercent > 95 ? b4.on() : b4.off();
      m_revLightsPercent >= 99 ? b5.on() : b5.off();  
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
