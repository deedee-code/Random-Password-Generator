import PasswordGenerator from '../components/PasswordGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto">
        <PasswordGenerator />
      </div>
    </div>
  );
}
