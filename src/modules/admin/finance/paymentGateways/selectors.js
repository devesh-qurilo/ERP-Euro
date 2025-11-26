const root = s => s.admin?.paymentGateways || {};

export const selectPaymentGateways = s => root(s).items || [];
export const selectPaymentGatewaysLoading = s => !!root(s).loading;
export const selectPaymentGatewaysCreating = s => !!root(s).creating;
export const selectPaymentGatewaysDeleting = s => !!root(s).deleting;
