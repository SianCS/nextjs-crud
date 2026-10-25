import { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren;

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center items-center h-full">{children}</div>
  );
}
