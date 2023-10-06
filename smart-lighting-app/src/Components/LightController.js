import React from 'react';
import './LightController.css';

function LightController({ light, toggleLight }) {
  return (
    <div className={`light-controller ${light.status}`}>
      <p>{`Light Status: ${light.motion_detected === true?light.status = 'on': light.status = 'off'}`}</p>
      <p><span>Location:</span> {light.location}</p>
      <p><span>Brightness: </span>{light.status === 'on'?light.brightness: 'none'}</p>
      <p>{`Temperature: ${Math.round(light.temperature)}C`}</p>
      <p>{`Humidity: ${Math.round(light.humidity)}%`}</p>
      <p>{`Motion Detected: ${light.motion_detected}`}</p>
      <p>{`Color: ${light.color}`}</p>
      <button onClick={() => toggleLight(light.light_id)}>
        {light.status === 'on' ? 'Turn Off' : 'Turn On'}
      </button>
    </div>
  );
}

export default LightController;

