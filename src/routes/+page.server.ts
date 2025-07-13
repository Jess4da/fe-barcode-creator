import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => {
  const queryParams = Object.fromEntries(url.searchParams);
  const query: IPageQuery = {
    text: queryParams.text || "",
  };
  return { query };
};
