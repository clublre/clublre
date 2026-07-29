export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass-through. Page-level layout is configured by each page's <Section />
  // + <Container /> primitives.
  return <>{children}</>;
}
