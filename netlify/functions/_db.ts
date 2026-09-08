import { MongoClient, type Db } from 'mongodb';

// Netlify Functions reuse the same warm Lambda container across nearby
// invocations. Caching the client on the module scope means most requests
// reuse an existing connection instead of opening a new one every time.
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it in Netlify: Site settings -> Environment variables.'
    );
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  // The database name is taken from the URI path (…mongodb.net/medispract?…).
  cachedDb = cachedClient.db();
  return cachedDb;
}
