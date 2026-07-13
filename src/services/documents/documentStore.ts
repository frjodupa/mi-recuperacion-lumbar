import { openDB } from 'idb';

const DB_NAME = 'mi-recuperacion-lumbar-documents';
const DB_VERSION = 1;
const STORE_NAME = 'files';

type FilesDb = {
  files: {
    key: string;
    value: Blob;
  };
};

async function getDb() {
  return openDB<FilesDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveDocumentFile(file: File) {
  const db = await getDb();
  const key = crypto.randomUUID();
  await db.put(STORE_NAME, file, key);
  return key;
}

export async function getDocumentFile(key: string) {
  const db = await getDb();
  return db.get(STORE_NAME, key);
}

export async function deleteDocumentFile(key: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, key);
}
