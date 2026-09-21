/**
 * Reassignment mutations for soft-deletable tables (classCatechists,
 * branchAssignments, academicYearAssignments, ...) soft-delete the old row
 * and insert a new one instead of patching in place. A live key can
 * therefore have both a deleted and a non-deleted row at once, so
 * `.first()` on such an index returns insertion order, not "the active
 * one" — use this instead.
 */
export async function firstActive<T extends { isDeleted: boolean }>(q: {
  collect: () => Promise<Array<T>>
}): Promise<T | null> {
  const rows = await q.collect()
  return rows.find((r) => !r.isDeleted) ?? null
}
