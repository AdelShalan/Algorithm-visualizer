import { useState, useEffect } from 'react';

export function useAlgorithmData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    import('../api/client.js').then(({ fetchAlgorithms }) =>
      fetchAlgorithms()
        .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
        .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } })
    );

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export function useAlgorithm(category, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category || !id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    import('../api/client.js').then(({ fetchAlgorithm }) =>
      fetchAlgorithm(category, id)
        .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
        .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } })
    );

    return () => { cancelled = true; };
  }, [category, id]);

  return { data, loading, error };
}

export function useDocs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    import('../api/client.js').then(({ fetchDocs }) =>
      fetchDocs()
        .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
        .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } })
    );

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}

export function useDoc(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    import('../api/client.js').then(({ fetchDoc }) =>
      fetchDoc(id)
        .then((res) => { if (!cancelled) { setData(res); setLoading(false); } })
        .catch((err) => { if (!cancelled) { setError(err); setLoading(false); } })
    );

    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
}
