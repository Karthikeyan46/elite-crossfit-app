import { SUBSCRIPTION_TIERS, ROLE_PERMISSIONS } from './constants';

/**
 * Checks if a user has a specific permission based on their tier.
 * @param {string} tier - The user's subscription tier.
 * @param {string} permission - The permission key to check.
 * @returns {boolean}
 */
export const hasPermission = (tier, permission) => {
    const userTier = tier || SUBSCRIPTION_TIERS.FREE;
    return ROLE_PERMISSIONS[userTier]?.[permission] || false;
};

/**
 * Gets the current user's profile including subscription status.
 * @param {object} supabase - Initialized Supabase client.
 * @param {string} clientId - The ID of the logged-in client.
 * @returns {Promise<object|null>}
 */
export const getUserSubscriptionData = async (supabase, clientId) => {
    if (!clientId) return null;
    
    const { data, error } = await supabase
        .from('client_profiles')
        .select('role, subscription_tier')
        .eq('id', clientId)
        .single();
        
    if (error) {
        console.error('Error fetching subscription data:', error);
        return null;
    }
    
    return data;
};
