"use client";
import { useState, useRef, useEffect } from "react";
import { LoadScript, GoogleMap } from "@react-google-maps/api";
import SearchBox from "./SearchBox";
import { Location } from "../types/location";
import { useCurrentLocation } from "../hook/useCurrentLocation";
import { useMarker } from "../hook/useMarker";

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
    // マップをクリックできるようにし、クリックした位置にマーカーを追加する
    mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        const latElement = document.getElementById("lat");
        const lngElement = document.getElementById("lng");
        if (latElement && lngElement) {
          latElement.textContent = lat.toString();
          lngElement.textContent = lng.toString();
        }

        new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
        });
      }
    });
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

  // でもデータ
  useMarker({
    map: map.current,
    positions: [
      { lat: 34.809, lng: 135.5613, isDecided: true },
      { lat: 34.80944, lng: 135.561444, isDecided: true },
      { lat: 34.80989, lng: 135.561208, isDecided: false },
      { lat: 34.809999, lng: 135.59999, isDecided: false },
    ],
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
          <div className="flex w-full z-10 absolute top-4 px-3">
            <SearchBox onAddressSelect={handleAddressSelect} />
          </div>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
