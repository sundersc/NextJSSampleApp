import { Pool } from "pg";

export const dynamic = "force-dynamic";

interface Product {
  [key: string]: string | number | boolean | null;
}

async function getProducts(): Promise<{ products: Product[]; columns: string[]; error?: string }> {
  const pool = new Pool({
    host: process.env.DB_ENDPOINT,
    port: 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? "mydb",
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });

  console.log(`[Products] Connecting to ${process.env.DB_ENDPOINT}:5432`);
  try {
    const client = await pool.connect();
    console.log("[Products] Connected successfully");
    try {
      const result = await client.query("SELECT * FROM Products");
      console.log(`[Products] Query returned ${result.rowCount} row(s)`);
      const columns = result.fields.map((f) => f.name);
      return { products: result.rows, columns };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[Products] Query error:", message);
      return { products: [], columns: [], error: message };
    } finally {
      client.release();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Products] Connection error:", message);
    return { products: [], columns: [], error: message };
  } finally {
    await pool.end();
    console.log("[Products] Connection pool closed");
  }
}

export default async function ProductsPage() {
  const { products, columns, error } = await getProducts();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Failed to load products</p>
          <p className="mt-1 font-mono text-sm">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left border-b border-r border-gray-300 font-semibold text-gray-700 last:border-r-0"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 border-b border-r border-gray-300 font-mono text-sm text-gray-800 last:border-r-0"
                    >
                      {row[col] === null ? (
                        <span className="text-gray-400 italic">null</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-gray-500">{products.length} row(s)</p>
        </div>
      )}
    </main>
  );
}
