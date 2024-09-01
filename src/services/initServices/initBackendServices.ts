import rolesServices from '../../authentication/roles/services/roles.services';
import usersServices from '../../modules/users/services/users.services';

export const initBackendServices = async () => {
	await rolesServices.init();
	await usersServices.init();
};
