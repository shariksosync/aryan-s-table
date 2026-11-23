import { useNavigate, isExternal } from "../utils/routing";

// Anchor that navigates in-app without a page reload; external links open safely in a new tab.
export function AppLink({ to, children, onClick, newTab, ...rest }) {
  const navigate = useNavigate();
  if (isExternal(to) || newTab) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
