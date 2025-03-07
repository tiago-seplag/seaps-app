export function generateMetaPagination(
  page: number,
  perPage: number,
  total: number,
) {
  const current_page = Number(page || 1);
  const per_page = Number(perPage || 10);
  const last_page = Math.ceil(total / per_page);

  const next_page =
    current_page < last_page ? "?page=" + (current_page + 1) : null;

  const prev_page = current_page > 1 ? "?page=" + (current_page - 1) : null;

  return {
    total,
    current_page,
    last_page,
    per_page,
    prev_page,
    next_page,
  };
}
