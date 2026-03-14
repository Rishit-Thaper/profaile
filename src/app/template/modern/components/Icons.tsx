import {
  FaBehance,
  FaDribbble,
  FaFigma,
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuExternalLink, LuMail, LuMapPin } from "react-icons/lu";

export const IconGithub = ({ size = 18 }: { size?: number }) => (
  <FaGithub size={size} />
);
export const IconLink = ({ size = 18 }: { size?: number }) => (
  <LuExternalLink size={size} />
);
export const IconMail = ({ size = 18 }: { size?: number }) => (
  <LuMail size={size} />
);
export const IconPin = ({ size = 14 }: { size?: number }) => (
  <LuMapPin size={size} />
);
export const IconLinkedin = ({ size = 18 }: { size?: number }) => (
  <FaLinkedin size={size} />
);
export const IconBehance = ({ size = 18 }: { size?: number }) => (
  <FaBehance size={size} />
);
export const IconDribbble = ({ size = 18 }: { size?: number }) => (
  <FaDribbble size={size} />
);
export const IconFigma = ({ size = 18 }: { size?: number }) => (
  <FaFigma size={size} />
);
export const IconTwitter = ({ size = 18 }: { size?: number }) => (
  <FaXTwitter size={size} />
);
export const IconMedium = ({ size = 18 }: { size?: number }) => (
  <FaMedium size={size} />
);
export const IconYoutube = ({ size = 18 }: { size?: number }) => (
  <FaYoutube size={size} />
);

export function Blob({
  color,
  className,
  style,
}: {
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      style={{ background: color, ...style }}
    />
  );
}
