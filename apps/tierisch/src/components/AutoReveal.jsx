import Reveal from "./Reveal";

export default function AutoReveal({
  index = 0,
  children,
  baseDelay = 90,
  maxDelay = 400,
}) {
  const delay = Math.min(index * baseDelay, maxDelay);
  return <Reveal delay={delay}>{children}</Reveal>;
}
