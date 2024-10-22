"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import Map from "~/features/googleMap/components/Map";
import { Location } from "./types/location";
import { Map as LucideMap } from "lucide-react";

interface MapDrawerProps {
  show: boolean;
}

const MapDrawer = (props: MapDrawerProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  // 初期のデフォルト位置（OICの緯度）
  const [mapCenter, setMapCenter] = useState<Location>({
    lat: 34.809897,
    lng: 135.561208,
  });
  // 初回表示を追跡するための状態
  const [hasShown, setHasShown] = useState(false);
  // ブラウザのAPIから現在位置を取得し状態MapCenterを更新
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        setMapCenter(newLocation);
        console.log(position.coords);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  // `show`がtrueになったタイミングで`hasShown`をtrueに設定
  useEffect(() => {
    if (props.show && !hasShown) {
      setHasShown(true);
    }
  }, [props.show, hasShown]);

  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out overflow-hidden h-full  bg-white gap-2",
        props.show ? "w-[33.33vw]" : "w-0"
      )}
    >
      <div className="w-[33.33vw] p-6 h-full flex flex-col">
        <div className="flex flex-row text-xl font-bold transition-opacity overflow-hidden  duration-300 gap-2">
          <LucideMap className="size-6" />
          マップ
        </div>
        {/* hasShownがtrueになったらMapを表示 */}
        {hasShown && (
          <Map
            currentLocation={currentLocation ?? undefined}
            defaultCenter={currentLocation ? currentLocation : mapCenter}
          />
        )}
      </div>
    </div>
  );
};

export default MapDrawer;
