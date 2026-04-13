'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TOKEN_KEY = 'token';

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [allowed, setAllowed] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem(TOKEN_KEY);
		if (!token) {
			const target = pathname || '/admin';
			router.replace(`/login?redirect=${encodeURIComponent(target)}`);
			return;
		}
		setAllowed(true);
	}, [router, pathname]);

	if (!allowed) {
		return null;
	}

	return <>{children}</>;
}
