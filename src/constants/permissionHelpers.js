import { useContext, useState, useEffect } from "react";
import GlobalContext from "contexts/globalContext/GlobalContext";

export const permissionChecker = (role_permissions, validPermissions) => {
  let answer = { view: false, edit: false };
  if (!role_permissions?.is_member) return answer;
  if (role_permissions?.owner) {
    return { view: true, edit: true };
  }
  if (role_permissions?.admin || validPermissions?.all) {
    answer.view = true;
  }
  if (!validPermissions) return answer;
  let validPermissionsdArray = Object.entries(validPermissions)
    .filter((perm) => perm[1])
    .map((perm) => perm[0]);
  validPermissionsdArray.map((permission) => {
    if (role_permissions?.[permission]) {
      answer.view = true;
      answer.edit = true;
    }
    return null;
  });
  return answer;
};

export const PermissionChecker = ({ valid, type, onFalse, children }) => {
  const store = useContext(GlobalContext);
  const [permission, setPermission] = useState({ view: false, edit: false });

  useEffect(() => {
    if (store.role) {
      setPermission(permissionChecker(store.role.role_permissions, valid));
    }
     
  }, [store.role]);

  if (permission[type]) {
    return children;
  } else if (onFalse) {
    return onFalse();
  } else {
    return null;
  }
};

export const permissionExchanger = {
  default: {
    owner: "Owner",
    admin: "Admin",
    member: "Team Member",
    manager: "Team Manager",
  },
  //red knight
  15538: {
    owner: "Owner",
    admin: "Executive Producer",
    member: "Associate Producer",
    manager: "Producer",
  },
};

export const rolesExchanger = {
  default: {
    recruiter: "Recruiter",
    hiring_manager: "Hiring Manager",
    business: "Business Dev",
    marketer: "Marketer",
  },
  //red knight
  15538: {
    recruiter: "Recruiter",
    hiring_manager: "Hiring Manager",
    business: "Productions",
    marketer: "Marketing",
  },
};
