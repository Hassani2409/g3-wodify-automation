/** A saved lead is an accepted request, never a confirmed appointment.
 * @param {unknown} value
 * @returns {boolean}
 */
export function leadWasAccepted(value) {
  return value !== null && typeof value === 'object' &&
    'success' in value && value.success === true &&
    'lead_id' in value && typeof value.lead_id === 'string' && value.lead_id.trim().length > 0;
}
