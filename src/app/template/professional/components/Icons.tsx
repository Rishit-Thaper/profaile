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
import { LuMail, LuMapPin } from "react-icons/lu";

export const IconGithub = ({ size = 18 }: { size?: number }) => (
  <FaGithub size={size} />
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

export const IconArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

export const IconMail = () => <LuMail size={16} />;

export const IconPin = () => <LuMapPin size={14} />;
