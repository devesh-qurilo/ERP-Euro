export const selectClientProjects = s => s.admin.clientsViewProjects.items;
export const selectClientProjectsBusy = s =>
  s.admin.clientsViewProjects.loading;
export const selectClientProjectsError = s => s.admin.clientsViewProjects.error;
