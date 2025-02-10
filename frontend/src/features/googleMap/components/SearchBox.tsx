"use client";
import { useState, useEffect, useRef, KeyboardEvent, useCallback } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { MoveRight, Search } from "lucide-react";
import clsx from "clsx";
import { useMapWidget } from "~/hooks/useMapWidget";
import { LoadingSpinner } from "~/components/ui/spinner";

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting?: { main_text: string; secondary_text: string };
}

interface SearchBoxProps {
  onAddressSelect: (lat: number, lng: number, inputValue: string) => void; // 親コンポーネントに住所選択を通知
}

export default function SearchBox({ onAddressSelect }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]); // 候補の状態
  const [isOpen, setIsOpen] = useState<boolean>(false); // 候補表示のフラグ
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null); // 選択した候補のプレースID
  const inputRef = useRef<HTMLInputElement | null>(null); // 入力フィールドの参照
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // 選択中のインデックス
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDebouncePending, setIsDebouncePending] = useState<boolean>(false);

  const { _mapWidgetInputRef } = useMapWidget();

  useEffect(() => {
    setIsOpen(inputValue.length > 0 && suggestions.length > 0);
    setSelectedIndex(0); // 新しい候補が表示されたら選択をリセット
  }, [inputValue, suggestions]);

  // Google Places APIで候補を取得する処理
  const fetchSuggestions = useCallback((inputValue: string) => {
    setIsLoading(true);
    if (inputValue) {
      const service = new google.maps.places.AutocompleteService();
      service
        .getPlacePredictions({ input: inputValue })
        .then((result) => {
          setSuggestions(result.predictions);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, []);

  const debouncedFetchSuggestions = useDebouncedCallback(
    (inputValue: string) => {
      fetchSuggestions(inputValue);
      setIsDebouncePending(false);
    },
    750
  );

  const fetchGeoCode = useCallback(async (placeId: string) => {
    const geocoder = new google.maps.Geocoder();
    return geocoder.geocode({ placeId: placeId }).then((results) => {
      const location = results.results[0]?.geometry?.location;
      if (location) {
        return location;
      }
    });
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsDebouncePending(true);
      debouncedFetchSuggestions(e.target.value);
    },
    [debouncedFetchSuggestions]
  );

  const handleSuggestionClick = useCallback(
    (place: PlacePrediction) => {
      setInputValue(place.description); // 入力フィールドに住所を設定
      setSelectedPlaceId(place.place_id); // 選択したプレースIDを保存
      setSuggestions([]); // 候補リストを閉じるために候補をリセット
      // inputRef.current?.focus(); // 入力フィールドにフォーカス
      fetchGeoCode(place.place_id).then((location) => {
        if (location) {
          onAddressSelect(location.lat(), location.lng(), place.description);
        }
      });
    },
    [fetchGeoCode, onAddressSelect]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (suggestions.length !== 0) {
        fetchGeoCode(suggestions[selectedIndex].place_id);
      }

      // 検索候補をリセット
      setSuggestions([]);
      setSelectedPlaceId(null);
    },
    [fetchGeoCode, selectedIndex, suggestions]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "Enter":
        e.preventDefault();
        if (e.nativeEvent.isComposing || e.key !== "Enter") return;

        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (!selectedPlaceId) {
          setIsOpen(false);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex w-full items-center gap-3">
        <Input
          type="text"
          placeholder="地名を検索"
          value={inputValue}
          onChange={handleInputChange}
          ref={(e) => {
            inputRef.current = e;
            _mapWidgetInputRef.current = e;
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleInputChange}
        />
        <Button
          type="button"
          onClick={() => {
            debouncedFetchSuggestions.flush();
          }}
          className="p-3"
        >
          {(isLoading || isDebouncePending) && inputValue !== "" ? (
            <LoadingSpinner className="size-4" />
          ) : (
            <Search className="size-4" />
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="absolute mt-3 w-full z-10">
          <Command>
            <CommandList>
              <CommandGroup>
                {suggestions.map((place, index) => (
                  <CommandItem
                    key={place.place_id}
                    onSelect={() => handleSuggestionClick(place)}
                    className={clsx(
                      "flex justify-between group cursor-pointer",
                      selectedIndex === index ? "bg-accent" : ""
                    )}
                  >
                    {place.structured_formatting?.main_text ||
                      place.description}

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 items-center">
                      <MoveRight className="size-4" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {/* {suggestions.length === 0 && (
                <CommandEmpty>見つかりませんでした</CommandEmpty>
              )} */}
            </CommandList>
          </Command>
        </div>
      )}
    </form>
  );
}
