import Image from 'next/image';
import Link from 'next/link';

export default function Header({ name }) {
  return (
    <header className="pt-20 pb-12">
      <Link href="/">
        <Image src="/logo.png" alt={`${name} logo`} width={64} height={64} className="block mx-auto mb-4" />
      </Link>
      <p className="text-2xl dark:text-white text-center">
        <Link href="/">
          {name}
        </Link>
      </p>
    </header>
  );
}
