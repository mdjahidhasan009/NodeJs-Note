export type User = {
	aud: any[];
	azp: string;
	email: string;
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	org_code: string;
	org_name: string;
	permissions: string[];
	roles: Role[];
	scp: string[];
	sub: string;
};

export type Role = {
	id: string;
	key: string;
	name: string;
};
