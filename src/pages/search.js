// pages/search.jsx
import { useRouter } from 'next/router';

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ผลการค้นหา</h1>
      {query ? (
        <p>คำค้นหา: <strong>{query}</strong></p>
      ) : (
        <p>กำลังโหลด...</p>
      )}
    </div>
  );
};

// ✅ ต้อง export default คอมโพเนนต์นี้
export default SearchPage;
