import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LightController from './LightController';

function LightsList() {
  const [lights, setLights] = useState([]);
  const [lightsOn, setLightsOn] = useState(0);
  const [lightsOff, setLightsOff] = useState(0);

  useEffect(() => {
    axios.get('http://34.238.235.170:3008/lights').then((response) => {
      const lightsData = response.data;
      setLights(lightsData);
      calculateLightsStatus(lightsData);
    });
  }, []);

  const calculateLightsStatus = (lightsData) => {
    const onCount = lightsData.filter(light => light.status === 'on').length;
    const offCount = lightsData.length - onCount;
    setLightsOn(onCount);
    setLightsOff(offCount);
  };

  const toggleLight = (id) => {
    
    const lightToToggle = lights.find(light => light.light_id === id);
    
  
    const newStatus = lightToToggle.status === 'on' ? 'off' : 'on';
    
   
    axios.put(`http://34.238.235.170:3008/lights/${id}/toggle`, { status: newStatus })
      .then(response => {
        console.log('Toggle Response:', response);
        
        if (response.status === 200) {
         
          const updatedLights = lights.map(light =>
            light.light_id === id ? { ...light, status: newStatus } : light
          );
          setLights(updatedLights);
          
         
          calculateLightsStatus(updatedLights);
        } else {
          
          console.error('Failed to toggle light', response);
        }
      })
      .catch(error => {
       
        console.error('Failed to toggle light', error);
      });
  };
  

  return (
    <div>
      <p>{`Total Lights On: ${lightsOn}`}</p>
      <p>{`Total Lights Off: ${lightsOff}`}</p>
      {lights.map((light) => (
        <LightController key={light._id} light={light} toggleLight={toggleLight} />
      ))}
    </div>
  );
}

export default LightsList;
