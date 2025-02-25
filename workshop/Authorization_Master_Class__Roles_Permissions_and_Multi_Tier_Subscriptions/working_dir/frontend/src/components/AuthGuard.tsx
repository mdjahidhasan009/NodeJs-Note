import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { ReactNode } from 'react';
import { usePermissionManager } from '../hooks/usePermissionManager';

export type AuthGuardProps = {
	children: ReactNode;
	requiredRole?: string;
	requiredPermissions?: string | string[];
	fallback?: ReactNode;
	showLoading?: boolean;
	loadingFallback?: ReactNode;
};

export const AuthGuard = ({
	children,
	requiredRole,
	requiredPermissions,
	fallback,
	showLoading = false,
	loadingFallback = <DefaultLoadingFallback />,
}: AuthGuardProps) => {
	const auth = useKindeAuth();
	const pm = usePermissionManager();

	const checkRole = () => {
		if (!requiredRole) return true;
		return pm?.hasRole(requiredRole) ?? false;
	};

	const checkPermissions = () => {
		if (!requiredPermissions) return true;

		if (Array.isArray(requiredPermissions)) {
			return pm?.hasPermissions(requiredPermissions) ?? false;
		}

		return pm?.hasPermission(requiredPermissions) ?? false;
	};

	if (auth.isLoading) {
		return showLoading ? loadingFallback : null;
	}

	if (!auth.isAuthenticated || !pm) {
		return fallback ?? null;
	}

	const hasAccess = checkRole() && checkPermissions();
	return hasAccess ? children : fallback ?? null;
};

const DefaultLoadingFallback = () => {
	return <div>Loading...</div>;
};

export const HasRole = (
	props: Omit<AuthGuardProps, 'requiredPermissions'> & { requiredRole: string }
) => {
	return <AuthGuard {...props} />;
};

export const HasPermission = (
	props: Omit<AuthGuardProps, 'requiredRole'> & {
		requiredPermissions: string | string[];
	}
) => {
	return <AuthGuard {...props} />;
};

export const HasRoleAndPermission = (
	props: AuthGuardProps & {
		requiredRole: string;
		requiredPermissions: string | string[];
	}
) => {
	return <AuthGuard {...props} />;
};
