// Thin wrapper over the app framework's built-in history so pages navigate with plain URL strings.
import { useRouter, useRouterState } from "@tanstack/react-router";

function parse(href) {
  const [pathAndQuery, hash] = String(href).split("#");
  const [path, query] = pathAndQuery.split("?");
  const search = query ? Object.fromEntries(new URLSearchParams(query)) : {};
  return { path: path || "/", search, hash };
}

export function useNavigate() {
  const router = useRouter();
  return (href, opts = {}) => {
    const { path, search, hash } = parse(href);
    return router.navigate({ to: path, search, hash, replace: !!opts.replace });
  };
}

export function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

export function useSearchParams() {
  return useRouterState({ select: (s) => s.location.search }) || {};
}

export const isExternal = (href) => /^https?:\/\//.test(String(href));
