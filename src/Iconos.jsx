/* Iconos propios: trazo fino, esquinas vivas y remate recto, como un grabado o un signo de imprenta.
   Mantienen la firma de lucide-react (size, color, strokeWidth, style…) para sustituirlos sin tocar los usos. */
const base = (d, relleno) => function Icono({ size = 16, strokeWidth = 1.5, color = "currentColor", style, className, ...r }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="butt" strokeLinejoin="miter" aria-hidden="true" focusable="false" style={{ flex: "none", ...style }} className={className} {...r}>
      {d}{relleno}
    </svg>
  );
};
export const Search = base(<><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5 21 21" /></>);
export const BookOpen = base(<><path d="M12 6v14M12 6C9.5 4.5 6 4.2 3 5v14c3-.8 6.5-.5 9 1M12 6c2.5-1.5 6-1.8 9-1v14c-3-.8-6.5-.5-9 1" /></>);
export const Network = base(<><path d="M12 7v5M5 17v-5h14v5M12 7" /><rect x="9" y="3" width="6" height="4" /><rect x="2" y="17" width="6" height="4" /><rect x="16" y="17" width="6" height="4" /></>);
export const ClipboardList = base(<><path d="M8 4H5v17h14V4h-3" /><rect x="8" y="2.5" width="8" height="3.5" /><path d="M8.5 11h7M8.5 15h7" /></>);
export const Languages = base(<><path d="M3 5h10M8 3v2M5 5c.5 4 3 7 7 9M11 5c-.5 3.5-3 7-8 9" /><path d="m13 21 4.5-10L22 21M14.8 17.5h5.4" /></>);
export const ChevronRight = base(<path d="m9 5 7 7-7 7" />);
export const ChevronDown = base(<path d="m5 9 7 7 7-7" />);
export const Plus = base(<path d="M12 4v16M4 12h16" />);
export const Trash2 = base(<><path d="M4 6h16M10 3h4M6 6l1 15h10l1-15M10 10v7M14 10v7" /></>);
export const Save = base(<><path d="M4 3h13l3 3v15H4z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></>);
export const Download = base(<><path d="M12 3v12M6.5 10 12 15.5 17.5 10M4 21h16" /></>);
export const Upload = base(<><path d="M12 16V4M6.5 9 12 3.5 17.5 9M4 21h16" /></>);
export const X = base(<path d="m5 5 14 14M19 5 5 19" />);
export const Stamp = base(<><path d="M9 14V9a3 3 0 1 1 6 0v5l3 2v2H6v-2z" /><path d="M4 21h16" /></>);
export const AlertTriangle = base(<><path d="M12 3 2.5 20h19z" /><path d="M12 10v5M12 17.5v1" /></>);
export const FileText = base(<><path d="M5 3h9l5 5v13H5z" /><path d="M14 3v5h5M8.5 13h7M8.5 17h7" /></>);
export const Home = base(<><path d="m3 11 9-8 9 8M5.5 9.5V21h13V9.5M10 21v-6h4v6" /></>);
export const Scale = base(<><path d="M12 3v18M6 21h12M4 7h16" /><path d="m4 7-2.5 7a3.5 2.5 0 0 0 5 0zM20 7l-2.5 7a3.5 2.5 0 0 0 5 0z" /></>);
export const RotateCcw = base(<><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5" /></>);
export const Copy = base(<><rect x="8" y="8" width="13" height="13" /><path d="M16 8V3H3v13h5" /></>);
