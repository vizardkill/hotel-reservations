/**
 * Calcula los costos asociados a la reserva de una habitación, considerando:
 * - Tipo de habitación (con basePrice distinto).
 * - Fechas de checkIn y checkOut para determinar la cantidad de días/fin de semana.
 * - Descuentos según la duración de la estadía.
 * - Costo extra por “todo incluido” (allInclusive).
 *
 * @param {Date} checkInDate - Fecha de ingreso.
 * @param {Date} checkOutDate - Fecha de salida.
 * @param {string} roomType - Tipo de habitación (SENCILLA, DOBLE, PRESIDENCIAL).
 * @param {boolean} allInclusive - Indica si el plan es todo incluido.
 * @param {number} guests - Número de huéspedes.
 * @returns {{
 *  totalDays: number;
 *  weekDays: number;
 *  weekendDays: number;
 *  basePrice: number;
 *  weekendPriceIncrease: number;
 *  totalDiscount: number;
 *  allInclusiveCost: number;
 *  finalPrice: number;
 * }} - Detalle de costos.
 */
export function calculatePricing(
  checkInDate: Date,
  checkOutDate: Date,
  roomType: string,
  allInclusive: boolean,
  guests: number,
): {
  totalDays: number;
  weekDays: number;
  weekendDays: number;
  basePrice: number;
  weekendPriceIncrease: number;
  totalDiscount: number;
  allInclusiveCost: number;
  finalPrice: number;
} {
  const basePrices: { [key: string]: number } = {
    SENCILLA: 60000,
    DOBLE: 100000,
    PRESIDENCIAL: 160000,
  };
  const basePrice = basePrices[roomType] || 0;

  // Calcular total de días (diferencia en días naturales)
  const totalDays = Math.ceil(
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Determinar la cantidad de días de fin de semana (viernes y sábado)
  const weekendDays = countWeekendDays(checkInDate, checkOutDate);
  const weekDays = totalDays - weekendDays;

  // Cálculo de incremento (20%) por fin de semana
  const weekendPriceIncrease = weekendDays * basePrice * 0.2;

  // Descuento por cantidad de noches (basado en totalDays)
  let discountPerNight = 0;
  if (totalDays >= 4 && totalDays <= 6) discountPerNight = 10000;
  else if (totalDays >= 7 && totalDays <= 9) discountPerNight = 20000;
  else if (totalDays > 10) discountPerNight = 30000;
  const totalDiscount = discountPerNight * totalDays;

  // Costo adicional por “todo incluido”
  const allInclusiveCost = allInclusive ? totalDays * guests * 25000 : 0;

  // Precio final combinando todos los factores
  const finalPrice =
    weekDays * basePrice +
    weekendDays * (basePrice * 1.2) -
    totalDiscount +
    allInclusiveCost;

  return {
    totalDays: totalDays || 0,
    weekDays: weekDays || 0,
    weekendDays: weekendDays || 0,
    basePrice: basePrice || 0,
    weekendPriceIncrease: weekendPriceIncrease || 0,
    totalDiscount: totalDiscount || 0,
    allInclusiveCost: allInclusiveCost || 0,
    finalPrice: finalPrice || 0,
  };
}

/**
 * Cuenta la cantidad de días de fin de semana entre dos fechas, considerando viernes (día 5) y sábado (día 6).
 *
 * @param {Date} startDate - Fecha de inicio.
 * @param {Date} endDate - Fecha de fin.
 * @returns {number} - Número de días que caen en viernes o sábado.
 */
export function countWeekendDays(startDate: Date, endDate: Date): number {
  let count = 0;
  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const day = currentDate.getDay();
    // 5 (viernes) y 6 (sábado)
    if (day === 5 || day === 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}
