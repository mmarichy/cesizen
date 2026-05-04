"use client";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

export type SearchFieldProps = Pick<
  TextFieldProps,
  | "disabled"
  | "fullWidth"
  | "autoFocus"
  | "name"
  | "id"
  | "inputRef"
  | "size"
> & {
  value: string;
  onChange: TextFieldProps["onChange"];
  /** Texte affiché quand le champ est vide (ex. « Rechercher un article… »). */
  placeholder?: string;
  /** Libellé accessible ; obligatoire si aucun libellé visible n’est associé au champ. */
  "aria-label"?: string;
  /** Largeur max du champ (nombre en px ou clé thème). Défaut : 560. */
  maxWidth?: number | string;
  /** Masquer l’icône loupe en début de champ. Défaut : `false`. */
  hideStartIcon?: boolean;
  /** Affiche une croix pour vider le champ lorsque `value` n’est pas vide. */
  showClearButton?: boolean;
  /** Appelé au clic sur la croix (souvent vider la valeur côté parent / URL). */
  onClear?: () => void;
  /** Libellé accessible du bouton effacer. Défaut : « Effacer la recherche ». */
  clearButtonAriaLabel?: string;
  sx?: TextFieldProps["sx"];
};

export function SearchField({
  value,
  onChange,
  placeholder = "Rechercher…",
  "aria-label": ariaLabel = "Recherche",
  fullWidth = true,
  maxWidth = 560,
  hideStartIcon = false,
  showClearButton = false,
  onClear,
  clearButtonAriaLabel = "Effacer la recherche",
  sx,
  ...rest
}: SearchFieldProps) {
  const showClear =
    showClearButton &&
    onClear !== undefined &&
    value.length > 0;

  return (
    <TextField
      {...rest}
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      variant="outlined"
      slotProps={{
        htmlInput: {
          "aria-label": ariaLabel,
        },
        input: {
          ...(hideStartIcon
            ? {}
            : {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "grey.700",
                        fontSize: 22,
                      }}
                    />
                  </InputAdornment>
                ),
              }),
          ...(showClear
            ? {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ mr: 0.5 }}>
                    <IconButton
                      type="button"
                      size="small"
                      onClick={onClear}
                      aria-label={clearButtonAriaLabel}
                      edge="end"
                      sx={{
                        color: "grey.600",
                        "&:hover": {
                          color: "grey.900",
                          backgroundColor:
                            "rgba(15, 23, 42, 0.06)",
                        },
                      }}>
                      <ClearIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}),
        },
      }}
      sx={{
        maxWidth,
        "& .MuiOutlinedInput-root": {
          borderRadius: 9999,
          backgroundColor: "#fff",
          color: "grey.900",
          boxShadow:
            "0 1px 2px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.06)",
          transition:
            "box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            boxShadow:
              "0 2px 6px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.06)",
          },
          "&.Mui-focused": {
            boxShadow:
              "0 4px 14px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.08)",
          },
          "& fieldset": {
            borderColor: "grey.400",
            borderWidth: "1px",
          },
          "&:hover fieldset": {
            borderColor: "grey.600",
          },
          "&.Mui-focused fieldset": {
            borderWidth: "2px",
            borderColor: "primary.dark",
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: "grey.700",
            opacity: 1,
          },
          ...(hideStartIcon
            ? {
                "& .MuiOutlinedInput-input": {
                  paddingLeft: "16px",
                },
              }
            : {}),
        },
        ...sx,
      }}
    />
  );
}
