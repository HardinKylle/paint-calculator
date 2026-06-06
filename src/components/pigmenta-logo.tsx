import Image, { type ImageProps } from "next/image";

type PigmentaLogoProps = Omit<ImageProps, "src" | "alt" | "width" | "height">;

export function PigmentaLogo({
  className,
  ...props
}: PigmentaLogoProps) {
  return (
    <Image
      src="/pigmenta-logo-v2.png"
      alt="Pigmenta logo"
      width={56}
      height={56}
      data-logo-mark="pigmenta"
      className={["object-contain", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
