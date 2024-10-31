import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <div className="mb-44 flex items-center justify-center flex-col space-y-4">
        <h2 className="text-xl font-bold">Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className="text-blue-400">
          Return Home
        </Link>
      </div>
    </div>
  );
}
