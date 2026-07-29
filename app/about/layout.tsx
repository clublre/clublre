export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass-through. Page-level layout is configured by each page's <Section />
  // + <Container /> primitives — keeping this minimal avoids clipping content
  // to max-w-lg.
  return <>{children}</>;
}
