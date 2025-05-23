import Image from 'next/image';

interface DemoProductCardProps {
  title: string;
  imageUrl: string;
  price: string;
  tags: string[];
}

const DemoProductCard: React.FC<DemoProductCardProps> = ({ title, imageUrl, price, tags }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden bg-white">
      <div className="relative w-full h-48">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-2 truncate" title={title}>{title}</h4>
        <p className="text-gray-700 mb-2 text-xl font-bold">{price}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <button className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Detayları Gör (Demo)
        </button>
      </div>
    </div>
  );
};

export default DemoProductCard; 