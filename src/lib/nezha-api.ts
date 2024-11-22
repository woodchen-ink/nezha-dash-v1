export const fetchUsers = async (token: string) => {
  const response = await fetch("http://localhost:8008/api/v1/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

export const createUser = async (
  token: string,
  username: string,
  password: string,
) => {
  const response = await fetch(`http://localhost:8008/api/v1/user`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

export const deleteUser = async (token: string, ids: number[]) => {
  const response = await fetch(
    `http://localhost:8008/api/v1/batch-delete/user`,
    {
      method: "POST",
      body: JSON.stringify(ids),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

export const fetchServers = async (token: string) => {
  const response = await fetch("http://localhost:8008/api/v1/server", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};

export const deleteServer = async (token: string, ids: number[]) => {
  const response = await fetch(
    `http://localhost:8008/api/v1/batch-delete/server`,
    {
      method: "POST",
      body: JSON.stringify(ids),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
};
