'use client';

import { QRCodePreset } from '@/types/preset';

interface PresetSelectorProps {
  presets: QRCodePreset[];
  selectedPreset: QRCodePreset;
  onSelectPreset: (preset: QRCodePreset) => void;
}

export default function PresetSelector({
  presets,
  selectedPreset,
  onSelectPreset,
}: PresetSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sélectionner un preset
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedPreset.id === preset.id
                ? 'border-pink-500 bg-pink-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: preset.color }}
              />
              <div>
                <p className="font-medium text-gray-900">{preset.name}</p>
                <p className="text-xs text-gray-500">{preset.color}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
