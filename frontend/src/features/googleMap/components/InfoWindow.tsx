import { Button } from "~/components/ui/button";
import { Location } from "~/features/googleMap/types/location";

interface InfoWindowProps {
  position: google.maps.LatLngLiteral;
  locationDescription?: string;
  onClickChooseLocation?: (location: Location) => void;
}

const InfoWindow = (props: InfoWindowProps) => {
  const handleDetermineAddress = () => {
    if (!props.onClickChooseLocation) return;
    props.onClickChooseLocation(props.position);
  };
  return (
    <div className="flex flex-col w-full justify-center pl-1.5">
      <p className="text-center">{props.locationDescription}</p>
      <Button onClick={handleDetermineAddress} className="m-2">
        ここを選択
      </Button>
    </div>
  );
};

export default InfoWindow;
