import React from "react";

interface InfoWindowProps {
  position: google.maps.LatLngLiteral;
}

const InfoWindow: React.FC<InfoWindowProps> = ({ position }) => {
  return (
    <div>
      <p>緯度: {position.lat}</p>
      <p>経度: {position.lng}</p>
    </div>
  );
};

export default InfoWindow;
