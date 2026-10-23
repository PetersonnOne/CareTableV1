import Image from "next/image";

export function BrandLogo() {
  return <Image className="brand-logo" src="/brand/caretable-logo-midnight-v1.png" alt="CareTable" width={1983} height={793} sizes="(max-width: 700px) 150px, 184px" />;
}
