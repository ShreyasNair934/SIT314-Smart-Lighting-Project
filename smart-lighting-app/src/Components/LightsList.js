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
    // Find the light that needs to be toggled
    const lightToToggle = lights.find(light => light.light_id === id);
    
    // Determine the new status
    const newStatus = lightToToggle.status === 'on' ? 'off' : 'on';
    
    // Send the toggle request to the server
    axios.put(`http://34.238.235.170:3008/lights/${id}/toggle`, { status: newStatus })
      .then(response => {
        console.log('Toggle Response:', response);
        // If successfully toggled on the server, update the local state
        if (response.status === 200) {
          // Update the status of the light in the local state
          const updatedLights = lights.map(light =>
            light.light_id === id ? { ...light, status: newStatus } : light
          );
          setLights(updatedLights);
          
          // Recalculate the counts of lights that are on and off
          calculateLightsStatus(updatedLights);
        } else {
          // Handle the error appropriately if the server response is not successful
          console.error('Failed to toggle light', response);
        }
      })
      .catch(error => {
        // Handle the error appropriately if the request fails
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
