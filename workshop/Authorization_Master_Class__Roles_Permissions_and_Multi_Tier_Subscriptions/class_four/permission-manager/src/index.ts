import { FreeTrialPolicy } from './policy/policies/FreeTrialPolicy';
import { RegistrationPolicy } from './policy/policies/RegitrationPolicy';
import { PolicyBuilder } from './policy/Policy';

const accessFreeTrial = async (
	userid: number,
	email: string,
	password: string
) => {
	//  do other stuffs
	const policyGroup = PolicyBuilder.create('FreeTrialPolicyGroup')
		.addPolicy(new RegistrationPolicy())
		.addPolicy(new FreeTrialPolicy())
		.build();

	const { allowed, reason, name } = await policyGroup.can({
		userId: userid,
		email,
	});

	if (!allowed) {
		console.error(
			`[${name}] User ${userid} cannot access free trial: ${reason}`
		);
		return;
	}
	// do the main operation

	console.log(`[${name}] User ${userid} can access free trial`);
	return {
		success: true,
		message: `trial access granted for user ${userid}`,
	};
};

accessFreeTrial(10, 'hmnayem@stacklearner.com', 'password');
