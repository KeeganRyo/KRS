import 'server-only';
import { db } from './db';
import { clientIp } from './session';

// true kalau permintaan boleh lanjut. Kalau database bermasalah, tetap izinkan
// (fitur inti tidak boleh mati hanya karena throttle gagal).
export async function allow(bucket, max, windowSeconds) {
  const key = `${bucket}:${await clientIp()}`;
  const { data, error } = await db().rpc('throttle_hit', { p_key: key, p_max: max, p_window_seconds: windowSeconds });
  if (error) {
    console.error('[throttle]', bucket, error.message);
    return true;
  }
  return data === true;
}

// Kode kartu yang tidak ada: dibatasi per IP, supaya kode kartu yang belum aktif
// tidak bisa ditebak beruntun lalu diaktifkan orang lain.
export const codeMissAllowed = () => allow('code-miss', 30, 600);
