import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const CallAPI = () => {
	const { getToken } = useKindeAuth();

	const handleCallAPI = async () => {
		if (!getToken) return;

		const token = await getToken();
		const response = await fetch('http://localhost:4500', {
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
			},
		});
		const data = await response.json();
		console.log('Incoming data', data);
	};

	return (
		<div>
			<button onClick={handleCallAPI}>Call API</button>
		</div>
	);
};
