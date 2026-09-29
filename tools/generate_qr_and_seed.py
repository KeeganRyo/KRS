"""Baca cards.csv, buat QR (pakai domain asli) dan seed.sql.

Pakai: pip install qrcode[pil]
       python3 generate_qr_and_seed.py https://domainlu.com/c
Untuk kartu baru: python3 generate_qr_and_seed.py https://domainlu.com/c --new 20
(menambah 20 kode baru ke cards.csv tanpa mengubah kode lama)
"""
import csv, secrets, sys
import qrcode
from qrcode.constants import ERROR_CORRECT_M

ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
base = sys.argv[1].rstrip("/")
new = int(sys.argv[sys.argv.index("--new") + 1]) if "--new" in sys.argv else 0

codes = []
try:
    with open("cards.csv") as f:
        codes = [r["code"] for r in csv.DictReader(f)]
except FileNotFoundError:
    pass

existing = set(codes)
for _ in range(new):
    while True:
        c = "".join(secrets.choice(ALPHABET) for _ in range(6))
        if c not in existing:
            break
    existing.add(c)
    codes.append(c)

with open("cards.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["code", "url"])
    for c in codes:
        w.writerow([c, f"{base}/{c}"])

for c in codes:
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=20, border=2)
    qr.add_data(f"{base}/{c}")
    qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(f"qr_{c}.png")

with open("seed.sql", "w") as f:
    f.write("insert into cards (code) values\n")
    f.write(",\n".join(f"  ('{c}')" for c in codes))
    f.write("\non conflict (code) do nothing;\n")

print(f"{len(codes)} kartu. Link contoh: {base}/{codes[0]}")
