"use client";

import { useState, useEffect } from "react";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import PresetSelector from "@/components/PresetSelector";
import { presets, QRCodePreset } from "@/types/preset";

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState<QRCodePreset>(presets[0]);
  const [inputValue, setInputValue] = useState<string>("");
  const [customColor, setCustomColor] = useState<string>("#000000");
  const [customLogo, setCustomLogo] = useState<string>("");
  const [dark, setDark] = useState(false);
  const [qrSize, setQrSize] = useState<number>(280);
  const [enableTracking, setEnableTracking] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState<string>("");
  const [shortCode, setShortCode] = useState<string>("");
  const [scanCount, setScanCount] = useState<number | null>(null);
  // Notification de confidentialité supprimée

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [dark]);

  const isCustomPreset = selectedPreset.id === "custom";

  return (
    <div className={"min-h-screen bg-gradient-to-br " + (dark ? "from-zinc-900 to-black" : "from-gray-50 to-gray-100") + " transition-colors duration-300"}>
      {/* Header */}
      <header className={dark ? "bg-zinc-900 shadow-sm border-b border-zinc-800" : "bg-white shadow-sm border-b border-gray-200"}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#E2147C' }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div>
              <h1 className={"text-2xl font-bold " + (dark ? "text-zinc-100" : "text-gray-900")}>CoeurCode</h1>
              <p className={"text-sm " + (dark ? "text-zinc-400" : "text-gray-600")}>Générez un QRCode personnalisé gratuitement!</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => setDark((d) => !d)}
              className={"px-4 py-2 rounded-lg border transition-colors font-medium " + (dark ? "bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100")}
              title={dark ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {dark ? (
                <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.95l-.71-.71M21 12h1M3 12H2m16.95-7.05l-.71.71M4.05 4.05l-.71.71" /></svg> Sombre</span>
              ) : (
                <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg> Clair</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={"max-w-6xl mx-auto px-4 py-8 " + (dark ? "text-zinc-100" : "")}> 

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Input Section */}
            <div className={dark ? "bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6" : "bg-white rounded-xl shadow-sm border border-gray-200 p-6"}>
              <h2 className={"text-lg font-semibold mb-4 " + (dark ? "text-zinc-100" : "text-gray-900")}>Contenu du QR Code</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="qr-content"
                    className={"block text-sm font-medium mb-2 " + (dark ? "text-zinc-300" : "text-gray-700")}
                  >
                    URL ou texte
                  </label>
                  <input
                    id="qr-content"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com"
                    className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all " + (dark ? "border-zinc-700 text-zinc-100 bg-zinc-800 placeholder-zinc-400" : "border-gray-300 text-gray-900 placeholder-gray-400")}
                  />
                </div>

                {/* Tracking Option */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="enable-tracking"
                    type="checkbox"
                    checked={enableTracking}
                    onChange={(e) => setEnableTracking(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <label
                    htmlFor="enable-tracking"
                    className={"text-sm font-medium cursor-pointer " + (dark ? "text-zinc-300" : "text-gray-700")}
                  >
                    Activer le suivi des scans (génère un lien court)
                  </label>
                </div>

                {enableTracking && (
                  <button
                    onClick={async () => {
                      if (!inputValue) {
                        alert('Veuillez entrer une URL');
                        return;
                      }
                      try {
                        const res = await fetch('/api/qrcodes', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ targetUrl: inputValue }),
                        });
                        const data = await res.json();
                        if (data.fullUrl) {
                          setTrackingUrl(data.fullUrl);
                          setShortCode(data.shortCode);
                          setScanCount(0);
                        }
                      } catch (error) {
                        console.error('Error creating tracking URL:', error);
                        alert('Erreur lors de la création du lien de suivi');
                      }
                    }}
                    className={"w-full px-4 py-2 rounded-lg font-medium transition-colors " + (dark ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-pink-600 hover:bg-pink-700 text-white")}
                  >
                    Générer le lien de suivi
                  </button>
                )}

                {trackingUrl && (
                  <div className={"p-4 rounded-lg " + (dark ? "bg-zinc-800 border border-zinc-700" : "bg-pink-50 border border-pink-200")}>
                    <div className="mb-4">
                      <p className={"text-sm font-medium mb-1 " + (dark ? "text-zinc-300" : "text-gray-700")}>
                        Lien de scan (ajouté dans le QRCode généré) :
                      </p>
                      <p className={"text-sm font-mono break-all " + (dark ? "text-pink-400" : "text-pink-600")}>
                        {trackingUrl}
                      </p>
                    </div>
                    
                    <div>
                      <p className={"text-sm font-medium mb-1 " + (dark ? "text-zinc-300" : "text-gray-700")}>
                        Lien des statistiques (à conserver) :
                      </p>
                      <a 
                        href={`/stats/${shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={"text-sm font-mono break-all hover:underline " + (dark ? "text-blue-400" : "text-blue-600")}
                      >
                        {typeof window !== 'undefined' ? `${window.location.origin}/stats/${shortCode}` : `/stats/${shortCode}`}
                      </a>
                    </div>

                    <a
                      href={`/stats/${shortCode}`}
                      target="_blank"
                      className={"mt-4 block w-full text-center px-4 py-2 rounded-lg font-medium transition-colors " + (dark ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-200" : "bg-pink-100 hover:bg-pink-200 text-pink-900")}
                    >
                      Voir les statistiques détaillées
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Preset Section */}
            <div className={dark ? "bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6" : "bg-white rounded-xl shadow-sm border border-gray-200 p-6"}>
              <h2 className={"text-lg font-semibold mb-4 " + (dark ? "text-zinc-100" : "text-gray-900")}>Style du QR Code</h2>
              <PresetSelector
                presets={presets}
                selectedPreset={selectedPreset}
                onSelectPreset={setSelectedPreset}
              />

              {/* Custom Options */}
              {isCustomPreset && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div>
                    <label
                      htmlFor="custom-color"
                      className={"block text-sm font-medium mb-2 " + (dark ? "text-zinc-300" : "text-gray-700")}
                    >
                      Couleur personnalisée
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        id="custom-color"
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className={"w-12 h-12 rounded-lg cursor-pointer border " + (dark ? "border-zinc-700" : "border-gray-300")}
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className={"flex-1 px-4 py-2 border rounded-lg uppercase " + (dark ? "border-zinc-700 text-zinc-100 bg-zinc-800" : "border-gray-300 text-gray-900")}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="custom-logo"
                      className={"block text-sm font-medium mb-2 " + (dark ? "text-zinc-300" : "text-gray-700")}
                    >
                      URL du logo (optionnel)
                    </label>
                    <input
                      id="custom-logo"
                      type="text"
                      value={customLogo}
                      onChange={(e) => setCustomLogo(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all " + (dark ? "border-zinc-700 text-zinc-100 bg-zinc-800 placeholder-zinc-400" : "border-gray-300 text-gray-900 placeholder-gray-400")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Taille du QR Code */}
            <div className={dark ? "bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6" : "bg-white rounded-xl shadow-sm border border-gray-200 p-6"}>
              <label className={"block text-sm font-medium mb-2 " + (dark ? "text-zinc-300" : "text-gray-700")}>Taille du QR Code</label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min={120}
                  max={450}
                  step={10}
                  value={qrSize}
                  onChange={e => setQrSize(Number(e.target.value))}
                  className={"w-full h-2 rounded-lg appearance-none cursor-pointer " + (dark ? "bg-zinc-700" : "bg-pink-200")}
                />
                <span className={"text-sm font-semibold px-2 py-1 rounded " + (dark ? "bg-zinc-800 text-zinc-100" : "bg-pink-100 text-pink-900")}>{qrSize}px</span>
              </div>
            </div>
            {/* Info Section */}
            <div className={dark ? "bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 p-6" : "bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200 p-6"}>
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#E2147C' }}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    className="font-semibold rounded-lg px-4 py-2 mb-2 text-white shadow"
                    style={{ backgroundColor: isCustomPreset ? customColor : selectedPreset.color }}
                  >
                    Preset actif : {selectedPreset.name}
                  </div>
                  <p className="text-sm text-pink-700 mt-1">
                    {selectedPreset.logoUrl
                      ? 'Ce preset inclut un logo au centre du QR code.'
                      : 'Ce preset génère un QR code sans logo.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
            <div className={dark ? "bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6" : "bg-white rounded-xl shadow-sm border border-gray-200 p-6"}>
              <h2 className={"text-lg font-semibold mb-6 text-center " + (dark ? "text-zinc-100" : "text-gray-900")}>Aperçu du QR Code</h2>
              <div className="flex justify-center">
                <QRCodeGenerator
                  value={enableTracking && trackingUrl ? trackingUrl : inputValue}
                  preset={
                    isCustomPreset
                      ? { ...selectedPreset, color: customColor, logoUrl: customLogo || undefined }
                      : selectedPreset
                  }
                  size={qrSize}
                />
              </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={dark ? "bg-zinc-900 border-t border-zinc-800 mt-12" : "bg-white border-t border-gray-200 mt-12"}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>
              Développé par{' '}
              <span className="font-medium text-gray-700">Cloud du Cœur</span>
            </p>
            <p>
              Licence{' '}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-pink-600 hover:text-pink-700 hover:underline"
              >
                GPLv3
              </a>
              {' '}—{' '}
              <a
                href="https://github.com/cloudducoeur/coeurcode"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-pink-600 hover:text-pink-700 hover:underline"
              >
                Code source sur GitHub
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              © {new Date().getFullYear()} CoeurCode
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
