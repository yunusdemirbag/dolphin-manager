export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ayarlar</h2>
      <form className="space-y-6 max-w-xl bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Etsy Komisyon Oranı (%)</label>
          <input type="number" className="w-full border px-3 py-2 rounded" placeholder="Komisyon oranı girin" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Varsayılan Kargo Maliyeti (₺)</label>
          <input type="number" className="w-full border px-3 py-2 rounded" placeholder="Kargo maliyeti girin" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Anahtarı</label>
          <input type="password" className="w-full border px-3 py-2 rounded" placeholder="API anahtarı girin" />
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Kaydet</button>
        </div>
      </form>
    </div>
  );
} 