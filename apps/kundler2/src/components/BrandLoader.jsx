import { useEffect, useState } from "react";

const BRAND_LOGO =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDMwIDMwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjEwNzI5NiwwLDAsMC4xMDcyOTYsMCwwKSI+CiAgICAgICAgPHBhdGggZD0iTTE1OC4zLDIxMi45TDE1OC4zLDY3LjJDMTU4LjMsNTUuNCAxNTMuNCw1MS42IDE0Mi4yLDUxLjZMMTA4LjgsNTEuNkwxMDguOCw2Ny43TDExMi41LDY3LjdDMTE4LjcsNjcuNyAxMjEuMiw3MCAxMjEuMiw3Ny4yTDEyMS4yLDIxMi45TDE1OC4zLDIxMi45Wk0xNzguMSwyMTIuOUwyMTQsMjEyLjlMMjE0LDEwMi45QzIxNCw5MS44IDIwOS4xLDg3LjMgMTk3LjksODcuM0wxNzguMSw4Ny4zTDE3OC4xLDIxMi45Wk0xMDEuNCwyMTIuOUwxMDEuNCw4Ny4zTDgxLjYsODcuM0M3MC41LDg3LjMgNjUuNSw5MS44IDY1LjUsMTAyLjlMNjUuNSwyMTIuOUwxMDEuNCwyMTIuOVpNMjU2LjEsMTM5LjdDMjU2LjEsMjA3LjkgMjA2LjYsMjU3LjYgMTM5LjgsMjU3LjZDNzMsMjU3LjYgMjMuNSwyMDcuOCAyMy41LDEzOS43QzIzLjUsNzEuNiA3MywyMS44IDEzOS44LDIxLjhDMjA2LjYsMjEuOCAyNTYuMSw3MS41IDI1Ni4xLDEzOS43TTI3OS42LDEzOS43QzI3OS42LDU5LjkgMjIwLjIsMCAxMzkuOCwwQzYwLjYsMCAwLDU5LjkgMCwxMzkuN0MwLDIxOS43IDYwLjYsMjc5LjYgMTM5LjgsMjc5LjZDMjIwLjIsMjc5LjYgMjc5LjYsMjE5LjcgMjc5LjYsMTM5LjciIHN0eWxlPSJmaWxsOnJnYigwLDU1LDEyOSk7Ii8+CiAgICA8L2c+Cjwvc3ZnPg==";

export default function BrandLoader({ duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* ✅ Yellow (#f5c400) */}
        <img
          src={BRAND_LOGO}
          alt="Brand logo"
          className="h-12 w-auto animate-pulse
            [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(95%)_saturate(2000%)_hue-rotate(5deg)_brightness(102%)_contrast(98%)]"
        />

        <span className="text-xs tracking-wide text-gray-500">
          Bitte warten
        </span>
      </div>
    </div>
  );
}
