"use client";
import { useState, useRef, useEffect } from "react";
import { LoadScript, GoogleMap } from "@react-google-maps/api";
import SearchBox from "./SearchBox";
import Marker from "./Marker";
import { Location } from "../types/location";
import { useCurrentLocation } from "../hook/useCurrentLocation";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

interface MapProps {
  currentLocation?: Location;
  defaultCenter: Location;
}

export default function Map({ currentLocation, defaultCenter }: MapProps) {
  const map = useRef<google.maps.Map | null>(null); // Google Mapsインスタンスを保持
  const [center, setCenter] = useState(defaultCenter); // 地図の中心を管理する状態

  // currentLocationが変更されたときに地図の中心を更新
  useEffect(() => {
    if (currentLocation) {
      setCenter({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
    }
  }, [currentLocation]);

  // マップがロードされたときの処理
  const onLoad = (mapInstance: google.maps.Map) => {
    map.current = mapInstance;
  };

  // マップがアンロードされたときの処理
  const onUnmount = () => {
    map.current = null;
  };

  const mapOptions = {
    disableDefaultUI: true, // デフォルトのUIを無効化
    zoomControl: true, // ズームコントロールを有効化
    streetViewControl: false, // ストリートビューコントロールを無効化
    mapTypeControl: false, // マップタイプコントロールを無効化
  };

  // 現在地を表すアイコンを表示
  useCurrentLocation({
    map: map.current,
    position: currentLocation || defaultCenter,
  });

  const handleAddressSelect = (lat: number, lng: number) => {
    setCenter({ lat, lng }); // 中心を更新
  };

  return (
    <div className="grow rounded-lg bg-clip-border relative">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {map.current && <Marker map={map.current} center={center} />}
          <div className="flex w-full z-10 absolute top-4 px-3">
            <SearchBox onAddressSelect={handleAddressSelect} />
          </div>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
