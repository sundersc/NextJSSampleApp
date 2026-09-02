import { headers } from "next/headers";

export default function Home() {
  const headersList = headers();
  const headerEntries = Array.from(headersList.entries());

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Request Headers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b border-r border-gray-300 font-semibold text-gray-700">
                Header
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-300 font-semibold text-gray-700">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {headerEntries.map(([name, value], index) => (
              <tr
                key={name}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border-b border-r border-gray-300 font-mono text-sm text-blue-700">
                  {name}
                </td>
                <td className="px-4 py-2 border-b border-gray-300 font-mono text-sm text-gray-800 break-all">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
