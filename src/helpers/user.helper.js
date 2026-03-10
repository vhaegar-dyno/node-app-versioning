function hasSiteAccess(userSites = [], sitesToCheck = []) {
	const unauthorizedSite = sitesToCheck.find((id) => !userSites.includes(id));
	if (unauthorizedSite) return false;

	return true;
}

function findAccessRecursively(accessObject, moduleList = [], actionType) {
	if (!accessObject || !moduleList?.length) return false;

	const keyToAppend = moduleList[0];
	const currentModule = accessObject?.[keyToAppend];

	if (!currentModule) return false;
	if (moduleList.length === 1) {
		if (actionType) return !!currentModule?.action?.[actionType];
		return true;
	}
	return findAccessRecursively(currentModule?.children, moduleList.slice(1), actionType);
}

function findUserAccess(user, module = [], actionType = 'read') {
	return findAccessRecursively(user?.featureAccess?.access, module, actionType);
}

module.exports = {
	hasSiteAccess,
	findUserAccess,
};
