import odmLogo from "@/assets/ODM_logo_배경없.png";

type OdmLogoProps = {
  className?: string;
  invert?: boolean;
};

export default function OdmLogo({ className = "", invert = false }: OdmLogoProps) {
  return (
    <img
      src={odmLogo}
      alt="ODM"
      className={`odm-shared-logo select-none object-contain ${invert ? "brightness-0 invert" : ""} ${className}`}
      draggable="false"
    />
  );
}
