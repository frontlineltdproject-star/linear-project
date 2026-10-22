type InvoicingAssignment = {
  invoicingCompany: { id: unknown; name: string }
  vessel?: { id: unknown } | null
}

export function eligibleInvoicingAssignments<T extends InvoicingAssignment>(
  assignments: Array<T>,
  vesselId: string,
) {
  return Array.from(
    new Map(
      assignments
        .filter(
          (assignment) =>
            !assignment.vessel || String(assignment.vessel.id) === vesselId,
        )
        .map((assignment) => [
          String(assignment.invoicingCompany.id),
          assignment,
        ]),
    ).values(),
  )
}

