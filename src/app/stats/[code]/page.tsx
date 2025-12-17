'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsData {
  scans: number;
  targetUrl: string;
  chartData: { date: string; count: number }[];
}

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    params.then((resolvedParams) => {
      setCode(resolvedParams.code);
      fetch(`/api/qrcodes/${resolvedParams.code}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">QR Code introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Statistiques du QR Code</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
              <p className="text-gray-600 mb-2 font-medium">Total des scans</p>
              <p className="text-4xl font-bold text-pink-600">{data.scans}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <p className="text-gray-600 mb-2 font-medium">Destination</p>
              <a 
                href={data.targetUrl}
                className="text-blue-600 hover:underline break-all font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.targetUrl}
              </a>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Évolution des scans</h2>
            {data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#E2147C" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Aucune donnée de scan disponible pour le graphique
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
