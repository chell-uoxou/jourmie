import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import InfoWindow from "./InfoWindow";

const Marker = ({
  map,
  center,
  draggable = true,
}: {
  map: google.maps.Map;
  center: { lat: number; lng: number };
  draggable?: boolean;
}) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
  const [infoRoot, setInfoRoot] = useState<ReturnType<
    typeof createRoot
  > | null>(null);
  const [position, setPosition] = useState(center); // マーカーの現在位置

  useEffect(() => {
    if (!map) return;

    // 既存のマーカーとウィンドウを削除
    if (marker) {
      marker.setMap(null);
    }
    if (infoWindow) {
      infoWindow.close();
    }

    const newMarker = new google.maps.Marker({
      position: center,
      map,
      draggable,
    });

    // マーカーのドラッグイベント
    newMarker.addListener("drag", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setPosition(newPos);
        // renderInfoWindow(newMarker, newPos);
      }
    });

    // マーカーのドラッグ終了時
    newMarker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setPosition(newPos);
        renderInfoWindow(newMarker, newPos);
      }
    });

    // クリック時に InfoWindow を表示
    newMarker.addListener("click", () => {
      renderInfoWindow(newMarker, position);
    });

    setMarker(newMarker);
    // 初期表示時に InfoWindow を開く
    renderInfoWindow(newMarker, center);

    return () => {
      newMarker.setMap(null);
      if (infoRoot) {
        infoRoot.unmount();
      }
    };
  }, [map, center]); // `center` 変更時は初期位置を更新

  // InfoWindow を表示する関数
  const renderInfoWindow = (
    marker: google.maps.Marker,
    position: { lat: number; lng: number }
  ) => {
    if (infoWindow) {
      infoWindow.close();
    }
    const infoWindowDiv = document.createElement("div");
    const root = createRoot(infoWindowDiv);
    root.render(<InfoWindow position={position} />);

    if (infoWindow) {
      infoWindow.setContent(infoWindowDiv);
      infoWindow.open(map, marker);
    } else {
      const newInfoWindow = new google.maps.InfoWindow({
        content: infoWindowDiv,
      });
      newInfoWindow.open(map, marker);
      setInfoWindow(newInfoWindow);
    }

    setInfoRoot(root);
  };

  return null;
};

export default Marker;
