import type { GlobalThemeOverrides } from "naive-ui";

export const naiveThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#2563eb",
    primaryColorHover: "#1d4ed8",
    primaryColorPressed: "#1e40af",
    primaryColorSuppl: "#2563eb",
    borderRadius: "12px",
    borderRadiusSmall: "10px",
    textColorBase: "#0f172a",
    textColor2: "rgba(15, 23, 42, 0.72)",
    textColor3: "rgba(15, 23, 42, 0.56)",
    iconColor: "rgba(15, 23, 42, 0.62)",
    iconColorHover: "rgba(15, 23, 42, 0.78)",
    iconColorPressed: "rgba(15, 23, 42, 0.78)",
  },
  Layout: {
    color: "rgba(255, 255, 255, 0)",
    siderColor: "rgba(255, 255, 255, 0.72)",
    headerColor: "rgba(255, 255, 255, 0.72)",
  },
  Card: {
    borderRadius: "14px",
    paddingSmall: "14px 14px",
    paddingMedium: "18px 18px",
    titleFontSizeSmall: "14px",
    titleFontSizeMedium: "16px",
  },
  Button: {
    borderRadiusSmall: "10px",
    borderRadiusMedium: "12px",
    borderRadiusLarge: "12px",
    heightSmall: "28px",
    heightMedium: "34px",
    heightLarge: "40px",
    fontWeight: "600",
  },
  Input: {
    borderRadius: "12px",
    paddingMedium: "0 12px",
    heightMedium: "34px",
  },
  Select: {
    borderRadius: "12px",
    peers: {
      InternalSelection: {
        borderRadius: "12px",
      },
    },
  },
  Menu: {
    borderRadius: "12px",
    itemBorderRadius: "10px",
  },
  Radio: {
    buttonBorderRadius: "12px",
  },
};

