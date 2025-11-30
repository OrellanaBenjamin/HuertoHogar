export function normalizeString(str) {
  return String(str).trim().toLowerCase();
}
export function cleanRut(rut) {
  return String(rut).replace(/[\s.-]/g, '').toUpperCase();
}
export function rutDV(rut) {
  let sum = 0;
  let mult = 2;
  for (let i = rut.length - 1; i >= 0; i--) {
    sum += parseInt(rut[i]) * mult;
    mult++;
    if (mult > 7) mult = 2;
  }
  const dv = 11 - (sum % 11);
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return String(dv);
}
export function diffYearsFromToday(fechaStr) {
  if (!fechaStr) return null;
  try {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    let years = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      years--;
    }
    return years;
  } catch (e) {
    return null;
  }
}
export function result(ok, message, value = null, meta = null) {
  return { ok, message, value, meta };
}