const DemoStatsSummary: React.FC = () => {
  return (
    <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Demo Mağaza Özeti</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">Toplam Demo Satış</p>
          <p className="text-2xl font-bold text-blue-900">₺125.750</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 font-medium">Toplam Demo Sipariş</p>
          <p className="text-2xl font-bold text-green-900">175</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-700 font-medium">Ort. Sipariş Değeri (Demo)</p>
          <p className="text-2xl font-bold text-indigo-900">₺718.57</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        *Bu veriler, son 1 yıllık simüle edilmiş demo mağaza aktivitesine dayanmaktadır.
      </p>
    </div>
  );
};

export default DemoStatsSummary; 