export const selectAdminProfileUpdating = s =>
  s.admin?.settings?.profileUpdating;
export const selectAdminProfileUpdateError = s =>
  s.admin?.settings?.profileUpdateError;
export const selectAdminLastProfile = s => s.admin?.settings?.lastProfile;

export const selectCompany = s => s.admin?.settings?.company;
export const selectCompanyLoading = s => s.admin?.settings?.companyLoading;
export const selectCompanyError = s => s.admin?.settings?.companyError;
export const selectCompanySaving = s => s.admin?.settings?.companySaving;
export const selectCompanySaveError = s => s.admin?.settings?.companySaveError;
export const selectCompanyLastSaved = s => s.admin?.settings?.lastCompanySaved;
