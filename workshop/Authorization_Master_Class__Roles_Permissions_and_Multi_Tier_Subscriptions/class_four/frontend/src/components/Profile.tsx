import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const Profile = () => {
	const { logout, user, isLoading } = useKindeAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Hello, {user?.given_name}</h1>
			<button onClick={logout}>Logout</button>
		</div>
	);
};
