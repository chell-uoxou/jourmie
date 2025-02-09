import { Button } from "~/components/ui/button";

interface InfoWindowProps {
  position: google.maps.LatLngLiteral;
}

const InfoWindow: React.FC<InfoWindowProps> = ({ position }) => {
  const handleDetermineAddress = () => {
    console.log(position.lat, position.lng);
  };
  return (
    <div className="flex flex-col bg-white p-2 gap-2">
      <p>緯度: {position.lat}</p>
      <p>経度: {position.lng}</p>
      <Button onClick={handleDetermineAddress}>決定</Button>
    </div>
  );
};

export default InfoWindow;
