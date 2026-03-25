const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
}

const Svg = ({ children, size = 24, strokeWidth = 1.8, style = {}, ...props }) => (
  <svg
    {...baseProps}
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', ...style }}
    {...props}
  >
    {children}
  </svg>
)

const icon = (paths, options = {}) => {
  const Icon = ({ size, strokeWidth, style }) => (
    <Svg size={size} strokeWidth={strokeWidth ?? options.strokeWidth} style={style}>
      {paths}
    </Svg>
  )
  return Icon
}

export const ICONS = {
  retail: icon(
    <>
      <path d="M4 7h16l-1.5 8H5.5L4 7Z" />
      <path d="M7 7V5.8A1.8 1.8 0 0 1 8.8 4h6.4A1.8 1.8 0 0 1 17 5.8V7" />
      <path d="M9 11h6" />
      <circle cx="9" cy="19" r="1.2" />
      <circle cx="16" cy="19" r="1.2" />
    </>
  ),
  fmcg: icon(
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M8 9h8" />
      <path d="M8 13h4" />
      <path d="M15.5 13.5 17 15l2.5-3" />
    </>
  ),
  hospitality: icon(
    <>
      <path d="M7 20V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12" />
      <path d="M4 20h16" />
      <path d="M10 10h.01" />
      <path d="M14 10h.01" />
      <path d="M10 14h.01" />
      <path d="M14 14h.01" />
    </>
  ),
  banking: icon(
    <>
      <path d="M3 9 12 4l9 5" />
      <path d="M5 10v8" />
      <path d="M9.5 10v8" />
      <path d="M14.5 10v8" />
      <path d="M19 10v8" />
      <path d="M3 20h18" />
    </>
  ),
  transport: icon(
    <>
      <path d="M5 17h14" />
      <path d="M7 17V9l5-3 5 3v8" />
      <path d="M9 13h6" />
      <circle cx="9" cy="19" r="1.2" />
      <circle cx="15" cy="19" r="1.2" />
    </>
  ),
  buying: icon(
    <>
      <path d="M5 6h10l4 4v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z" />
      <path d="M15 6v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </>
  ),
  pricing: icon(
    <>
      <path d="M6 7h9l3 3-8.5 8.5a2.1 2.1 0 0 1-3 0l-1-1a2.1 2.1 0 0 1 0-3L14 6" />
      <circle cx="15.5" cy="8.5" r="1" />
    </>
  ),
  supply: icon(
    <>
      <rect x="4" y="7" width="7" height="10" rx="2" />
      <rect x="13" y="7" width="7" height="10" rx="2" />
      <path d="M11 12h2" />
      <path d="m9 10 2 2-2 2" />
    </>
  ),
  operations: icon(
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 5v2.2" />
      <path d="M12 16.8V19" />
      <path d="m16.95 7.05-1.55 1.55" />
      <path d="m8.6 15.4-1.55 1.55" />
      <path d="M19 12h-2.2" />
      <path d="M7.2 12H5" />
      <path d="m16.95 16.95-1.55-1.55" />
      <path d="M8.6 8.6 7.05 7.05" />
    </>
  ),
  marketing: icon(
    <>
      <path d="M5 15V8a2 2 0 0 1 2-2h6l4 4v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
      <path d="M13 6v4h4" />
      <path d="m9 15 2-3 2 2 2-3" />
    </>
  ),
  production: icon(
    <>
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="M8 18v2" />
      <path d="M16 18v2" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </>
  ),
  logistics: icon(
    <>
      <path d="M4 8h10v8H4Z" />
      <path d="M14 11h3l2 2v3h-5" />
      <circle cx="8" cy="18" r="1.4" />
      <circle cx="17" cy="18" r="1.4" />
    </>
  ),
  revenue: icon(
    <>
      <path d="M6 17V7" />
      <path d="M12 17V10" />
      <path d="M18 17V5" />
      <path d="M4 17h16" />
      <path d="m15 8 3-3 3 3" />
    </>
  ),
  guest: icon(
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 19a6 6 0 0 1 12 0" />
      <path d="m18.5 7.5 1 1 1.8-1.8" />
    </>
  ),
  workforce: icon(
    <>
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="16" cy="10" r="2" />
      <path d="M4.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M14 19a3.5 3.5 0 0 1 7 0" />
    </>
  ),
  risk: icon(
    <>
      <path d="M12 4 6 6.5v5.2c0 3.8 2.6 6.8 6 8.3 3.4-1.5 6-4.5 6-8.3V6.5L12 4Z" />
      <path d="m9.5 12 1.7 1.7 3.3-3.4" />
    </>
  ),
  acquisition: icon(
    <>
      <circle cx="10" cy="10" r="4" />
      <path d="m14 14 5 5" />
      <path d="M10 8v4" />
      <path d="M8 10h4" />
    </>
  ),
  retention: icon(
    <>
      <path d="M12 20s-6-3.5-6-9a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 18 11c0 5.5-6 9-6 9Z" />
    </>
  ),
  dispatch: icon(
    <>
      <path d="M5 18h14" />
      <path d="M6 15V9l6-3 6 3v6" />
      <path d="m10 12 2 2 4-4" />
    </>
  ),
  energy: icon(
    <>
      <path d="m13 3-6 10h4l-1 8 7-11h-4l0-7Z" />
    </>
  ),
  fraud: icon(
    <>
      <circle cx="11" cy="11" r="5" />
      <path d="m15 15 4 4" />
      <path d="M9.5 11h3" />
      <path d="M11 9.5v3" />
    </>
  ),
  forecast: icon(
    <>
      <path d="M4 17h16" />
      <path d="M6 14 10 10l3 2 5-5" />
      <path d="m15 7 3 0 0 3" />
    </>
  ),
  input: icon(
    <>
      <path d="M12 4v12" />
      <path d="m7 9 5-5 5 5" />
      <rect x="5" y="16" width="14" height="4" rx="2" />
    </>
  ),
  model: icon(
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
      <circle cx="17" cy="14" r="1.2" />
    </>
  ),
  output: icon(
    <>
      <path d="M12 20V8" />
      <path d="m7 15 5 5 5-5" />
      <rect x="5" y="4" width="14" height="4" rx="2" />
    </>
  ),
  alert: icon(
    <>
      <path d="M12 4a4 4 0 0 1 4 4v2.5l1.4 2.6A1 1 0 0 1 16.5 15h-9a1 1 0 0 1-.9-1.4L8 10.5V8a4 4 0 0 1 4-4Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </>
  ),
  results: icon(
    <>
      <path d="M5 12.5 9.5 17 19 7.5" />
    </>
  ),
  delivery: icon(
    <>
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m7 10 5 4 5-4" />
    </>
  ),
  action: icon(
    <>
      <path d="M12 20V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M7 15h10" />
    </>
  ),
  data: icon(
    <>
      <ellipse cx="12" cy="6.5" rx="6" ry="2.5" />
      <path d="M6 6.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" />
      <path d="M6 11.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" />
    </>
  ),
  weather: icon(
    <>
      <path d="M7 15a3.5 3.5 0 0 1 .5-7A4.5 4.5 0 0 1 16 9a3 3 0 0 1 1 6H7Z" />
      <path d="m9 19 1-2" />
      <path d="m13 19 1-2" />
    </>
  ),
  building: icon(
    <>
      <path d="M6 20V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
      <path d="M4 20h16" />
      <path d="M9 8h.01" />
      <path d="M12 8h.01" />
      <path d="M15 8h.01" />
      <path d="M9 12h.01" />
      <path d="M12 12h.01" />
      <path d="M15 12h.01" />
    </>
  ),
  occupancy: icon(
    <>
      <circle cx="8" cy="9" r="2.3" />
      <circle cx="16" cy="9" r="2.3" />
      <path d="M4.5 18a4 4 0 0 1 7 0" />
      <path d="M12.5 18a4 4 0 0 1 7 0" />
    </>
  ),
  meter: icon(
    <>
      <path d="M5 15a7 7 0 1 1 14 0" />
      <path d="m12 12 3-3" />
      <path d="M7 15h10" />
    </>
  ),
  history: icon(
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 5v4h4" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  genericIndustry: icon(<path d="M4 19h16M6 16V8h4v8m4 0V5h4v11" />),
  genericValueChain: icon(<><rect x="4" y="6" width="16" height="12" rx="3" /><path d="M8 12h8" /></>),
  genericUseCase: icon(<><rect x="5" y="5" width="14" height="14" rx="3" /><path d="M9 9h6" /><path d="M9 13h6" /></>),
  genericSource: icon(<><circle cx="12" cy="12" r="7" /><path d="M12 9v6" /><path d="M9 12h6" /></>),
}

export const Icon = ({ name, size = 24, strokeWidth, style }) => {
  const Component = ICONS[name] || ICONS.genericUseCase
  return <Component size={size} strokeWidth={strokeWidth} style={style} />
}
