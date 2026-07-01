let roles = [];

export const createRole = (data) => {
  const newRole = {
    id: Date.now(),
    ...data,
  };

  roles.push(newRole);
  return Promise.resolve(newRole);
};

export const getRoles = () => {
  return Promise.resolve(roles);
};

export const deleteRole = (id) => {
  roles = roles.filter((role) => role.id !== id);
  return Promise.resolve(true);
};

export const updateRole = (id, updatedData) => {
  roles = roles.map((role) =>
    role.id === id ? { ...role, ...updatedData } : role,
  );

  return Promise.resolve(true);
};
