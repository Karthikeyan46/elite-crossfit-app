export const SUBSCRIPTION_TIERS = {
    FREE: 'free',
    PRO: 'pro',
    ELITE: 'elite'
};

export const ROLE_PERMISSIONS = {
    [SUBSCRIPTION_TIERS.FREE]: {
        canAccessTrainerDashboard: true,
        canManageClients: true,
        maxClients: 20
    },
    [SUBSCRIPTION_TIERS.PRO]: {
        canAccessTrainerDashboard: true,
        canManageClients: true,
        maxClients: 20
    },
    [SUBSCRIPTION_TIERS.ELITE]: {
        canAccessTrainerDashboard: true,
        canManageClients: true,
        maxClients: 100
    }
};
