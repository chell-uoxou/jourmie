import { Button } from "~/components/ui/button";
import { useMapWidget } from "~/hooks/useMapWidget";

interface InfoWindowProps {
  position: google.maps.LatLngLiteral;
}

const InfoWindow: React.FC<InfoWindowProps> = ({ position }) => {
  const { _focusRedirectSearchBox } = useMapWidget();
  const handleDetermineAddress = () => {
    _focusRedirectSearchBox({
      location: {
        lat: position.lat,
        lng: position.lng,
      },
    });
  };
  return (
    <div className="flex w-full justify-center pl-1.5">
      <Button onClick={handleDetermineAddress} className="m-2">
        ここを選択
      </Button>
    </div>
  );
};

export default InfoWindow;
