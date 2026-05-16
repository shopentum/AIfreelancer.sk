import { useEffect } from "react";

const BASE_TITLE = "Kanban Dashboard";

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    const full = pageTitle === BASE_TITLE ? BASE_TITLE : `${pageTitle} | ${BASE_TITLE}`;
    document.title = full;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
}
