import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.gpx')) {
      try {
        onFileSelect(file);
      } catch (error) {
        alert('Error processing GPX file: ' + (error as Error).message);
      }
    } else {
      alert('Please select a valid GPX file');
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="gpx-upload"
        className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-800 border-2 border-gray-700 border-dashed rounded-lg appearance-none cursor-pointer hover:border-lime-500 focus:outline-none"
      >
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-lime-500" />
          <span className="font-medium text-gray-300">
            Drop your GPX file here or click to browse
          </span>
          <span className="text-sm text-gray-500">
            Supported format: .gpx
          </span>
        </div>
        <input
          id="gpx-upload"
          type="file"
          className="hidden"
          accept=".gpx"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}